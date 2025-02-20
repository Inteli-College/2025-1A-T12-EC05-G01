from Dobot.Dobot import Dobot

class DobotConnectionHandler:
    def __init__(self):
        self.robot = None
        self.default_speed = (200, 200)

    def connect(self, port: str) -> bool:
        """Estabelece conexão com o Dobot"""
        try:
            self.robot = Dobot(port=port, verbose=False)
            self.robot.set_speed(*self.default_speed)
            return True
        except Exception:
            return False

    def initialize_robot(self) -> None:
        """Executa rotinas de inicialização do robô"""
        if self.robot:
            self.robot.home()
            self.robot.clear_all_alarms()


