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

    def get_products(self, name=None, category=None, page=1, per_page=20):
        params = {
            "page": page,
            "per_page": per_page
        }
        if category:
            params["category"] = category

        if Name:
            params["search"] = name

        response = self.wcapi.get("products", params=params)
        products = response.json()

        total_pages = int(response.headers.get('X-WP-TotalPages', 0))

        return products, total_pages

    def get_product(self, id):
        return self.wcapi.get(f"products/{id}").json()

    def create_product(self, data):
        return self.wcapi.post("products", data).json()

    def update_product(self, id, data):
        return self.wcapi.put(f"products/{id}", data).json()

    def delete_product(self, id):
        return self.wcapi.delete(f"products/{id}").json()

    def get_wc_orders(self, full_name=None, page=1, per_page=20):
        params = {
            "page": page,
            "per_page": per_page
        }
        if full_name:
            params["search"] = full_name
        
        response = self.wcapi.get("orders", params=params)
        orders = response.json()
        
        # Отримання загальної кількості сторінок
        total_pages = int(response.headers.get('X-WP-TotalPages', 0))
        
        return orders, total_pages

    def get_wc_status_orders(self, status, page=1, per_page=20):
        params = {
            "status": status,
            "page": page,
            "per_page": per_page
        }
        response = self.wcapi.get("orders", params=params)
        orders = response.json()
        total_pages = int(response.headers.get('X-WP-TotalPages', 0))

        return orders, total_pages 

    def get_sorted_old_to_new_orders(self, page=1, per_page=20):
        params = {
            "orderby": "date",
            "order": "asc",  # Сортування від найдавніших до найновіших
            "page": page,
            "per_page": per_page
        }
        response = self.wcapi.get("orders", params=params)
        orders = response.json()
        total_pages = int(response.headers.get('X-WP-TotalPages', 0))

        return orders, total_pages


    def get_order(self, id):
        return self.wcapi.get(f"orders/{id}").json()

    def create_order(self, data):
        return self.wcapi.post("orders", data).json()

    def update_order(self, id, data):
        return self.wcapi.put(f"orders/{id}", data).json()

    def delete_order(self, id):
        return self.wcapi.delete(f"orders/{id}").json()
    
    def get_customers(self, page=1, per_page=20):
        params = {
            "page": page,
            "per_page": per_page
        }
        response = self.wcapi.get("customers", params=params)
        customers = response.json()
        total_pages = int(response.headers.get('X-WP-TotalPages', 0))

        return customers, total_pages

    def get_customer(self, id):
        return self.wcapi.get(f"customers/{id}").json()

    def create_customer(self, data):
        return self.wcapi.post("customers", data).json()

    def update_customer(self, id, data):
        return self.wcapi.put(f"customers/{id}", data).json()

    def delete_customer(self, id):
        return self.wcapi.delete(f"customers/{id}").json()

    def get_notes(self, id, page=1, per_page=20):
        params = {
            "page": page,
            "per_page": per_page
        }
        return self.wcapi.get(f"orders/{id}/notes", params=params).json()

    def get_note(self, id, note_id):
        return self.wcapi.get(f"orders/{id}/notes/{note_id}").json()

    def create_note(self, id, data):
        return self.wcapi.post(f"orders/{id}/notes", data).json()

    def delete_note(self, id, note_id):
        return self.wcapi.delete(f"orders/{id}/notes/{note_id}", params={"force":True}).json()

    def get_discout_coupons(self, search=None, code=None, page=1, per_page=20):
        params = {
            "page": page,
            "per_page": per_page
        }
        if search:
            params["search"] = search
        if code:
            params["code"] = code
        return self.wcapi.get("coupons", params=params).json()

    def create_discount_coupon(self, data):
        return self.wcapi.post("coupons", data).json()

    def delete_discount_coupon(self, id):
        return self.wcapi.delete(f"coupons/{id}").json()


def get_woocomerce():
    url = "https://www.detskietkani.com/"
    consumer_key = "ck_de2030182708c1a8a9bf7ddf3f477df0ee96a0ea"
    consumer_secret = "cs_e92b1f6b155d9e9e2ddd5e7fb11c950f20b4ce06"
    Woo = WooAPI(url, consumer_key, consumer_secret)

    return Woo      



