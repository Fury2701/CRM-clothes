from config import *
from novaposhta.client import *
from typing import Optional, List

class NovaPoshtaClient:
    def __init__(self, api_key="1e4e49d462079985b99e1b39effc9ae6", timeout=30):
        self.api_key = api_key
        self.timeout = timeout

    def __enter__(self):
        self.client = NovaPoshtaApi(self.api_key, timeout=self.timeout)  # Передача timeout правильно
        return self.client

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.client.close_sync()


def create_internet_document(client, **kwargs):
    return client.internet_document.save(**kwargs)

def update_internet_document(client, ref: str, **kwargs):
    return client.internet_document.update(ref=ref, **kwargs)

def delete_internet_document(client, document_refs: List[str]):
    return client.internet_document.delete(document_refs=document_refs)

def create_counterparty(client, **data):
    counterparty = client.counterparty  # Використовуємо властивість клієнта
    save_data = {
        'first_name': data['first_name'],
        'middle_name': data['middle_name'],
        'last_name': data['last_name'],
        'phone': data['phone'],
        'email': data['email'],
        'counterparty_type': data['counterparty_type'],
        'counterparty_property': data['counterparty_property'],
        'city_ref': data['city_ref'],
        'edrpou': data.get('edrpou', '')  # Передаємо порожнє значення, якщо 'edrpou' не задано
    }

    return counterparty.save(**save_data)



def update_counterparty(client, ref, **data):
    counterparty = Counterparty(client)
    return counterparty.update(
        ref=ref,
        first_name=data['first_name'],
        middle_name=data['middle_name'],
        last_name=data['last_name'],
        phone=data.get('phone'),
        email=data.get('email'),
        counterparty_type=data['counterparty_type'],
        counterparty_property=data['counterparty_property'],
        city_ref=data['city_ref'],
    )

def delete_counterparty(client, ref):
    counterparty = Counterparty(client)
    return counterparty.delete(ref)




api_key = "1e4e49d462079985b99e1b39effc9ae6"

# Налаштування URL та параметрів запиту
#Трекінг посилок Нової Пошти
def track_shipments(documents):
    """
    Функція для відстеження посилок за допомогою API Нової Пошти.

    Args:
        documents (list): Список словників з даними про посилки для відстеження.
            Ключі: "DocumentNumber", "Phone" (необов'язковий).

    Returns:
        list: Список словників з інформацією про кожну посилку.
    """
    url = "https://api.novaposhta.ua/v2.0/json/"
    model_name = "TrackingDocument"
    called_method = "getStatusDocuments"
   

    payload = {
        "apiKey": api_key,
        "modelName": model_name,
        "calledMethod": called_method,
        "methodProperties": {
            "Documents": documents
        }
    }

    response = requests.post(url, json=payload)

    if response.status_code == 200:
        data = response.json()
        if data["success"]:
            return data["data"]
        else:
            return("Помилка в запиті:", data["errors"])
    else:
        return("Помилка в запиті:", response.status_code)

    return []


def get_cities(): # Отримання списку міст з API Нової Пошти
    url = "https://api.novaposhta.ua/v2.0/json/"  
    payload = {
        "apiKey": api_key,
        "modelName": "Address",
        "calledMethod": "getCities",
        "methodProperties": {}
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        cities = data.get("data", [])
        return cities
    except Exception as e:
        print("Error:", e)
        return []

def save_cities_to_json(): # Збереження списку міст в файл cities.json
    cities= get_cities() # Отримання списку міст
    directory = "sprav_nova"
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    with open(os.path.join(directory, "cities.json"), "w", encoding='utf-8') as file:
        json.dump(cities, file, ensure_ascii=False)


