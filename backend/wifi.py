from datetime import datetime
import netifaces
import CoreWLAN

class WiFi:
    def __init__(self):
        self.rssi = None
        self.noise = None
        self.snr = None
        self.router = None
        self.ip_address = None
        self.tx_rate = None
        self.channel = None
        self.physical_mode = None
        self.security = None
        self.time = None

    def get_data(self):
        self.time = datetime.now().strftime("%H:%M:%S")
        interface = CoreWLAN.CWInterface.interface()
        if not interface:
            return {
                "error": "No Interface Found"
            }

        self.process_raw_data(interface)
        return self.get_json()

    def process_raw_data(self, interface):
        default_gateway = netifaces.gateways().get("default", {})
        self.router = default_gateway.get(netifaces.AF_INET)[0]
        addresses = netifaces.ifaddresses(default_gateway.get(netifaces.AF_INET)[1])
        self.ip_address = addresses.get(netifaces.AF_INET)[0].get("addr")

        self.rssi = interface.rssiValue()
        self.noise = interface.noiseMeasurement()
        self.snr = self.rssi - self.noise
        self.tx_rate = interface.transmitRate()
        self.set_phy_mode(interface)
        self.set_channel_info(interface)
        self.set_security_into(interface)


    def set_phy_mode(self, interface):
        phy_mode_map = {
            0: "None",
            1: "802.11a",
            2: "802.11b",
            3: "802.11g",
            4: "802.11n",
            5: "802.11ac",
            6: "802.11ax (Wi-Fi 6)",
        }
        self.physical_mode = phy_mode_map[interface.activePHYMode()]

    def set_channel_info(self, interface):
        channel_info = interface.wlanChannel()
        band_map = {
            1: "2.4 GHz",
            2: "5 GHz",
        }
        channel_band = band_map.get(channel_info.channelBand(), "Unknown Band")
        channel_number = channel_info.channelNumber()
        width = channel_info.channelWidth()
        width_map = {
            1: "20 MHz",
            2: "40 MHz",
            3: "80 MHz",
            4: "160 MHz",
        }
        channel_width = width_map.get(channel_info.channelWidth(), "Unknown Width")
        self.channel = f"{channel_number} ({channel_band}, {channel_width})"

    def set_security_into(self, interface):
        # TODO: Check on Other Networks
        security_map = {
            0: "None (Open network)",
            1: "WEP",
            2: "WPA Personal",
            3: "WPA Personal Mixed",
            4: "WPA2 Personal",
            5: "WPA3",
            6: "WPA2 Enterprise",
            7: "WPA3 Enterprise"
        }
        self.security = security_map[interface.security()]

    def get_json(self):
        return {
            "rssi": self.rssi,
            "noise": self.noise,
            "snr": self.snr,
            "router": self.router,
            "ip_address": self.ip_address,
            "tx_rate": self.tx_rate,
            "channel": self.channel,
            "physical_mode": self.physical_mode,
            "security": self.security,
            "time": self.time
        }