import pydobot

class Dobot(pydobot.Dobot):
    def __init__(self, port=None, verbose=False):
        super().__init__(port=port, verbose=verbose)

    def movej_to(self, x, y, z, r, wait=True):
        super()._set_ptp_cmd(x, y, z, r, mode=pydobot.enums.PTPMode.MOVJ_XYZ, wait=wait)

    def movel_to(self, x, y, z, r, wait=True):
        super()._set_ptp_cmd(x, y, z, r, mode=pydobot.enums.PTPMode.MOVL_XYZ, wait=wait)    
        
    def home(self):
        msg = pydobot.message.Message()
        msg.id = pydobot.enums.CommunicationProtocolIDs.CommunicationProtocolIDs.SET_HOME_CMD
        msg.ctrl = pydobot.enums.ControlValues.ControlValues.ONE
        return super()._send_command(msg)
    
    def set_speed(self, speed, acceleration):
        super().speed(speed, acceleration)

    def clear_all_alarms(self):
        msg = pydobot.message.Message()
        msg.id = pydobot.enums.CommunicationProtocolIDs.CommunicationProtocolIDs.CLEAR_ALL_ALARMS_STATE
        msg.ctrl = pydobot.enums.ControlValues.ControlValues.ONE
        return super()._send_command(msg)

    def get_alarm_state(self):
        msg = pydobot.message.Message()
        msg.id = pydobot.enums.CommunicationProtocolIDs.CommunicationProtocolIDs.GET_ALARMS_STATE
        msg.ctrl = pydobot.enums.ControlValues.ControlValues.ONE
        return super()._send_command(msg)




if __name__ == "__main__":
    robo = Dobot(port="COM6", verbose=False)
    

