from config import *
from helpers import *
from api import * 
from nova_api import *

@app.route("/",methods=['GET'])
def login_page():
    return render_template("login.html")


@app.route("/admin", methods=['GET'])
def admin_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    orders_json= get_wc_orders()
    
    return render_template("main.html", orders=orders_json)

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

    phone_number = request.get_json['phone_number']
    message_text = request.get_json['message_text']
    
    # Відправлення SMS
    response = send_sms(phone_number, message_text)
    
    if isinstance(response, tuple) and response[0] == "Well done!":
        # Виклик функції для обробки запису в базу даних
        status = "Not delivered"
        update_sms(phone_number, message_text,response[1],status)  
        return "SMS sent successfully and processed in the database.", 200
    else:
        return jsonify({"error": response}), 400

#Оновлення статусу SMS

@app.route("/update_sms_status", methods=['POST'])
def update_sms_status():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return "User is not logged in.", 401  # Повертаємо 401, щоб показати, що користувач не має доступу
    
    message_id = request.get_json['message_id']
    response = check_sms_status(message_id)
    if response == "Delivered":
        status = "Delivered"
        update_sms_status(message_id)
        return "SMS status updated in the database.", 200
    else:
        return jsonify({"error": response}), 400



@app.route("/nova_tracking", methods=['POST'])
def nova_tracking():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return "User is not logged in.", 401  # Повертаємо 401, щоб показати, що користувач не має доступу

    # Отримати JSON-дані з фронтенду
    data = request.get_json()

    # Створити список словників з даними про посилки
    documents = []
    for item in data:
        document_number = item.get('DocumentNumber')
        phone = item.get('Phone')
        if document_number:
            document = {
                "DocumentNumber": document_number
            }
            if phone:
                document["Phone"] = phone
            documents.append(document)
    
    try:
        # Відстежити посилки
        shipment_info = track_shipments(documents)


        return jsonify(shipment_info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/uprade_sprav_nova", methods=['POST'])
def uprade_sprav_nova():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return "User is not logged in.", 401  # Повертаємо 401, щоб показати, що користувач не має доступу

    try:
        # Отримання списку міст з API Нової Пошти
        cities = save_cities_to_json()
        return jsonify(cities), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400



