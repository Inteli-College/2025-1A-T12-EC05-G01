from typing import List
import inquirer
from yaspin import yaspin

class UserInterfaceHandler:
    """
    Essa clase abstrai alguns dos métodos da biblioteca inquirer 
    e yaspin, trazendo facilidade para implementar a seleção de portas 
    e também o display de spinners e erros.
    """
    @staticmethod
    def select_port(ports: List[str]) -> str:
        """Exibe interface de seleção de portas"""
        options = ports + ["Não sei a porta do Dobot"]
        return inquirer.prompt([
            inquirer.List(
                'porta',
                message="Selecione a porta do Dobot",
                choices=options,
                carousel=True
            )
        ])['porta']

    @staticmethod
    def show_spinner(text: str, color: str = "green") -> yaspin:
        return yaspin(text=text, color=color)

    @staticmethod
    def show_error(message: str) -> None:
        print(f"\n❌ {message}")


