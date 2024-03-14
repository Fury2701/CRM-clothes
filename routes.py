from config import *
from helpers import *

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
        return jsonify({"error": "Поле паролю або логіну пусте"}), 400

    else:
        user = user_validy(login,password)
        if user== True:
            return redirect(url_for("admin_page"))
        else:
            return jsonify({"error": "Не вірний логін або пароль"}), 401 
