from flask import Flask, request, render_template, jsonify, session, redirect, url_for, send_file
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import sessionmaker, relationship, Session
from sqlalchemy.ext.declarative import declarative_base
import requests
from base64 import b64encode
import json
from datetime import datetime, timedelta
import secrets, os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from wooapi import *


app = Flask(__name__)

# Визначення URL бази даних
database_url = 'postgresql+psycopg2://postgres:2701172004@localhost/Crm'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SESSION_COOKIE_SECURE'] = False

app.config['SQLALCHEMY_DATABASE_URI_SECOND']= 'mysql+pymysql://sr533762_db:4zWnFMFV@sr533762.mysql.ukraine.com.ua:3306/sr533762_db'



# Налаштування секретного ключа сесії
app.secret_key = secrets.token_hex(16)

# Підключення до бази даних
engine = create_engine(database_url, echo=True)
engine_second = create_engine(app.config['SQLALCHEMY_DATABASE_URI_SECOND'], echo=True)

# Створення сесії
Session = sessionmaker(bind=engine)
Session_second = sessionmaker(bind=engine_second)

