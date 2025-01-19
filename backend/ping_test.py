from ping import Ping

ping = Ping()

print(ping.send_ping("192.168.0.1", size=64))