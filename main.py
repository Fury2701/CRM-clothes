# main.py

from config import app
from routes import *
from models import*
from helpers import *

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
