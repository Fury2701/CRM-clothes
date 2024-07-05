from config import *


version = "v1beta"
authServerTokenUrl = f"https://api-gateway.kyivstar.ua/idp/oauth2/token"
clientId = "09e5815f-89e5-49a8-bc8c-44b13c01eee8"
clientSecret = "PQIk5yZBOsAcDob3QeBKqul6Ic"



# Глобальні змінні для збереження токену та часу його оновлення
access_token = None
token_expiry = None
alfa_name = "messagedesk"

def authenticate():
    global access_token, token_expiry
    encoded = f"{clientId}:{clientSecret}".encode("utf-8")
    userAndPass = b64encode(encoded).decode("ascii")
    headers = { 'Authorization' : 'Basic %s' %  userAndPass }
    payload = 'grant_type=client_credentials'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic %s' %  userAndPass
    }
    response = requests.post(authServerTokenUrl, headers=headers, data=payload)
    if response.status_code == 200:
        data = response.json()
        access_token = data["access_token"]
        expires_in = data["expires_in"]
        token_expiry = datetime.now() + timedelta(seconds=expires_in)
        print("Successfully authenticated. Access token expires at:", token_expiry)
    else:
        print("Failed to authenticate. Status code:", response.status_code)

def get_access_token():
    global access_token, token_expiry
    if access_token is None or token_expiry is None or token_expiry < datetime.now():
        print("Access token expired or not yet obtained. Authenticating...")
        authenticate()
    return access_token

def test():
    access_token = get_access_token()
    print("Access token:", access_token)

def send_sms(phone_number, message_text):
    if access_token is None or token_expiry is None or token_expiry < datetime.now():
        print("Access token expired or not yet obtained. Authenticating...")
        authenticate()
        access_token_ready = "Bearer " + access_token
    else:
        access_token_ready = "Bearer " + access_token
    url = f"https://api-gateway.kyivstar.ua/sandbox/rest/{version}/sms"

    headers = {
        'Authorization': access_token_ready,
        'Content-Type': 'application/json'
    }

    payload = {
        "from": "messagedesk",
        "to": f"{phone_number}",
        "text": f"{message_text}"
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        message_id = response.json()["msgId"]
        return("Well done!", message_id)
    elif response.status_code == 401:
        print("BAD AUTH", response.status_code)
        get_access_token()
        response = requests.post(url, headers=headers, json=payload)
    elif response.status_code == 422:
        return("BAD REQUEST", response.status_code)
    else :
        return("FAILED TO SEND SMS", response.status_code)

def check_sms_status(message_id):
    if access_token is None or token_expiry is None or token_expiry < datetime.now():
        print("Access token expired or not yet obtained. Authenticating...")
        authenticate()
        access_token_ready = "Bearer " + access_token
    else:
        access_token_ready = "Bearer " + access_token
    
    url = f"https://api-gateway.kyivstar.ua/sandbox/rest/{version}/sms/{message_id}"
    headers = {
        'Authorization': access_token_ready
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        status = response.json()
        info = {
          "msgId" : status["msgId"],
          "date" : status["date"],
           "status" : status["status"]
        }
        return(info)
    elif response.status_code == 401:
        print("Bad auth. Status code:", response.status_code)
        get_access_token()
        response = requests.get(url, headers=headers)
    else:
        return {"error": "Failed to get SMS status", "status_code": response.status_code}

def send_viber(phone_number, message_text):
    if access_token is None or token_expiry is None or token_expiry < datetime.now():
        print("Access token expired or not yet obtained. Authenticating...")
        authenticate()
        access_token_ready = "Bearer " + access_token
    else:
        access_token_ready = "Bearer " + access_token

    url = f"https://api-gateway.kyivstar.ua/sandbox/rest/{version}/viber/transaction"

    headers = {
        'Authorization': access_token_ready,
        'Content-Type': 'application/json'
    }

    payload = {
        "from": f"{alfa_name}",  # Замініть на ваш Viber альфа-імʼя
        "to": f"{phone_number}",
        "text": f"{message_text}",
        "messageTtlSec": 7000
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        message_id = response.json()["mid"]
        return ("Well done!", message_id)
    elif response.status_code == 401:
        print("BAD AUTH", response.status_code)
        get_access_token()
        response = requests.post(url, headers=headers, json=payload)
    elif response.status_code == 422:
        return ("BAD REQUEST", response.status_code)
    else:
        return ("FAILED TO SEND VIBER MESSAGE", response.status_code)

def check_viber_status(message_id):
    if access_token is None or token_expiry is None or token_expiry < datetime.now():
        print("Access token expired or not yet obtained. Authenticating...")
        authenticate()
    
    access_token_ready = "Bearer " + access_token
    
    url = f"https://api-gateway.kyivstar.ua/sandbox/rest/{version}/viber/status/{message_id}"
    headers = {
        'Authorization': access_token_ready
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        status_data = response.json()
        return {
            "mid": status_data["mid"],
            "status": status_data["status"],
            "date": status_data["date"]
        }
    elif response.status_code == 401:
        print("Bad auth. Status code:", response.status_code)
        authenticate()
        return check_viber_status(message_id)  # Повторний виклик після повторної аутентифікації
    else:
        return {"error": "Failed to get Viber message status", "status_code": response.status_code}
       




    