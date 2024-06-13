from config import *
from novaposhta.client import *
from typing import Optional, Union, List, Dict, Any

class NovaPoshtaClient:
    def __init__(self, api_key="1e4e49d462079985b99e1b39effc9ae6", timeout=30):
        self.api_key = api_key
        self.timeout = timeout

    def __enter__(self):
        self.client = NovaPoshtaApi(self.api_key, timeout=self.timeout)  # Передача timeout правильно
        return self.client

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.client.close_sync()


#def create_internet_document(client, **kwargs):
#    return client.internet_document.save(**kwargs)

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


OptStr = Optional[str]
OptInt = Optional[int]
OptStrOrNum = Optional[Union[str, float]]
OptListOfDicts = Optional[List[Dict[str, Any]]]


def create_internet_document(
    payer_type: OptStr = None,
    payment_method: OptStr = None,
    date_time: OptStr = None,
    cargo_type: OptStr = None,
    weight: OptStrOrNum = None,
    service_type: OptStr = None,
    seats_amount: OptInt = None,
    description: OptStrOrNum = None,
    cost: OptStrOrNum = None,
    city_sender: OptStr = None,
    sender: OptStr = None,
    sender_address: OptStr = None,
    contact_sender: OptStr = None,
    senders_phone: OptStr = None,
    recipients_phone: OptStr = None,
    city_recipient: OptStr = None,
    recipient: OptStr = None,
    recipient_address: OptStr = None,
    contact_recipient: OptStr = None,
    new_address: OptStr = None,
    recipient_city_name: OptStr = None,
    recipient_area: OptStr = None,
    recipient_area_regions: OptStr = None,
    recipient_address_name: OptStr = None,
    recipient_house: OptStr = None,
    recipient_flat: OptStr = None,
    recipient_name: OptStr = None,
    recipient_type: OptStr = None,
    settlement_type: OptStr = None,
    ownership_form: OptStr = None,
    recipient_contact_name: OptStr = None,
    edrpou: OptStr = None,
    sender_warehouse_index: OptStr = None,
    recipient_warehouse_index: OptStr = None,
    volume_general: OptStrOrNum = None,
    options_seat: OptListOfDicts = None,
    red_box_barcode: OptStr = None,
    backward_delivery_data: OptListOfDicts = None,
    recipient_address_note: OptStr = None,
    afterpayment_ongoodscost: OptStrOrNum = None
):
    url = "https://api.novaposhta.ua/v2.0/json/"
    model_name = "InternetDocument"
    called_method = "save"
    
    method_properties = {
        "PayerType": payer_type,
        "PaymentMethod": payment_method,
        "DateTime": date_time,
        "CargoType": cargo_type,
        "VolumeGeneral": volume_general,
        "Weight": weight,
        "ServiceType": service_type,
        "SeatsAmount": seats_amount,
        "Description": description,
        "Cost": cost,
        "CitySender": city_sender,
        "Sender": sender,
        "SenderAddress": sender_address,
        "ContactSender": contact_sender,
        "SendersPhone": senders_phone,
        "CityRecipient": city_recipient,
        "Recipient": recipient,
        "RecipientAddress": recipient_address,
        "ContactRecipient": contact_recipient,
        "RecipientsPhone": recipients_phone,
        "RedBoxBarcode": red_box_barcode,
        "OptionsSeat": options_seat,
        "BackwardDeliveryData": backward_delivery_data,
        "RecipientAddressNote": recipient_address_note,
        "AfterpaymentOnGoodsCost": afterpayment_ongoodscost
    }
    
    # Видалення ключів зі значенням None
    method_properties = {k: v for k, v in method_properties.items() if v is not None}
    
    payload = {
        "apiKey": api_key,
        "modelName": model_name,
        "calledMethod": called_method,
        "methodProperties": method_properties
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print(data)
        return data["data"]    
    else:
        return {"error": f"Request failed with status code {response.status_code}"}