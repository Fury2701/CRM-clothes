from woocommerce import API

class WooAPI:
    def __init__(self, url, consumer_key, consumer_secret):
        self.url = url
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.wcapi = API(
            url=self.url,
            consumer_key=self.consumer_key,
            consumer_secret=self.consumer_secret,
            version="wc/v3"
        )

    def get_products(self):
        return self.wcapi.get("products").json()

    def get_product(self, id):
        return self.wcapi.get(f"products/{id}").json()

    def create_product(self, data):
        return self.wcapi.post("products", data).json()

    def update_product(self, id, data):
        return self.wcapi.put(f"products/{id}", data).json()

    def delete_product(self, id):
        return self.wcapi.delete(f"products/{id}").json()

    def get_wc_orders(self, page=1, per_page=20):
        params = {
            "page": page,
            "per_page": per_page
        }
        return self.wcapi.get("orders", params=params).json()

    def get_order(self, id):
        return self.wcapi.get(f"orders/{id}").json()

    def create_order(self, data):
        return self.wcapi.post("orders", data).json()

    def update_order(self, id, data):
        return self.wcapi.put(f"orders/{id}", data).json()

    def delete_order(self, id):
        return self.wcapi.delete(f"orders/{id}").json()
    
    def get_customers(self):
        return self.wcapi.get("customers").json()

    def get_customer(self, id):
        return self.wcapi.get(f"customers/{id}").json()

    def create_customer(self, data):
        return self.wcapi.post("customers", data).json()

    def update_customer(self, id, data):
        return self.wcapi.put(f"customers/{id}", data).json()

    def delete_customer(self, id):
        return self.wcapi.delete(f"customers/{id}").json()

def get_woocomerce():
    url = "https://www.detskietkani.com/"
    consumer_key = "ck_de2030182708c1a8a9bf7ddf3f477df0ee96a0ea"
    consumer_secret = "cs_e92b1f6b155d9e9e2ddd5e7fb11c950f20b4ce06"
    Woo = WooAPI(url, consumer_key, consumer_secret)

    return Woo
  




