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
    message_id = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False)
    date = Column(DateTime, nullable=False)

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