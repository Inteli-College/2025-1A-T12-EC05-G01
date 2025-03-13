import os
from dotenv import load_dotenv

load_dotenv()

SERIAL_PORT = os.getenv("SCANNER_SERIAL_PORT", "COM8")
SERIAL_BAUDRATE = int(os.getenv("SCANNER_SERIAL_BAUDRATE", "9600"))

IR_SERIAL_PORT = os.getenv("IR_SERIAL_PORT", "COM8")
IR_SERIAL_BAUDRATE = int(os.getenv("IR_SERIAL_BAUDRATE", "9600"))