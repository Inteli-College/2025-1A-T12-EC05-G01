from flask import request, session, jsonify, Blueprint
import os
from ....backend.authentication.authentication import get_auth, login_required
from functools import wraps
from flask_cors import CORS

views_routes = Blueprint('views', __name__)

# Enable CORS
CORS(views_routes)

# These routes now just return JSON data instead of rendering templates
@views_routes.route('/dashboard')
@login_required
def dashboard():
    return jsonify({"user": session['user']})

@views_routes.route('/estoque')
@login_required
def estoque():
    return jsonify({"page": "estoque"})

@views_routes.route('/adicionar_prescricao')
@login_required
def estoque():
    return jsonify({"page": "adicionar_prescricao"})

@views_routes.route('/prescricoes')
@login_required
def prescricoes():
    return jsonify({"page": "prescricoes"})

@views_routes.route('/montagens')
@login_required
def montagens():
    return jsonify({"page": "montagens"})

@views_routes.route('/verificacao')
@login_required
def verificacao():
    return jsonify({"page": "verificacao"})