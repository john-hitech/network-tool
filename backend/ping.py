import os
import socket
import struct
import select
import time
import platform
import zlib
import threading
import errno
import enum
from datetime import datetime

IP_HEADER_FORMAT = "!BBHHHBBHII"
ICMP_HEADER_FORMAT = "!BBHHH"
ICMP_TIME_FORMAT = "!d"
ICMP_DEFAULT_CODE = 0
SOCKET_SO_BINDTODEVICE = 25
BITS = 16


class IcmpType(enum.IntEnum):
    """Enum for Type in ICMP Header."""
    ECHO_REPLY = 0
    DESTINATION_UNREACHABLE = 3
    REDIRECT_MESSAGE = 5
    ECHO_REQUEST = 8
    ROUTER_ADVERTISEMENT = 9
    ROUTER_SOLICITATION = 10
    TIME_EXCEEDED = 11
    BAD_IP_HEADER = 12
    TIMESTAMP = 13
    TIMESTAMP_REPLY = 14

class IcmpTimeExceededCode(enum.IntEnum):
    """Enum for Code in ICMP Header when type is TIME_EXCEEDED (11)"""
    TTL_EXPIRED = 0
    FRAGMENT_REASSEMBLY_TIME_EXCEEDED = 1

class IcmpDestinationUnreachableCode(enum.IntEnum):
    """Enum for Code in ICMP Header when type is DESTINATION_UNREACHABLE (3)"""
    DESTINATION_NETWORK_UNREACHABLE = 0
    DESTINATION_HOST_UNREACHABLE = 1
    DESTINATION_PROTOCOL_UNREACHABLE = 2
    DESTINATION_PORT_UNREACHABLE = 3
    FRAGMENTATION_REQUIRED = 4
    SOURCE_ROUTE_FAILED = 5
    DESTINATION_NETWORK_UNKNOWN = 6
    DESTINATION_HOST_UNKNOWN = 7
    SOURCE_HOST_ISOLATED = 8
    NETWORK_ADMINISTRATIVELY_PROHIBITED = 9
    HOST_ADMINISTRATIVELY_PROHIBITED = 10
    NETWORK_UNREACHABLE_FOR_TOS = 11
    HOST_UNREACHABLE_FOR_TOS = 12
    COMMUNICATION_ADMINISTRATIVELY_PROHIBITED = 13
    HOST_PRECEDENCE_VIOLATION = 14
    PRECEDENCE_CUTOFF_IN_EFFECT = 15

class PingError(Exception):
    pass

class TimeExceeded(PingError):
    pass

class HostUnknown(PingError):
    def __init__(self, message="Cannot resolve: Unknown host.", dest_addr=None):
        self.dest_addr = dest_addr
        self.message = message if self.dest_addr is None else message + " (Host='{}')".format(self.dest_addr)
        super().__init__(self.message)

class Timeout(PingError):
    def __init__(self, message="Request timeout for ICMP packet.", timeout=None):
        self.timeout = timeout
        self.message = message if self.timeout is None else message + " (Timeout={}s)".format(self.timeout)
        super().__init__(self.message)

class TimeToLiveExpired(TimeExceeded):
    def __init__(self, message="Time exceeded: Time To Live expired.", ip_header=None, icmp_header=None):
        self.ip_header = ip_header
        self.icmp_header = icmp_header
        self.message = message
        super().__init__(self.message)

class DestinationUnreachable(PingError):
    def __init__(self, message="Destination unreachable.", ip_header=None, icmp_header=None):
        self.ip_header = ip_header
        self.icmp_header = icmp_header
        self.message = message if self.ip_header is None else message + " (Host='{}')".format(self.ip_header.get("src_addr"))
        super().__init__(self.message)

class DestinationHostUnreachable(DestinationUnreachable):
    def __init__(self, message="Destination unreachable: Host unreachable.", ip_header=None, icmp_header=None):
        self.ip_header = ip_header
        self.icmp_header = icmp_header
        self.message = message if self.ip_header is None else message + " (Host='{}')".format(self.ip_header.get("src_addr"))
        super().__init__(self.message)

class Ping:

    def send_ping(self, ip_address: str, size: int):
        result = self.ping(ip_address, unit="ms", size=size - 8, timeout=0.5)
        return {
            "ip_address": ip_address,
            "size": size,
            "time_ms": result,
            "time": datetime.now().strftime("%H:%M:%S:%f")
        }

    @staticmethod
    def checksum(source: bytes) -> int:
        carry = 1 << BITS  # 0x10000
        result = sum(source[::2]) + (sum(source[1::2]) << (BITS // 2))  # Even bytes (odd indexes) shift 1 byte to the left.
        while result >= carry:  # Ones' complement sum.
            result = sum(divmod(result, carry))  # Each carry add to right most bit.
        return ~result & ((1 << BITS) - 1)  # Ensure 16-bit

    @staticmethod
    def read_ip_header(raw: bytes) -> dict:
        def stringify_ip(ip: int) -> str:
            return ".".join(str(ip >> offset & 0xff) for offset in (24, 16, 8, 0))  # str(ipaddress.ip_address(ip))

        ip_header_keys = ('version', 'tos', 'len', 'id', 'flags', 'ttl', 'protocol', 'checksum', 'src_addr', 'dest_addr')
        ip_header = dict(zip(ip_header_keys, struct.unpack(IP_HEADER_FORMAT, raw)))
        ip_header['src_addr'] = stringify_ip(ip_header['src_addr'])
        ip_header['dest_addr'] = stringify_ip(ip_header['dest_addr'])
        return ip_header

    @staticmethod
    def read_icmp_header(raw: bytes) -> dict:
        icmp_header_keys = ('type', 'code', 'checksum', 'id', 'seq')
        return dict(zip(icmp_header_keys, struct.unpack(ICMP_HEADER_FORMAT, raw)))


    def send_one_ping(self, sock: socket.socket, dest_addr: str, icmp_id: int, seq: int, size: int) -> None:
        try:
            dest_addr = socket.gethostbyname(dest_addr)  # Domain name will translate into IP address, and IP address leaves unchanged.
        except socket.gaierror as err:
            raise HostUnknown(dest_addr=dest_addr) from err
        pseudo_checksum = 0  # Pseudo checksum is used to calculate the real checksum.
        icmp_header = struct.pack(ICMP_HEADER_FORMAT, IcmpType.ECHO_REQUEST, ICMP_DEFAULT_CODE, pseudo_checksum, icmp_id, seq)
        padding = (size - struct.calcsize(ICMP_TIME_FORMAT)) * "Q"  # Using double to store current time.
        icmp_payload = struct.pack(ICMP_TIME_FORMAT, time.time()) + padding.encode()
        real_checksum = self.checksum(icmp_header + icmp_payload)  # Calculates the checksum on the dummy header and the icmp_payload.
        icmp_header = struct.pack(ICMP_HEADER_FORMAT, IcmpType.ECHO_REQUEST, ICMP_DEFAULT_CODE, socket.htons(real_checksum), icmp_id, seq)  # Put real checksum into ICMP header.
        packet = icmp_header + icmp_payload
        sock.sendto(packet, (dest_addr, 0))  # addr = (ip, port). Port is 0 respectively the OS default behavior will be used.

    def receive_one_ping(self, sock: socket.socket, icmp_id: int, seq: int, timeout: float):
        has_ip_header = (os.name != 'posix') or (platform.system() == 'Darwin') or (sock.type == socket.SOCK_RAW)  # No IP Header when unprivileged on Linux.
        if has_ip_header:
            ip_header_slice = slice(0, struct.calcsize(IP_HEADER_FORMAT))  # [0:20]
            icmp_header_slice = slice(ip_header_slice.stop, ip_header_slice.stop + struct.calcsize(ICMP_HEADER_FORMAT))  # [20:28]
        else:
            icmp_header_slice = slice(0, struct.calcsize(ICMP_HEADER_FORMAT))  # [0:8]
        timeout_time = time.time() + timeout  # Exactly time when timeout.
        while True:
            timeout_left = timeout_time - time.time()  # How many seconds left until timeout.
            timeout_left = timeout_left if timeout_left > 0 else 0  # Timeout must be non-negative
            selected = select.select([sock, ], [], [], timeout_left)  # Wait until sock is ready to read or time is out.
            if selected[0] == []:  # Timeout
                raise Timeout(timeout=timeout)
            time_recv = time.time()
            recv_data, addr = sock.recvfrom(1500)  # Single packet size limit is 65535 bytes, but usually the network packet limit is 1500 bytes.
            if has_ip_header:
                ip_header_raw = recv_data[ip_header_slice]
                ip_header = self.read_ip_header(ip_header_raw)
            else:
                ip_header = None
            icmp_header_raw, icmp_payload_raw = recv_data[icmp_header_slice], recv_data[icmp_header_slice.stop:]
            icmp_header = self.read_icmp_header(icmp_header_raw)
            if not has_ip_header:  # When unprivileged on Linux, ICMP ID is rewrited by kernel.
                icmp_id = sock.getsockname()[1]  # According to https://stackoverflow.com/a/14023878/4528364
            if icmp_header['type'] == IcmpType.TIME_EXCEEDED:  # TIME_EXCEEDED has no icmp_id and icmp_seq. Usually they are 0.
                if icmp_header['code'] == IcmpTimeExceededCode.TTL_EXPIRED:  # Windows raw socket cannot get TTL_EXPIRED. See https://stackoverflow.com/questions/43239862/socket-sock-raw-ipproto-icmp-cant-read-ttl-response.
                    raise TimeToLiveExpired(ip_header=ip_header, icmp_header=icmp_header)  # Some router does not report TTL expired and then timeout shows.
                raise TimeExceeded()
            if icmp_header['type'] == IcmpType.DESTINATION_UNREACHABLE:  # DESTINATION_UNREACHABLE has no icmp_id and icmp_seq. Usually they are 0.
                if icmp_header['code'] == IcmpDestinationUnreachableCode.DESTINATION_HOST_UNREACHABLE:
                    raise DestinationHostUnreachable(ip_header=ip_header, icmp_header=icmp_header)
                raise DestinationUnreachable(ip_header=ip_header, icmp_header=icmp_header)
            if icmp_header['id']:
                if icmp_header['type'] == IcmpType.ECHO_REQUEST:  # filters out the ECHO_REQUEST itself.
                    continue
                if icmp_header['id'] != icmp_id:  # ECHO_REPLY should match the ICMP ID field.
                    continue
                if icmp_header['seq'] != seq:  # ECHO_REPLY should match the ICMP SEQ field.
                    continue
                if icmp_header['type'] == IcmpType.ECHO_REPLY:
                    time_sent = struct.unpack(ICMP_TIME_FORMAT, icmp_payload_raw[0:struct.calcsize(ICMP_TIME_FORMAT)])[0]
                    return time_recv - time_sent

    def ping(self, dest_addr: str, timeout: float = 4.0, unit: str = "s", seq: int = 0, size: int = 56, interface: str = ""):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)
        except PermissionError as err:
            if err.errno == errno.EPERM:  # [Errno 1] Operation not permitted]
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_ICMP)
            else:
                raise err
        with sock:
            if interface:
                sock.setsockopt(socket.SOL_SOCKET, SOCKET_SO_BINDTODEVICE, interface.encode())  # packets will be sent from specified interface.
            thread_id = threading.get_native_id() if hasattr(threading, 'get_native_id') else threading.currentThread().ident  # threading.get_native_id() is supported >= python3.8.
            process_id = os.getpid()  # If ping() run under different process, thread_id may be identical.
            icmp_id = zlib.crc32("{}{}".format(process_id, thread_id).encode()) & 0xffff  # to avoid icmp_id collision.
            try:
                self.send_one_ping(sock=sock, dest_addr=dest_addr, icmp_id=icmp_id, seq=seq, size=size)
                delay = self.receive_one_ping(sock=sock, icmp_id=icmp_id, seq=seq, timeout=timeout)  # in seconds
            except Timeout as err:
                return None
            except PingError as err:
                return None
            if delay is None:
                return None
            if unit == "ms":
                delay *= 1000  # in milliseconds
            return delay