from config import *
from helpers import *
from api import * 

@app.route("/",methods=['GET'])
def login_page():
    return render_template("login.html")

@app.route("/admin", methods=['GET'])
def admin_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    return render_template("main.html")

@app.route("/admin_validy", methods=['POST'])
def admin_validy():
    login = request.form.get("login")
    password = request.form.get("password")

    if not (login and password):
        return jsonify({"error": "Invalid login or password"}), 400

    else:
        user = user_validy(login,password)
        if user== True:
            return redirect(url_for("admin_page"))
        else:
            return jsonify({"error": "Invalid login or password"}), 401 

@app.route("/send_phone_sms", methods=['POST'])
def send_phone_sms():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return "User is not logged in.", 401  # Повертаємо 401, щоб показати, що користувач не має доступу

    phone_number = request.form['phone_number']
    message_text = request.form['message_text']
    
    # Відправлення SMS
    response = send_sms(phone_number, message_text)
    
    if isinstance(response, tuple) and response[0] == "Well done!":
        # Виклик функції для обробки запису в базу даних
        status = "Not delivered"
        update_sms(phone_number, message_text,response[1],status)  
        return "SMS sent successfully and processed in the database."
    else:
        return response