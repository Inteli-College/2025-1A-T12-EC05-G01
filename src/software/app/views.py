from flask import render_template, request, redirect, session, url_for, Flask, flash
from app import app
import os
from authentication import get_auth, login_required
from functools import wraps

# definição das rotas do projeto
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
            return redirect(url_for('dashboard'))
        except Exception as e:
            error_message = str(e) 
            return render_template('login.html', error=error_message)
    return render_template('login.html')

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        if password != confirm_password:
            flash('As senhas não coincidem. Tente novamente.')
            return render_template('cadastro.html')
        try:
            user = auth.create_user_with_email_and_password(email, password)
            session['user'] = email
        except:
            return 'Falha no cadastro'
        return redirect(url_for('dashboard'))
    if request.method == 'GET':
        return render_template('cadastro.html')

@app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user')
    return redirect(url_for('login'))

@app.route('/recuperar-senha', methods=['GET', 'POST'])
def recuperar_senha():
    if request.method == 'POST':
        email = request.form['email']
        try:
            auth.send_password_reset_email(email)
            return 'Email de recuperação enviado'
        except:
            return 'Falha no envio do email de recuperação'
    if request.method == 'GET':
        return render_template('recuperarSenha.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=session['user'])

@app.route('/estoque')
@login_required
def estoque():
    return render_template('estoque.html')

@app.route('/prescricoes')
@login_required
def prescricoes():
    return render_template('prescricoes.html')

@app.route('/montagens')
@login_required
def montagens():
    return render_template('montagens.html')

@app.route('/verificacao')
@login_required
def verificacao():
    return render_template('verificacao.html')