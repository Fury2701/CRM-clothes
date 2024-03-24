from config import *

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


