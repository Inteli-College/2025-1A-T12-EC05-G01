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

def get_auth():
    return auth