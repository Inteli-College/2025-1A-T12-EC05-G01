from flask import request, session, jsonify
from app import app
import os
from authentication import get_auth, login_required
from functools import wraps
from flask_cors import CORS

# Enable CORS
CORS(app)

# API route definitions
@app.route('/')
def index():
    return jsonify({"message": "API is running"})

auth = get_auth()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        session['user'] = email
        return jsonify({"success": True, "message": "Login successful"})
    except Exception as e:
        error_message = str(e)
        return jsonify({"success": False, "error": error_message}), 401

@app.route('/cadastro', methods=['POST'])
def cadastro():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    
    if password != confirm_password:
        return jsonify({"success": False, "error": "As senhas não coincidem"}), 400
    
    try:
        user = auth.create_user_with_email_and_password(email, password)
        session['user'] = email
        return jsonify({"success": True, "message": "Cadastro realizado com sucesso"})
    except Exception as e:
        error_message = str(e)
        return jsonify({"success": False, "error": error_message}), 400

@app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user')
    return jsonify({"success": True, "message": "Logout successful"})

@app.route('/recuperar-senha', methods=['POST'])
def recuperar_senha():
    data = request.get_json()
    email = data.get('email')
    
    try:
        auth.send_password_reset_email(email)
        return jsonify({"success": True, "message": "Email de recuperação enviado"})
    except Exception as e:
        error_message = str(e)
        return jsonify({"success": False, "error": error_message}), 400

@app.route('/check-auth')
def check_auth():
    if 'user' in session:
        return jsonify({"authenticated": True, "email": session['user']})
    return jsonify({"authenticated": False})

# These routes now just return JSON data instead of rendering templates
@app.route('/dashboard')
@login_required
def dashboard():
    return jsonify({"user": session['user']})

@app.route('/estoque')
@login_required
def estoque():
    return jsonify({"page": "estoque"})

@app.route('/prescricoes')
@login_required
def prescricoes():
    return jsonify({"page": "prescricoes"})

@app.route('/montagens')
@login_required
def montagens():
    return jsonify({"page": "montagens"})

@app.route('/verificacao')
@login_required
def verificacao():
    return jsonify({"page": "verificacao"})