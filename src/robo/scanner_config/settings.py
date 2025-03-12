import os
from dotenv import load_dotenv

load_dotenv()

SERIAL_PORT = os.getenv("SCANNER_SERIAL_PORT", "COM8")
SERIAL_BAUDRATE = int(os.getenv("SCANNER_SERIAL_BAUDRATE", "9600"))

WS_HOST = os.getenv("SCANNER_WS_HOST", "0.0.0.0")
WS_PORT = int(os.getenv("SCANNER_WS_PORT", "8765"))

SCAN_INTERVAL = float(os.getenv("SCANNER_SCAN_INTERVAL", "0.1"))

IR_SERIAL_PORT = os.getenv("IR_SERIAL_PORT", "COM8")
IR_SERIAL_BAUDRATE = int(os.getenv("IR_SERIAL_BAUDRATE", "9600"))
IR_SCAN_INTERVAL = float(os.getenv("IR_SCAN_INTERVAL", "0.2"))
IR_THRESHOLD = int(os.getenv("IR_THRESHOLD", "500"))

I2C_BUS = int(os.getenv("I2C_BUS", "1")) 
I2C_ADDRESS = int(os.getenv("I2C_ADDRESS", "8")) 
