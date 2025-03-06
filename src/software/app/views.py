from flask import render_template, request, redirect, session, url_for, Flask, flash, jsonify
from app import app
import os
from authentication import get_auth, login_required
from functools import wraps
from flask_cors import CORS

# Enable CORS
CORS(app)

# definição das rotas do projeto
@app.route('/')
def index():
    return render_template('index.html')

auth = get_auth()

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
        else:
            email = request.form['email']
            password = request.form['password']
        
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            session['user'] = email

            if request.is_json:
                return jsonify({"success": True, "message": "Login successful"})
            return redirect(url_for('dashboard'))
        except Exception as e:
            error_message = str(e)
            if request.is_json:
                return jsonify({"success": False, "error": error_message}), 401
            return render_template('login.html', error=error_message)
    
    return render_template('login.html')

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')
        else:
            email = request.form['email']
            password = request.form['password']
            confirm_password = request.form['confirm_password']
        
        if password != confirm_password:
            if request.is_json:
                return jsonify({"success": False, "error": "As senhas não coincidem"}), 400
            flash('As senhas não coincidem. Tente novamente.')
            return render_template('cadastro.html')
        
        try:
            user = auth.create_user_with_email_and_password(email, password)
            session['user'] = email
            
            if request.is_json:
                return jsonify({"success": True, "message": "Cadastro realizado com sucesso"})
            return redirect(url_for('dashboard'))
        except Exception as e:
            error_message = str(e)
            if request.is_json:
                return jsonify({"success": False, "error": error_message}), 400
            return 'Falha no cadastro'
    
    return render_template('cadastro.html')

@app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user')
    
    if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({"success": True, "message": "Logout successful"})
    return redirect(url_for('login'))

@app.route('/recuperar-senha', methods=['GET', 'POST'])
def recuperar_senha():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
        else:
            email = request.form['email']
        
        try:
            auth.send_password_reset_email(email)
            
            if request.is_json:
                return jsonify({"success": True, "message": "Email de recuperação enviado"})
            return 'Email de recuperação enviado'
        except Exception as e:
            error_message = str(e)
            if request.is_json:
                return jsonify({"success": False, "error": error_message}), 400
            return 'Falha no envio do email de recuperação'
    
    return render_template('recuperarSenha.html')

@app.route('/check-auth')
def check_auth():
    if 'user' in session:
        return jsonify({"authenticated": True, "email": session['user']})
    return jsonify({"authenticated": False})

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