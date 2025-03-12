import smbus
import time

SLAVE_ADDRESS = 8
bus = smbus.SMBus(1)  # Utiliza o barramento I2C 1 (padrão no Raspberry Pi)
time.sleep(1)
while True:
    try:
        # Lê 2 bytes do slave; o comando (primeiro parâmetro após o endereço) pode ser 0
        data = bus.read_i2c_block_data(SLAVE_ADDRESS, 0, 2)
        sensor_value = (data[0] << 8) | data[1]
        print("Valor do sensor:", sensor_value)
    except Exception as e:
        print("Erro na comunicação I2C:", e)
