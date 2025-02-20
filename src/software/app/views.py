from flask import render_template, request, redirect, session
from app import app
import os
from authentication import get_auth

#definição das rotas do projeto
@app.route('/')
def index():
    return render_template('index.html')

auth = get_auth()

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            session['user'] = email
        except:
            return 'Falha no login'
        return render_template('dashboard.html')
    if request.method == 'GET':
        return render_template('login.html')
    
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.create_user_with_email_and_password(email, password)
            session['user'] = email
        except:
            return 'Falha no cadastro'
        return render_template('login.html')
    if request.method == 'GET':
        return render_template('cadastro.html')
    
@app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user')
    return redirect('/login')

@app.route('/recuperar-senha')
def recuperar_senha():
    return render_template('recuperarSenha.html')

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect('/login')
    
    return render_template('dashboard.html', user=session['user'])

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