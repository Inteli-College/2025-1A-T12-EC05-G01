from typing import Optional
from multiprocessing import Process, Queue
from Dobot.Dobot import Dobot

class PortTester:
    """
    Essa classe é responsável por receber uma porta de 
    comunicação serial do PC e testar se uma instância 
    da classe Dobot consegue ser criada nessa porta.
    Além de criar a instância, ocorre também um teste 
    de conexão para verificar se o robô realment está conectado
    em uma porta correta. Por fim, os métodos Process e Queue 
    são utilizados para descartar uma porta caso a conexão 
    não consiga ser estabelecida em até 5 segundos. 
    """
    TIMEOUT = 5

    @staticmethod
    def test_port(port: str) -> Optional[str]:
        """Testa uma porta serial com timeout"""
        queue = Queue()
        process = Process(target=PortTester._test_connection, args=(port, queue))
        
        try:
            process.start()
            process.join(PortTester.TIMEOUT)
            
            if process.is_alive():
                process.terminate()
                process.join()
                return None
                
            result = queue.get_nowait()
            return result if isinstance(result, str) else None
            
        except Exception:
            return None

    @staticmethod
    def _test_connection(port: str, queue: Queue) -> None:
        """Método interno para teste de conexão"""
        try:
            robot = Dobot(port=port, verbose=False)
            robot.pose()
            robot.close()
            queue.put(port)
        except Exception as e:
            queue.put(e)


