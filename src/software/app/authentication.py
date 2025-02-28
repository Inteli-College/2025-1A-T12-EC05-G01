import pyrebase
from flask import Flask, render_template, request, redirect, session, url_for
from functools import wraps
from app import app
import os
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

config = {
    'apiKey': os.getenv('API_KEY'),
    'authDomain': os.getenv('AUTH_DOMAIN'),
    'projectId': os.getenv('PROJECT_ID'),
    'storageBucket': os.getenv('STORAGE_BUCKET'),
    'messagingSenderId': os.getenv('MESSAGING_SENDER_ID'),
    'appId': os.getenv('APP_ID'),
    'measurementId': os.getenv('MEASUREMENT_ID'),
    'databaseURL': os.getenv('DATABASE_URL'),
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

app.secret_key = os.getenv('SECRET_KEY')

def get_auth():
    return auth

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login')) 
        return f(*args, **kwargs)
    return decorated_function