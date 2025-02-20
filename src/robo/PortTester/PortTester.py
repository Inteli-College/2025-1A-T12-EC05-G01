from typing import Optional
from multiprocessing import Process, Queue
from Dobot.Dobot import Dobot

class PortTester:
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


