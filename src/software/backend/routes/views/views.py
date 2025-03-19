from flask import request, session, jsonify
from backend import backend_app
import os
from src.backend.authentication.authentication import get_auth, login_required
from functools import wraps
from flask_cors import CORS

# Enable CORS
CORS(backend_app)

# API route definitions
@backend_app.route('/')
def index():
    return jsonify({"message": "API is running"})

auth = get_auth()

@backend_app.route('/login', methods=['POST'])
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

@backend_app.route('/cadastro', methods=['POST'])
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

@backend_app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user')
    return jsonify({"success": True, "message": "Logout successful"})

@backend_app.route('/recuperar-senha', methods=['POST'])
def recuperar_senha():
    data = request.get_json()
    email = data.get('email')
    
    try:
        auth.send_password_reset_email(email)
        return jsonify({"success": True, "message": "Email de recuperação enviado"})
    except Exception as e:
        error_message = str(e)
        return jsonify({"success": False, "error": error_message}), 400

@backend_app.route('/check-auth')
def check_auth():
    if 'user' in session:
        return jsonify({"authenticated": True, "email": session['user']})
    return jsonify({"authenticated": False})

# These routes now just return JSON data instead of rendering templates
@backend_app.route('/dashboard')
@login_required
def dashboard():
    return jsonify({"user": session['user']})

@backend_app.route('/estoque')
@login_required
def estoque():
    return jsonify({"page": "estoque"})

@backend_app.route('/prescricoes')
@login_required
def prescricoes():
    return jsonify({"page": "prescricoes"})

@backend_app.route('/montagens')
@login_required
def montagens():
    return jsonify({"page": "montagens"})

@backend_app.route('/verificacao')
@login_required
def verificacao():
    return jsonify({"page": "verificacao"})