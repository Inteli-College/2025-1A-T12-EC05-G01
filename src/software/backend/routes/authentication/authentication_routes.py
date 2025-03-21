from flask import request, session, jsonify, Blueprint
import os
from ....backend.authentication.authentication import get_auth, login_required
from functools import wraps

authentication_routes = Blueprint('authentication', __name__)

# API route definitions
@authentication_routes.route('/')
def index():
    return jsonify({"message": "API is running"})

auth = get_auth()

@authentication_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        session['user'] = user['idToken']  
        session['email'] = email
        return jsonify({"success": True, "message": "Login successful", "token": user['idToken']})
    except Exception as e:
        error_message = str(e)
        return jsonify({"success": False, "error": error_message}), 401

@authentication_routes.route('/cadastro', methods=['POST'])
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

@authentication_routes.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user')
    return jsonify({"success": True, "message": "Logout successful"})

@authentication_routes.route('/recuperar-senha', methods=['POST'])
def recuperar_senha():
    data = request.get_json()
    email = data.get('email')
    
    try:
        auth.send_password_reset_email(email)
        return jsonify({"success": True, "message": "Email de recuperação enviado"})
    except Exception as e:
        error_message = str(e)
        return jsonify({"success": False, "error": error_message}), 400

@authentication_routes.route('/check-auth')
def check_auth():
    if 'user' in session:
        return jsonify({"authenticated": True, "email": session['user']})
    return jsonify({"authenticated": False})

