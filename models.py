from config import *

Base = declarative_base()
Base_second = declarative_base()

class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    login = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)

class Sms_history(Base):
    __tablename__ = 'Sms_history'

    id = Column(Integer, primary_key=True)
    user = Column(String(255), nullable=False)
    phone_number = Column(String(255), nullable=False)
    message_text = Column(String(255), nullable=False)
    message_id = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False)
    date = Column(DateTime, nullable=False)

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
    
