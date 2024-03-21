from config import *


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
    api_key = "1e4e49d462079985b99e1b39effc9ae6"

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



#Пошук відділень Нової Пошти в онлайн-режимі довідника
def search_settlements(city_name):
    url = "https://api.novaposhta.ua/v2.0/json/"
    api_key = "1e4e49d462079985b99e1b39effc9ae6"
    limit = "15"
    page = "1"
    payload = {
        "apiKey": api_key,
        "modelName": "Address",
        "calledMethod": "searchSettlements",
        "methodProperties": {
            "CityName": city_name,
            "Limit": limit,
            "Page": page
        }
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return None

