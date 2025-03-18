---
title: Rotas para Banco de Dados
sidebar_position: 1
slug: /rotas-banco-de-dados
---

&nbsp;&nbsp;&nbsp;&nbsp;Para possibilitar que as outras partes do sistema se conectem ao banco de dados de forma eficiente e organizada, o grupo optou por criar uma aplicação Flask. Essa aplicação expõe uma série de rotas que permitem a interação com o banco de dados, facilitando a comunicação entre diferentes módulos do sistema. Para garantir uma estrutura modular e de fácil manutenção, a aplicação utiliza **Blueprints**, que são uma forma de organizar rotas e funcionalidades em componentes reutilizáveis.

&nbsp;&nbsp;&nbsp;&nbsp;O trecho de código abaixo ilustra a definição do `database_app`, que é a instância principal da aplicação Flask. Nesse contexto, o Blueprint responsável pelas rotas relacionadas aos logs (`logs_routes`) é registrado no `database_app` através do método `register_blueprint`. Isso permite que as rotas definidas no Blueprint sejam acessíveis na aplicação principal.

```python
from flask import Flask, jsonify, request, Blueprint
from .routes.logs_routes import logs_routes

database_app = Flask(__name__)

database_app.register_blueprint(logs_routes)

if __name__ == "__main__":
    database_app.run(host="0.0.0.0", port=3000, debug=True)
```

&nbsp;&nbsp;&nbsp;&nbsp;O Blueprint `logs_routes` é responsável por gerenciar as rotas relacionadas à manipulação de logs no banco de dados. Ele é definido como um objeto `Blueprint` e deverá conter as rotas específicas para operações a tabela Logs. A rota `/logs/create`, por exemplo, permite a inserção de novos logs no banco de dados através de uma requisição HTTP do tipo POST.

&nbsp;&nbsp;&nbsp;&nbsp;Abaixo está o código que define o Blueprint `logs_routes` e a rota `/logs/create`. Essa rota recebe os dados do log no corpo da requisição (em formato JSON), cria um novo registro no banco de dados e retorna uma mensagem de sucesso ou erro, dependendo do resultado da operação.

```python
logs_routes = Blueprint('logs', __name__)

@logs_routes.route("/logs/create", methods=["POST"])
def create_logs():
    db = SessionLocal()
    try:
        log = Logs(
            level=request.json.get("level"),
            origin=request.json.get("origin"),
            action=request.json.get("action"),
            description=request.json.get("description"),
            status=request.json.get("status"),
            log_data=datetime.now()
        )
        db.add(log)
        db.commit()
        return {"message": "Log saved in the database"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()
```

&nbsp;&nbsp;&nbsp;&nbsp;A função `create_logs` é responsável por processar a requisição e inserir o log no banco de dados. Ela começa criando uma instância da sessão do banco de dados (`SessionLocal`). Em seguida, os dados do log são extraídos do corpo da requisição (usando `request.json`) e utilizados para criar um novo objeto da classe `Logs`. Esse objeto é então adicionado à sessão e persistido no banco de dados através do método `commit`.

&nbsp;&nbsp;&nbsp;&nbsp;Caso ocorra algum erro durante o processo, a função captura a exceção, desfaz as alterações pendentes na sessão com `rollback` e retorna uma mensagem de erro com o código de status HTTP 500. Por fim, a sessão do banco de dados é fechada no bloco `finally`.

&nbsp;&nbsp;&nbsp;&nbsp;Portanto, a criação dessas rotas permitem que o Front-End e o `app_dobot` consigam utilizar o banco de dados. Ademais, o uso de Blueprints, facilita a adição de novas rotas e funcionalidades no futuro, além de tornar o código mais organizado e fácil de manter. Assim, para a próxima Sprint, o objetivo é desenvolver as rotas para as demais tabelas do banco de dados, , ampliando a funcionalidade da aplicação.
