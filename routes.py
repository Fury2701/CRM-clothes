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
    try:
        page = request.args.get('page', 1, type=int) # Отримання номеру сторінки з параметрів запиту
        orders = get_wc_orders(page=page)

        orders_json = json.dumps(orders)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("main.html", orders=orders_json, current_page=page)

@app.route("/logout", methods=['GET'])
def logout():
    if "login" not in session:
        return redirect(url_for("login_page"))
    session.pop("login", None)
    session.pop("password", None)
    return redirect(url_for("login_page"))

@app.route("/dataorders", methods=['GET']) #для отримання даних наступних сторінок(можливе використання фільтрів по ПІБ)
def dataorders():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:

        page = request.args.get('page', 1, type=int)
        full_name = request.args.get('full_name', None, type=str)
        orders = get_wc_orders(full_name=full_name,page=page)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(orders,current_page=page), 200

@app.route("/dataordersbyid", methods=['GET']) #для отримання даних наступних сторінок по id
def dataordersbyid():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        order_id = request.args.get('id')
        order = get_order(order_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(order), 200

@app.route("/dataordersstatus", methods=['GET']) #для отримання даних наступних сторінок з фільтром по статусу
def dataordersstatus():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        orders = get_wc_status_orders(status, page=page)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(orders,current_page=page), 200

@app.route("/dataordersnewtoold", methods=['GET']) #для отримання даних наступних сторінок відсортованих від нових до старих
def dataordersnewtoold():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        page = request.args.get('page', 1, type=int)
        orders = get_sorted_new_to_old_orders(page=page)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(orders,current_page=page), 200

@app.route("/create_order", methods=['POST'])
def create_order():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = create_order(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/update_order", methods=['POST'])
def update_order():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = update_order(data['id'], data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_order", methods=['POST'])
def delete_order():
    if "login" not in session:
        return redirect(url_for("login_page"))

    order_id= request.args.get('id')
    try:
        response = delete_order(order_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/product", methods=['GET'])
def product_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        page = request.args.get('page', 1, type=int)
        products = get_products(page=page, per_page=20)
        products_json = json.dumps(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("product.html", products=products_json)

@app.route("/productbyid", methods=['GET'])
def product_info_page(id):
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        product_id = request.args.get('id')
        product = get_product(product_id) 
        product_json = json.dumps(product)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("product_info.html", product=product_json)

@app.route("/data_products", methods=['GET'])
def data_products():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        page = request.args.get('page', 1, type=int)
        products = get_products(page=page, per_page=20)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(products,current_page=page), 200

@app.route("/create_product", methods=['POST'])
def create_product():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = create_product(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/update_product", methods=['POST'])
def update_product():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = update_product(data['id'], data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_product", methods=['POST'])
def delete_product():
    if "login" not in session:
        return redirect(url_for("login_page"))

    product_id = request.args.get('id')
    try:
        response = delete_product(product_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/customer", methods=['GET'])
def customer_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        page = request.args.get('page', 1, type=int)
        customers = get_customers(page=page)
        customers_json = json.dumps(customers)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("customer.html", customers=customers_json)

@app.route("/customerbyid", methods=['GET'])
def customer_info_page(id):
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        client_id = request.args.get('id')
        customer = get_customer(client_id) 
        customer_json = json.dumps(customer)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("customer_info.html", customer=customer_json)

@app.route("/data_customers", methods=['GET'])
def data_customers():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        page = request.args.get('page', 1, type=int)
        customers = get_customers(page=page)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(customers,current_page=page), 200

@app.route("/create_customer", methods=['POST'])
def create_customer():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = create_customer(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/update_customer", methods=['POST'])
def update_customer():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = update_customer(data['id'], data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_customer", methods=['POST'])
def delete_customer():
    if "login" not in session:
        return redirect(url_for("login_page"))

    customer_id = request.args.get('id')
    try:
        response = delete_customer(customer_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

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

@app.route("/update_sprav_nova", methods=['POST'])
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



