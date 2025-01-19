import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from wifi import WiFi
from ping import Ping

app = FastAPI()
wifi = WiFi()
ping = Ping()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/online")
def check_online():
    return {"message": "API online."}

@app.get("/wifi-data")
def get_wifi_data():
    return wifi.get_data()

@app.get("/ping")
def get_ping_data(ip_address, size: int = 64):
    return ping.send_ping(ip_address=ip_address, size=size)



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)





