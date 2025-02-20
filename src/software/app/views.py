from flask import render_template  
from app import app

#definição das rotas do projeto
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/recuperar-senha')
def recuperar_senha():
    return render_template('recuperarSenha.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/estoque')
def estoque():
    return render_template('estoque.html')

@app.route('/prescricoes')
def prescricoes():
    return render_template('prescricoes.html')

@app.route('/montagens')
def montagens():
    return render_template('montagens.html')

@app.route('/verificacao')
def verificacao():
    return render_template('verificacao.html')

@app.route('/logout')
def logout():
    return render_template('login.html')