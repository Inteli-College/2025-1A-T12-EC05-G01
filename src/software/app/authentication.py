import pyrebase
from flask import render_template, request, redirect, session
from app import app
import os

config = {
    'apiKey': "AIzaSyCykvIhboal9vb0xwiPHEplT8YDfbCfSkI",
    'authDomain': "dose-certa-m05.firebaseapp.com",
    'projectId': "dose-certa-m05",
    'storageBucket': "dose-certa-m05.firebasestorage.app",
    'messagingSenderId': "36009832396",
    'appId': "1:36009832396:web:1431010de4eb53ea6b3769",
    'measurementId': "G-RZ17F1WQ98",
    'databaseURL': "",
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

app.secret_key = 'secret'

@app.route('/login', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            session['user'] = email
        except:
            return 'Falha no login'
        return render_template('index.html')
    if request.method == 'GET':
        return render_template('login.html')
    
@app.route('/cadastro', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.create_user_with_email_and_password(email, password)
            session['user'] = email
        except:
            return 'Falha no cadastro'
        return render_template('index.html')
    if request.method == 'GET':
        return render_template('cadastro.html')
    
@app.route('/logout')
def logout():
    session.pop('user')
    return redirect('/login')
