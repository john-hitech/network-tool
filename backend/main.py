import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from wifi import WiFi

app = FastAPI()
wifi = WiFi()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def test():
    return {"message": "Hello"}

@app.get("/wifi-data")
def get_wifi_data():
    return wifi.get_data()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)




