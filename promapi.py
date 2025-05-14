from config import *
from helpers import*
from models import *

# API Settings
AUTH_TOKEN = '1626d3f98a10382a0e3717a31b91a13dafb96edd'  # Replace with your actual token
HOST = 'my.prom.ua'

class HTTPError(Exception):
    pass

class PromApiClient:
    def __init__(self, token):
        self.token = token

    def make_request(self, method, url, params=None):
        connection = http.client.HTTPSConnection(HOST)
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-type': 'application/json'
        }
        
        if params:
            url += '?' + '&'.join([f"{k}={v}" for k, v in params.items() if v is not None])
        
        connection.request(method, url, headers=headers)
        response = connection.getresponse()
        if response.status != 200:
            raise HTTPError(f'{response.status}: {response.reason}')
        response_data = response.read()
        return json.loads(response_data.decode())

    def get_orders(self, limit=20, date_from=None, date_to=None, last_id=None, sort_dir=None, status=None):
        params = {
            'limit': limit,
            'date_from': date_from,
            'date_to': date_to,
            'last_id': last_id,
            'sort_dir': sort_dir,
            'status': status
        }
        return self.make_request('GET', '/api/v1/orders/list', params)


# Вигрузка замовлень партіями по 20
def fetch_orders_in_batches(client):
    last_id = None
    while True:
        # Запит замовлень з параметром last_id для пагінації
        orders = client.get_orders(limit=20, last_id=last_id)
        if not orders['orders']:
            break

        for order in orders['orders']:
            # Формування даних для замовлення
            order_data = {
                'order_id': order.get('id'),
                'date_created': order.get('date_created'),
                'client_first_name': order.get('client_first_name'),
                'client_second_name': order.get('client_second_name'),
                'client_last_name': order.get('client_last_name'),
                'client_id': order.get('client_id'),
                'client_notes': order.get('client_notes'),
                'phone': order.get('phone'),
                'email': order.get('email'),
                'price': order.get('price'),
                'full_price': order.get('full_price'),
                'delivery_option_id': order.get('delivery_option', {}).get('id') if order.get('delivery_option') else None,
                'delivery_option_name': order.get('delivery_option', {}).get('name') if order.get('delivery_option') else None,
                'delivery_shipping_service': order.get('delivery_option', {}).get('shipping_service') if order.get('delivery_option') else None,
                'delivery_provider': order.get('delivery_provider_data', {}).get('provider') if order.get('delivery_provider_data') else None,
                'delivery_type': order.get('delivery_provider_data', {}).get('type') if order.get('delivery_provider_data') else None,
                'delivery_sender_warehouse_id': order.get('delivery_provider_data', {}).get('sender_warehouse_id') if order.get('delivery_provider_data') else None,
                'delivery_recipient_warehouse_id': order.get('delivery_provider_data', {}).get('recipient_warehouse_id') if order.get('delivery_provider_data') else None,
                'delivery_declaration_number': order.get('delivery_provider_data', {}).get('declaration_number') if order.get('delivery_provider_data') else None,
                'delivery_unified_status': order.get('delivery_provider_data', {}).get('unified_status') if order.get('delivery_provider_data') else None,
                'delivery_address': order.get('delivery_address'),
                'delivery_cost': order.get('delivery_cost'),
                'payment_option_id': order.get('payment_option', {}).get('id') if order.get('payment_option') else None,
                'payment_option_name': order.get('payment_option', {}).get('name') if order.get('payment_option') else None,
                'payment_type': order.get('payment_data', {}).get('type') if order.get('payment_data') else None,
                'payment_status': order.get('payment_data', {}).get('status') if order.get('payment_data') else None,
                'payment_status_modified': order.get('payment_data', {}).get('status_modified') if order.get('payment_data') else None,
                'status': order.get('status'),
                'status_name': order.get('status_name'),
                'source': order.get('source'),
                'has_order_promo_free_delivery': order.get('has_order_promo_free_delivery'),
                'cpa_commission_amount': order.get('cpa_commission', {}).get('amount') if order.get('cpa_commission') else None,
                'cpa_commission_is_refunded': order.get('cpa_commission', {}).get('is_refunded') if order.get('cpa_commission') else None,
                'utm_medium': order.get('utm', {}).get('medium') if order.get('utm') else None,
                'utm_source': order.get('utm', {}).get('source') if order.get('utm') else None,
                'utm_campaign': order.get('utm', {}).get('campaign') if order.get('utm') else None,
                'dont_call_customer_back': order.get('dont_call_customer_back'),
                'ps_promotion_name': order.get('ps_promotion', {}).get('name') if order.get('ps_promotion') else None,
                'ps_promotion_conditions': order.get('ps_promotion', {}).get('conditions') if order.get('ps_promotion') else None,
                'cancellation_title': order.get('cancellation', {}).get('title') if order.get('cancellation') else None,
                'cancellation_initiator': order.get('cancellation', {}).get('initiator') if order.get('cancellation') else None
            }

            # Формування даних для продуктів
            products_data = []
            for product in order.get('products', []):
                product_data = {
                    'order_id': order.get('id'),
                    'product_id': product.get('id'),
                    'product_external_id': product.get('external_id'),
                    'product_image': product.get('image'),
                    'product_quantity': product.get('quantity'),
                    'product_price': product.get('price'),
                    'product_url': product.get('url'),
                    'product_name': product.get('name'),
                    'product_name_ru': product.get('name_multilang', {}).get('ru') if product.get('name_multilang') else None,
                    'product_name_uk': product.get('name_multilang', {}).get('uk') if product.get('name_multilang') else None,
                    'product_total_price': product.get('total_price'),
                    'product_measure_unit': product.get('measure_unit'),
                    'product_sku': product.get('sku'),
                    'product_cpa_commission_amount': product.get('cpa_commission', {}).get('amount') if product.get('cpa_commission') else None
                }
                products_data.append(product_data)

            # Додавання замовлення та продуктів до бази
            add_order(order_data, products_data)

        # Оновлення last_id для отримання наступної партії замовлень
        last_id = orders['orders'][-1]['id']

        # Якщо кількість замовлень менша за limit, припиняємо цикл
        if len(orders['orders']) < 20:
            break



# Вигрузка нових замовлень за певний період
def fetch_orders_by_date(client):

    kiev_tz = pytz.timezone('Europe/Kiev')

    last_created_time = get_last_order_created_time()
    if not last_created_time:
        last_created_time = datetime.datetime(2000, 1, 1, tzinfo=kiev_tz)
    current_time = datetime.datetime.now(kiev_tz)

    
    
    print(f"Fetching orders from {last_created_time.isoformat()} to {current_time.isoformat()}")

    last_id = None
    empty_responses_count = 0
    max_empty_responses = 5  # Максимальна кількість порожніх відповідей перед завершенням

    while last_created_time < current_time:
        try:
            orders = client.get_orders(
                limit=20,
                date_from=last_created_time.isoformat(),
                date_to=current_time.isoformat(),
                last_id=last_id,
                sort_dir='asc'
            )
            
            if not orders.get('orders'):
                empty_responses_count += 1
                print(f"No orders found. Empty response count: {empty_responses_count}")
                if empty_responses_count >= max_empty_responses:
                    print("Reached maximum number of empty responses. Finishing...")
                    break
                last_created_time += datetime.timedelta(minutes=5)  # Збільшуємо час на 5 хвилин
                last_id = None
                continue

            empty_responses_count = 0  # Скидаємо лічильник, якщо знайдено замовлення

            for order in orders['orders']:
                order_date = datetime.datetime.fromisoformat(order['date_created'])
                
                if order_date > last_created_time:
                    new_orders_found = True
                    order_data = {
                        'order_id': order.get('id'),
                        'date_created': order.get('date_created'),
                        'client_first_name': order.get('client_first_name'),
                        'client_second_name': order.get('client_second_name'),
                        'client_last_name': order.get('client_last_name'),
                        'client_id': order.get('client_id'),
                        'client_notes': order.get('client_notes'),
                        'phone': order.get('phone'),
                        'email': order.get('email'),
                        'price': order.get('price'),
                        'full_price': order.get('full_price'),
                        'delivery_option_id': order.get('delivery_option', {}).get('id') if order.get('delivery_option') else None,
                        'delivery_option_name': order.get('delivery_option', {}).get('name') if order.get('delivery_option') else None,
                        'delivery_shipping_service': order.get('delivery_option', {}).get('shipping_service') if order.get('delivery_option') else None,
                        'delivery_provider': order.get('delivery_provider_data', {}).get('provider') if order.get('delivery_provider_data') else None,
                        'delivery_type': order.get('delivery_provider_data', {}).get('type') if order.get('delivery_provider_data') else None,
                        'delivery_sender_warehouse_id': order.get('delivery_provider_data', {}).get('sender_warehouse_id') if order.get('delivery_provider_data') else None,
                        'delivery_recipient_warehouse_id': order.get('delivery_provider_data', {}).get('recipient_warehouse_id') if order.get('delivery_provider_data') else None,
                        'delivery_declaration_number': order.get('delivery_provider_data', {}).get('declaration_number') if order.get('delivery_provider_data') else None,
                        'delivery_unified_status': order.get('delivery_provider_data', {}).get('unified_status') if order.get('delivery_provider_data') else None,
                        'delivery_address': order.get('delivery_address'),
                        'delivery_cost': order.get('delivery_cost'),
                        'payment_option_id': order.get('payment_option', {}).get('id') if order.get('payment_option') else None,
                        'payment_option_name': order.get('payment_option', {}).get('name') if order.get('payment_option') else None,
                        'payment_type': order.get('payment_data', {}).get('type') if order.get('payment_data') else None,
                        'payment_status': order.get('payment_data', {}).get('status') if order.get('payment_data') else None,
                        'payment_status_modified': order.get('payment_data', {}).get('status_modified') if order.get('payment_data') else None,
                        'status': order.get('status'),
                        'status_name': order.get('status_name'),
                        'source': order.get('source'),
                        'has_order_promo_free_delivery': order.get('has_order_promo_free_delivery'),
                        'cpa_commission_amount': order.get('cpa_commission', {}).get('amount') if order.get('cpa_commission') else None,
                        'cpa_commission_is_refunded': order.get('cpa_commission', {}).get('is_refunded') if order.get('cpa_commission') else None,
                        'utm_medium': order.get('utm', {}).get('medium') if order.get('utm') else None,
                        'utm_source': order.get('utm', {}).get('source') if order.get('utm') else None,
                        'utm_campaign': order.get('utm', {}).get('campaign') if order.get('utm') else None,
                        'dont_call_customer_back': order.get('dont_call_customer_back'),
                        'ps_promotion_name': order.get('ps_promotion', {}).get('name') if order.get('ps_promotion') else None,
                        'ps_promotion_conditions': order.get('ps_promotion', {}).get('conditions') if order.get('ps_promotion') else None,
                        'cancellation_title': order.get('cancellation', {}).get('title') if order.get('cancellation') else None,
                        'cancellation_initiator': order.get('cancellation', {}).get('initiator') if order.get('cancellation') else None
                    }
                    
                    products_data = []
                    for product in order.get('products', []):
                        product_data = {
                            'order_id': order.get('id'),
                            'product_id': product.get('id'),
                            'product_external_id': product.get('external_id'),
                            'product_image': product.get('image'),
                            'product_quantity': product.get('quantity'),
                            'product_price': product.get('price'),
                            'product_url': product.get('url'),
                            'product_name': product.get('name'),
                            'product_name_ru': product.get('name_multilang', {}).get('ru') if product.get('name_multilang') else None,
                            'product_name_uk': product.get('name_multilang', {}).get('uk') if product.get('name_multilang') else None,
                            'product_total_price': product.get('total_price'),
                            'product_measure_unit': product.get('measure_unit'),
                            'product_sku': product.get('sku'),
                            'product_cpa_commission_amount': product.get('cpa_commission', {}).get('amount') if product.get('cpa_commission') else None
                        }
                        products_data.append(product_data)
                    
                    if add_order(order_data, products_data):
                        print(f"Added order {order['id']} created at {order_date}")
                
                    last_created_time = order_date
                    last_id = order['id']
            
                if len(orders['orders']) < 20:
                    break
        
        except Exception as e:
            print(f"Error occurred while fetching orders: {e}")
            break

    return "Finished updating orders"


if __name__ == "__main__":
    # Create an instance of the PromApiClient with the AUTH_TOKEN
    client = PromApiClient(AUTH_TOKEN)

    orders = client.get_orders(
                limit=20,
                date_from='2024-10-22T11:26:34',
                date_to='2024-10-22T15:32:10',
                sort_dir='asc'
            )

    print(orders)

    # Fetch new orders using the client
    print(fetch_orders_by_date(client))
