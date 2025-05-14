from config import *

Base = declarative_base()
Base_second = declarative_base()

class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    login = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    lvl= Column(Integer, nullable=False)

class Sms_history(Base):
    __tablename__ = 'Sms_history'

    id = Column(Integer, primary_key=True)
    user = Column(String(255), nullable=False)
    phone_number = Column(String(255), nullable=False)
    message_text = Column(String(255), nullable=False)
    message_id = Column(String(255), nullable=True)
    status = Column(String(255), nullable=False)
    date = Column(DateTime, nullable=False)
    message_type= Column(String(255), nullable=False)

class custom_status(Base):
    __tablename__ = 'custom_status'

    id = Column(Integer, primary_key=True)
    key = Column(String(255), nullable=False)
    value = Column(String(255), nullable=False)

class manager_order(Base):
    __tablename__ = 'manager_order'

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, nullable=False)
    manager_id = Column(Integer, nullable=False)
    

class wp_woocommerce_order_items(Base_second):
    __tablename__ = 'wp_woocommerce_order_items'

    order_item_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, nullable=False)
    order_item_name = Column(String(255), nullable=False)
    order_item_type = Column(String(255), nullable=False)
    
class wp_wc_orders(Base_second):
    __tablename__ = 'wp_wc_orders'

    id = Column(Integer, primary_key=True)
    status = Column(String(255), nullable=False)
    currency = Column(String(255), nullable=False)
    type_ = Column('type',String(255), nullable=False)
    tax_amount = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    customer_id = Column(Integer, nullable=False)
    billing_email = Column(String(255), nullable=False)
    date_created_gmt = Column(DateTime, nullable=False)
    date_updated_gmt = Column(DateTime, nullable=False)
    parent_order_id = Column(Integer, nullable=False)
    payment_method = Column(String(255), nullable=False)
    payment_method_title = Column(String(255), nullable=False)
    transaction_id = Column(Integer, nullable=True)
    ip_address = Column(String(255), nullable=False)
    user_agent = Column(String(255), nullable=False)
    customer_note = Column(String(255), nullable=True)
    
class nova_poshta(Base):
    __tablename__ = 'nova_poshta'
    id = Column(Integer, primary_key=True, nullable=False)
    ord_id = Column(Integer, nullable=False)
    ttn_id = Column(Integer, nullable=False)
    ref_code = Column(String, nullable=False)
    client_name = Column(String, nullable=False)
    date= Column(DateTime, nullable=False)

class counteragents(Base):
    __tablename__ = 'counteragents'
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    ref = Column(String, nullable=False)
    contact_ref = Column(String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'ref': self.ref,
            'contact_ref': self.contact_ref
        }

class Order(Base):
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    order_id = Column(BigInteger, nullable=False)
    date_created = Column(TIMESTAMP, nullable=False)
    client_first_name = Column(String(255), nullable=True)
    client_second_name = Column(String(255), nullable=True)
    client_last_name = Column(String(255), nullable=True)
    client_id = Column(Integer, nullable=True)
    client_notes = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    price = Column(String, nullable=True)
    full_price = Column(String, nullable=True)
    delivery_option_id = Column(Integer, nullable=True)
    delivery_option_name = Column(String(255), nullable=True)
    delivery_shipping_service = Column(String(255), nullable=True)
    delivery_provider = Column(String(50), nullable=True)
    delivery_type = Column(String(50), nullable=True)
    delivery_sender_warehouse_id = Column(String(255), nullable=True)
    delivery_recipient_warehouse_id = Column(String(255), nullable=True)
    delivery_declaration_number = Column(String(255), nullable=True)
    delivery_unified_status = Column(String(255), nullable=True)
    delivery_address = Column(String(255), nullable=True)
    delivery_cost = Column(DECIMAL(10, 2), nullable=True)
    payment_option_id = Column(Integer, nullable=True)
    payment_option_name = Column(String(255), nullable=True)
    payment_type = Column(String(50), nullable=True)
    payment_status = Column(String(50), nullable=True)
    payment_status_modified = Column(TIMESTAMP, nullable=True)
    status = Column(String(50), nullable=True)
    status_name = Column(String(255), nullable=True)
    source = Column(String(50), nullable=True)
    has_order_promo_free_delivery = Column(Boolean, nullable=True)
    cpa_commission_amount = Column(DECIMAL(10, 2), nullable=True)
    cpa_commission_is_refunded = Column(Boolean, nullable=True)
    utm_medium = Column(String(255), nullable=True)
    utm_source = Column(String(255), nullable=True)
    utm_campaign = Column(String(255), nullable=True)
    dont_call_customer_back = Column(Boolean, nullable=True)
    ps_promotion_name = Column(String(255), nullable=True)
    ps_promotion_conditions = Column(ARRAY(String(255)), nullable=True)
    cancellation_title = Column(String(255), nullable=True)
    cancellation_initiator = Column(String(50), nullable=True)

    products = relationship('OrderProduct', back_populates='order')


class OrderProduct(Base):
    __tablename__ = 'order_products'
    
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    order_id = Column(BigInteger, ForeignKey('orders.order_id'), nullable=False)
    product_id = Column(BigInteger, nullable=False)
    product_external_id = Column(String(255), nullable=True)
    product_image = Column(String(255), nullable=True)
    product_quantity = Column(Integer, nullable=True)
    product_price = Column(String, nullable=True)
    product_url = Column(String(255), nullable=True)
    product_name = Column(String(255), nullable=True)
    product_name_ru = Column(String(255), nullable=True)
    product_name_uk = Column(String(255), nullable=True)
    product_total_price = Column(String, nullable=True)
    product_measure_unit = Column(String(50), nullable=True)
    product_sku = Column(String(255), nullable=True)
    product_cpa_commission_amount = Column(DECIMAL(10, 2), nullable=True)

    order = relationship('Order', back_populates='products')