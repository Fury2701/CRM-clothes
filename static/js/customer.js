document.addEventListener('DOMContentLoaded', function() {
  const homeImgButton = document.querySelector('.home-img');

  homeImgButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/admin?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.products-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/product?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.menu-list .products-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/product?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListButton = document.querySelector('.menu-list #href-products');

  customerListButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/product?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const homeImgButton = document.querySelector('.menu-list .home-img');

  homeImgButton.addEventListener('click', function(e) {
    e.preventDefault(); 

    window.location.href = '/admin?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const homeButton = document.querySelector('.menu-list #href-main');

  homeButton.addEventListener('click', function(e) {
    e.preventDefault(); 

    window.location.href = '/admin?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const deliveryButton = document.querySelector('#export');

  deliveryButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/delivery?page=1';
  });
});

$('.menu-btn').on('click', function(e) {
  e.preventDefault();
  $(this).hide();
  $('.menu').toggleClass('menu_active');
  $('.content').toggleClass('content_active');
  $('.my-content').toggleClass('content-shifted');
});

$('.menu2-btn').on('click', function(e) {
  e.preventDefault();
  $('.menu').removeClass('menu_active');
  $('.content').removeClass('content_active');
  $('.my-content').removeClass('content-shifted');
  $('.menu-btn').show();
});

$('.div-70x70px').on('click', function(e) {
  e.preventDefault();
  $('.menu').toggleClass('menu_active');
  $('.content').toggleClass('content_active');
  $('.my-content').toggleClass('content-shifted');
  $('.menu-btn').toggle();
});

$('.in-menu-div-70x70px').on('click', function(e) {
  e.preventDefault();
  $('.menu').removeClass('menu_active');
  $('.content').removeClass('content_active');
  $('.my-content').removeClass('content-shifted');
  $('.menu-btn').show();
});

$(document).ready(function() {
  $(".menu2-btn").click(function() {
    $(".menu-btn").toggle();
  });
});

  let currentPage = 1;
  let orderData;
// Функция для загрузки клиентов с учетом параметров поиска и пагинации
function loadCustomers(page = 1, name = '') {
const url = `/data_customers?page=${page}&name=${encodeURIComponent(name)}`;
fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    populateCustomersTable(data.customers);
    updatePagination(data.current_page, data.total_pages);
  })
  .catch(error => {
    console.error('Ошибка при загрузке клиентов:', error);
  });
}

  function updatePagination(currentPage, totalPages) {
    try {
      const paginationContainer = $('#paginationContainer');
      paginationContainer.empty();

      if (!totalPages || totalPages <= 1) {
        throw new Error('Total pages not available or less than or equal to 1');
      }

      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        paginationContainer.append(`<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`);
        if (startPage > 2) {
          paginationContainer.append(`<li class="page-item"><span class="page-link">...</span></li>`);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationContainer.append(`<li class="page-item${i === currentPage ? ' active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          paginationContainer.append(`<li class="page-item"><span class="page-link">...</span></li>`);
        }
        paginationContainer.append(`<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`);
      }

      // Показать пагинацию
      paginationContainer.show();
    } catch (error) {
      console.error('Ошибка при обновлении пагинации:', error);
      // Скрыть пагинацию, если возникла ошибка или total_pages не доступны
      $('#paginationContainer').hide();
    }
  }

// Обработчик события клика по ссылке пагинации
$(document).on('click', '.pagination .page-link', function(e) {
e.preventDefault();
const page = $(this).data('page');
const searchQuery = $('#searchInput').val().trim();
loadCustomers(page, searchQuery);
});

  function populateCustomersTable(customers) {
      const tableBody = document.querySelector('#clientsTable tbody');
      tableBody.innerHTML = '';
    
      customers.forEach(customer => {
        const row = document.createElement('tr');
        row.dataset.customerId = customer.id;
    
        const idCell = document.createElement('td');
        idCell.textContent = customer.id;
        row.appendChild(idCell);
    
        const nameCell = document.createElement('td');
        const nameLink = document.createElement('a');
        nameLink.href = '#';
        nameLink.textContent = `${customer.first_name} ${customer.last_name}`;
        nameLink.dataset.customerId = customer.id;
        nameLink.dataset.bsToggle = 'modal';
        nameLink.dataset.bsTarget = '#clientModal';
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);
    
        const emailCell = document.createElement('td');
        emailCell.textContent = customer.email;
        row.appendChild(emailCell);
    
        const phoneCell = document.createElement('td');
        phoneCell.textContent = customer.billing.phone;
        row.appendChild(phoneCell);
    
        const addressCell = document.createElement('td');
        const address = [];
    
        if (customer.billing.address_1) {
          address.push(`вул. ${customer.billing.address_1}`);
        }
    
        if (customer.billing.address_2) {
          address.push(customer.billing.address_2);
        }
    
        if (customer.billing.city) {
          address.push(`м. ${customer.billing.city}`);
        }
    
        if (customer.billing.state) {
          address.push(`обл. ${customer.billing.state}`);
        }
    
        if (customer.billing.postcode) {
          address.push(customer.billing.postcode);
        }
    
        if (customer.billing.country) {
          address.push(customer.billing.country);
        }
    
        addressCell.textContent = address.join(', ');
        row.appendChild(addressCell);
    
        tableBody.appendChild(row);
      });
    }

  function openCustomerModal(customerId) {
      fetch(`/customerbyid?id=${customerId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Ошибка при получении данных о клиенте');
          }
          return response.json();
        })
        .then(customerJson => {
          const customer = JSON.parse(customerJson);
          // Заполнение модального окна данными о клиенте
          $('#clientModalLabel').text(`${customer.first_name} ${customer.last_name}`);
          $('#clientModalLabel').data('customer-id', customer.id);
          $('#editClientName').val(`${customer.first_name} ${customer.last_name}`);
          $('#editClientEmail').val(customer.email);
          $('#editClientPhone').val(customer.billing.phone);
          $('#editClientAddress').val(`${customer.billing.address_1}, ${customer.billing.city}, ${customer.billing.state} ${customer.billing.postcode}, ${customer.billing.country}`);
    

          loadClientOrders(customerId);
          // Открытие модального окна
          $('#clientModal').modal('show');
        })
        .catch(error => {
          console.error('Ошибка при получении данных о клиенте:', error);
        });
    }

  // Обработчик события клика на имя клиента
  $(document).on('click', '#clientsTable tbody tr td:nth-child(2) a', function(event) {
    event.preventDefault();
    const customerId = $(this).data('customer-id');
    openCustomerModal(customerId);
  });

  function updateCustomer(customerId, data) {
    fetch('/update_customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: customerId,
        ...data
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при обновлении клиента');
      }
      return response.json();
    })
    .then(result => {
      console.log('Клиент успешно обновлен:', result);
      // Дополнительные действия после успешного обновления клиента
      $('#clientModal').modal('hide');
      loadCustomers(currentPage);
    })
    .catch(error => {
      console.error('Ошибка при обновлении клиента:', error);
      // Обработка ошибки
    });
  }

// Обработчик клика на кнопку "Зберегти"
$(document).on('click', '#saveChangesBtn', function() {
  const customerId = $('#clientModalLabel').data('customer-id');
  const name = $('#editClientName').val();
  const email = $('#editClientEmail').val();
  const phone = $('#editClientPhone').val();
  const address = $('#editClientAddress').val();

  const updatedData = {};

  if (name) {
    const [firstName, lastName] = name.split(' ');
    if (firstName) {
      updatedData.first_name = firstName;
    }
    if (lastName) {
      updatedData.last_name = lastName;
    }
  }

  if (email) {
    updatedData.email = email;
  }

  if (phone || address) {
    updatedData.billing = {};
    if (phone) {
      updatedData.billing.phone = phone;
    }
    if (address) {
      const [address1, city, statePostcode, country] = address.split(', ');
      if (address1) {
        updatedData.billing.address_1 = address1;
      }
      if (city) {
        updatedData.billing.city = city;
      }
      if (statePostcode) {
        const [state, postcode] = statePostcode.split(' ');
        if (state) {
          updatedData.billing.state = state;
        }
        if (postcode) {
          updatedData.billing.postcode = postcode;
        }
      }
      if (country) {
        updatedData.billing.country = country;
      }
    }
  }

  updateCustomer(customerId, updatedData);
});

  // Обработчик клика на кнопку "Додати клієнта"
  $(document).on('click', '#create-client', function() {
    $('#createClientModal').modal('show');
  });

// Обработчик клика на кнопку "Зберегти" в модальном окне создания клиента
$(document).on('click', '#createClientBtn', function() {
  const username = $('#clientUsername').val();
  const email = $('#clientEmail').val();
  const firstName = $('#clientFirstName').val();
  const lastName = $('#clientLastName').val();
  const billingAddress1 = $('#clientBillingAddress1').val();
  const billingAddress2 = $('#clientBillingAddress2').val();
  const billingCity = $('#clientBillingCity').val();
  const billingState = $('#clientBillingState').val();
  const billingPostcode = $('#clientBillingPostcode').val();
  const billingCountry = $('#clientBillingCountry').val();
  const billingPhone = $('#clientBillingPhone').val();

  const data = {
    email: email,
    first_name: firstName,
    last_name: lastName,
    username: username,
    billing: {
      first_name: firstName,
      last_name: lastName,
      address_1: billingAddress1,
      address_2: billingAddress2,
      city: billingCity,
      state: billingState,
      postcode: billingPostcode,
      country: billingCountry,
      email: email,
      phone: billingPhone
    },
    shipping: {
      first_name: firstName,
      last_name: lastName,
      address_1: billingAddress1,
      address_2: billingAddress2,
      city: billingCity,
      state: billingState,
      postcode: billingPostcode,
      country: billingCountry
    }
  };

  createCustomer(data);
});

  function createCustomer(data) {
    fetch('/create_customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при создании клиента');
      }
      return response.json();
    })
    .then(result => {
      console.log('Клиент успешно создан:', result);
      // Закрытие модального окна
      $('#createClientModal').modal('hide');
      // Сброс формы создания клиента
      $('#createClientForm')[0].reset();
      // Обновление списка клиентов
      loadCustomers(currentPage);
    })
    .catch(error => {
      console.error('Ошибка при создании клиента:', error);
      // Обработка ошибки
    });
  }

  // Обработчик клика по кнопке "Видалити клієнта"
  $(document).on('click', '#deleteClientBtn', function() {
    const customerId = $('#clientModalLabel').data('customer-id');

    if (confirm('Ви дійсно хочете видалити клієнта?')) {
      deleteCustomer(customerId);
    }
  });

  // Функция для отправки запроса на удаление клиента
  function deleteCustomer(customerId) {
    fetch(`/delete_customer?id=${customerId}`, {
      method: 'GET'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Помилка при видаленні клієнта');
        }
        return response.json();
      })
      .then(data => {
        console.log('Клієнт успішно видалено:', data);
        // Закрыть модальное окно
        $('#clientModal').modal('hide');
        // Обновить данные на странице после успешного удаления клиента
        loadCustomers(currentPage);
      })
      .catch(error => {
        console.error('Помилка при видаленні клієнта:', error);
      });
  }
// Обработчик события отправки формы поиска
$(document).on('submit', '#searchForm', function(e) {
e.preventDefault();
const searchQuery = $('#searchInput').val().trim();
loadCustomers(1, searchQuery);
});

// Обработчик события нажатия кнопки поиска
$(document).on('click', '#searchButton', function() {
const searchQuery = $('#searchInput').val().trim();
loadCustomers(1, searchQuery);
});

// Обработчик события нажатия клавиши Enter в поле ввода поиска
$(document).on('keypress', '#searchInput', function(e) {
if (e.which === 13) {
  const searchQuery = $(this).val().trim();
  loadCustomers(1, searchQuery);
}
});

function loadClientOrders(customerId, page = 1) {
fetch(`/dataorders?customer_id=${customerId}&page=${page}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    populateClientOrdersTable(data.orders);
    updateClientOrdersPagination(data.current_page, data.total_pages);
  })
  .catch(error => {
    console.error('Ошибка при загрузке заказов клиента:', error);
  });
}

function populateClientOrdersTable(orders) {
  const tableBody = document.querySelector('#clientOrdersTable tbody');
  tableBody.innerHTML = '';

  orders.forEach(order => {
    const row = document.createElement('tr');

    const imageCell = document.createElement('td');
    const imageElement = document.createElement('img');
    if (order.line_items && order.line_items[0] && order.line_items[0].image) {
      imageElement.src = order.line_items[0].image.src;
      imageElement.alt = order.line_items[0].name;
    }
    imageElement.width = 100;
    imageElement.height = 100;
    imageCell.appendChild(imageElement);
    row.appendChild(imageCell);

    const orderCell = document.createElement('td');
    const orderLink = document.createElement('a');
    orderLink.href = '#';
    orderLink.textContent = order.id;
    orderLink.dataset.orderId = order.id;
    orderLink.dataset.bsToggle = 'modal';
    orderLink.dataset.bsTarget = '#orderModal';
    orderCell.appendChild(orderLink);

    const createdDateElement = document.createElement('div');
    createdDateElement.textContent = order.date_created;
    orderCell.appendChild(createdDateElement);

    row.appendChild(orderCell);

    const totalCell = document.createElement('td');
    totalCell.textContent = order.total + " " + order.currency;
    row.appendChild(totalCell);

    const shippingCell = document.createElement('td');
    const paidIcon = order.date_paid ? '<img src="/static/images/ok.png" width="16" height="16">' : '<img src="/static/images/ok.png" width="16" height="16">';
    shippingCell.innerHTML = `${order.shipping_lines[0].method_title} ${paidIcon}<br>${order.payment_method_title}`;
    row.appendChild(shippingCell);

    const statusCell = document.createElement('td');
    const translatedStatus = translateStatus(order.status);
    statusCell.textContent = translatedStatus;
    row.appendChild(statusCell);

    tableBody.appendChild(row);
  });
}

function translateStatus(status) {
  switch (status) {
    case 'pending':
      return 'В очікуванні оплати';
    case 'processing':
      return 'В обробці';
    case 'on-hold':
      return 'На утриманні';
    case 'completed':
      return 'Завершений';
    case 'cancelled':
      return 'Відмінений';
    case 'refunded':
      return 'Повернутий';
    case 'failed':
      return 'Невдалий';
    case 'trash':
      return 'Корзина';
    default:
      return status;
  }
}

function updateClientOrdersPagination(current__Page, totalPages) {
const paginationContainer = $('#clientOrdersPaginationContainer');
paginationContainer.empty();

if (!totalPages || totalPages <= 1) {
  paginationContainer.hide();
  return;
}

const maxVisiblePages = 5;
let startPage = Math.max(1, current__Page - Math.floor(maxVisiblePages / 2));
let endPage = startPage + maxVisiblePages - 1;

if (endPage > totalPages) {
  endPage = totalPages;
  startPage = Math.max(1, endPage - maxVisiblePages + 1);
}

if (startPage > 1) {
  paginationContainer.append(`<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`);
  if (startPage > 2) {
    paginationContainer.append(`<li class="page-item"><span class="page-link">...</span></li>`);
  }
}

for (let i = startPage; i <= endPage; i++) {
  paginationContainer.append(`<li class="page-item${i === current__Page ? ' active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
}

if (endPage < totalPages) {
  if (endPage < totalPages - 1) {
    paginationContainer.append(`<li class="page-item"><span class="page-link">...</span></li>`);
  }
  paginationContainer.append(`<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`);
}

paginationContainer.show();
}

// Обработчик клика по ссылке пагинации для заказов клиента
$(document).on('click', '#clientOrdersPaginationContainer .page-link', function(e) {
e.preventDefault();
const page = $(this).data('page');
const customerId = $('#clientModalLabel').data('customer-id');
loadClientOrders(customerId, page);
});

function openOrderModal(orderId) {
  fetch(`/dataordersbyid?id=${orderId}`)
    .then(response => response.json())
    .then(data => {
      orderData = data; // Присвоение значения orderData
      populateOrderModal(data);
      $('#orderModal').modal('show');
    })
    .catch(error => {
      console.error('Ошибка при получении данных о заказе:', error);
    });
}

$(document).on('click', '#clientOrdersTable tbody tr td:nth-child(2) a', function(event) {
event.preventDefault();
const orderId = $(this).data('order-id');
openOrderModal(orderId);
});

function updateOrder(orderId, updatedFields) {
fetch('/update_order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: orderId,
    data: updatedFields
  })
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при обновлении заказа');
    }
    return response.json();
  })
  .then(updatedOrder => {
    const customerId = $('#clientModalLabel').data('customer-id');
  })
  .catch(error => {
    console.error('Ошибка при обновлении заказа:', error);
  });
}



// Обработчик изменения количества товара
$(document).on('change', '.table-input', function() {
  const index = $(this).closest('tr').index();
  const newQuantity = parseFloat($(this).val());
  
  // Обновляем количество товара в массиве line_items
  orderData.line_items[index].quantity = newQuantity;
  
  // Пересчитываем общую стоимость товара
  const price = parseFloat(orderData.line_items[index].price);
  orderData.line_items[index].total = (price * newQuantity).toFixed(2);
  

});

function getUpdatedFields(orderId) {
  const updatedFields = {};

  const newStatus = $('#orderModal .dropdown-list').val();
  if (newStatus !== orderData.status) {
    updatedFields.status = newStatus;
  }

  const isPaid = $('#if_Paid').val() === 'true';
  if (isPaid !== !!orderData.date_paid) {
    updatedFields.set_paid = isPaid;
  }
  
  const updatedLineItems = orderData.line_items.filter(item => item.quantity !== item.original_quantity);
  if (updatedLineItems.length > 0) {
    updatedFields.line_items = updatedLineItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      total: item.total
    }));
  }

  const selectedCustomStatuses = getSelectedCustomStatuses();
  if (selectedCustomStatuses.length > 0) {
    updatedFields.meta_data = [
      {
        key: '_custom_statuses',
        value: selectedCustomStatuses
      }
    ];
  } else {
    const existingCustomStatuses = orderData.meta_data.find(meta => meta.key === '_custom_statuses');
    if (existingCustomStatuses) {
      updatedFields.meta_data = [
        {
          key: '_custom_statuses',
          value: []
        }
      ];
    }
  }
  
  return updatedFields;
}



// Обработчик клика на кнопку "Зберегти" в модальном окне
$(document).on('click', '#saveOrderBtn', function() {
  const orderId = $('#orderModalLabel').data('order-id');
  
  const updatedFields = getUpdatedFields(orderId);
  
  if (Object.keys(updatedFields).length > 0) {
    updateOrder(orderId, updatedFields);
  }
  
  // Получаем значения скидки из полей ввода
  const discountAmount = parseFloat($('#discount_amount').val());
  const discountType = $('#discount_type').val();
  
  // Проверяем, что значения скидки заполнены
  if (!isNaN(discountAmount) && discountAmount > 0 && discountType) {
    // Создаем объект с данными для отправки на сервер
    const discountData = {
      order_id: orderId,
      discount_amount: discountAmount,
      discount_type: discountType
    };
    console.log(discountData);
    // Отправляем запрос на сервер для обновления скидки заказа
    updateOrderDiscount(discountData);
  }
});

// Функция для отправки запроса на обновление скидки заказа
function updateOrderDiscount(discountData) {
  fetch('/update_order_discount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(discountData)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error('Помилка при оновленні знижки замовлення: ' + error.error);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Знижка замовлення успішно оновлена:', data);
      // Обновляем данные заказа после успешного обновления скидки
    
    })
    .catch(error => {
      console.error('Помилка при оновленні знижки замовлення:', error);
    });
}

$(document).on('click', '#deleteOrderBtn', function() {
const orderId = $('#orderModalLabel').data('order-id');

if (confirm('Ви дійсно хочете видалити замовлення?')) {
  deleteOrder(orderId);
}
});

function deleteOrder(orderId) {
fetch(`/delete_order?id=${orderId}`, {
  method: 'POST'
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Помилка при видаленні замовлення');
    }
    return response.json();
  })
  .then(data => {
    console.log('Замовлення успішно видалено:', data);
    $('#orderModal').modal('hide');
    const customerId = $('#clientModalLabel').data('customer-id');
    loadClientOrders(customerId);
  })
  .catch(error => {
    console.error('Помилка при видаленні замовлення:', error);
  });
}

function loadSMS() {
  const phoneNumber = orderData.billing.phone;
  fetch(`/get_all_sms?number=${phoneNumber}`)
    .then(response => response.json())
    .then(data => {
      $('#smsTable tbody').empty();

      if (data.sms_data && data.sms_data.length > 0) {
        let tableRows = [];
        data.sms_data.forEach(sms => {
          tableRows.unshift(`
            <tr>
              <td class="sms-text">${sms.text || ''}</td>
              <td class="sms-status">${sms.status || ''}</td>
              <td class="sms-refresh">
                <img src="/static/images/refresh.png" width="20px" lenght="20px" alt="Обновить статус" class="update-sms-status" data-message-id="${sms.message_id}" style="cursor: pointer;">
              </td>
            </tr>
          `);
        });
        $('#smsTable tbody').html(tableRows.join(''));
      } else {
        $('#smsTable tbody').html(`
          <tr>
            <td colspan="4">SMS не знайдено</td>
          </tr>
        `);
      }
    })
    .catch(error => {
      console.error('Ошибка при получении SMS:', error);
    });
}

function updateSMSStatus(messageId) {
  fetch(`/update_sms_status/${encodeURIComponent(messageId)}`)
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error('Помилка при оновленні статусу SMS: ' + error.error);
        });
      }
      return response.text();
    })
    .then(data => {
      console.log('Статус SMS успішно оновлено:', data);
      loadSMS();
    })
    .catch(error => {
      console.error('Помилка при оновленні статусу SMS:', error);
    });
}

$(document).on('click', '.update-sms-status', function() {
  const messageId = $(this).data('message-id');
  updateSMSStatus(messageId);
});

$(document).on('click', '#sendSMSBtn', function() {
  const orderId = $('#orderModalLabel').data('order-id');
  const phoneNumber = orderData.billing.phone;
  const messageText = $('#messageText').val();

  if (phoneNumber && messageText) {
    const smsData = {
      phone_number: phoneNumber,
      message_text: messageText
    };

    sendSMS(orderId, smsData);
  }
});

function sendSMS(orderId, smsData) {
  const requestData = {
    id: orderId,
    phone_number: smsData.phone_number,
    message_text: smsData.message_text
  };

  fetch('/send_phone_sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error('Помилка при відправці SMS: ' + error.error);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('SMS успішно відправлено:', data);
      $('#messageText').val('');
      loadSMS();
    })
    .catch(error => {
      console.error('Помилка при відправці SMS:', error);
    });
}

function loadnotes() {
const orderId = $('#orderModalLabel').data('order-id');
fetch(`/notes?id=${orderId}&page=1`)
  .then(response => response.json())
  .then(data => {
    $('#noteTable tbody').empty();

    if (data.length > 0) {
      let tableRows = [];
      data.forEach(note => {
        tableRows.unshift(`
          <tr>
            <td class="note-text">${note.note}</td>
            <td class="note-timestamp">${note.date_created}</td>
            <td class="note-author">${note.author}</td>
            <td class="note-delete">
              <span class="delete-note" role="button" data-note-id="${note.id}">&#10006;</span>
            </td>
          </tr>
        `);
      });

      $('#noteTable tbody').html(tableRows.join(''));
    } else {
      $('#noteTable tbody').html(`
        <tr>
          <td colspan="4">Заміток немає</td>
        </tr>
      `);
    }
  })
  .catch(error => {
    console.error('Ошибка при получении заметок:', error);
  });
}

$(document).on('click', '#createNoteBtn', function() {
const orderId = $('#orderModalLabel').data('order-id');
const noteText = $('#managerNotes').val();

if (noteText.trim() !== '') {
  createNote(orderId, noteText);
  $('#managerNotes').val('');
}
});

function createNote(orderId, noteText) {
const data = {
  note: noteText
};

fetch(`/create_note?id=${orderId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Помилка при створенні замітки');
    }
    return response.json();
  })
  .then(createdNote => {
    console.log('Замітка успішно створена:', createdNote);
    loadnotes();
  })
  .catch(error => {
    console.error('Помилка при створенні замітки:', error);
  });
}

$(document).on('click', '.delete-note', function() {
const noteId = $(this).data('note-id');
deleteNote(noteId);
});

function deleteNote(noteId) {
const orderId = $('#orderModalLabel').data('order-id');

fetch(`/delete_note?id=${orderId}&note_id=${noteId}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Помилка при видаленні замітки');
    }
    return response.json();
  })
  .then(data => {
    console.log('Замітка успішно видалена:', data);
    loadnotes();
  })
  .catch(error => {
    console.error('Помилка при видаленні замітки:', error);
  });
}

$(document).on('click', '#addProductBtn', function() {
$('#addProductModal').modal('show');
});

let current__Page = 1;
let totalPages = 1;
let isLoading = false;

function loadProducts() {
if (isLoading || current__Page > totalPages) {
  return;
}

isLoading = true;

fetch(`/data_products?page=${current__Page}`)
  .then(response => response.json())
  .then(data => {
    const products = data.products;
    current__Page = data.current_page + 1;
    totalPages = data.total_pages;

    const optionsContainer = document.querySelector('.options-container');
    products.forEach(function(product) {
      const option = document.createElement('div');
      option.className = 'option';
      option.dataset.value = product.id;

      const imageSrc = product.images && product.images.length > 0 ? product.images[0].src : '';
      option.innerHTML = `<img src="${imageSrc}"> ${product.name}`;

      optionsContainer.appendChild(option);
    });

    isLoading = false;
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
    isLoading = false;
  });
}

$('.options-container').on('scroll', function() {
const optionsContainer = this;
if (optionsContainer.scrollTop + optionsContainer.clientHeight >= optionsContainer.scrollHeight) {
  loadProducts();
}
});

$('#addProductModal').on('shown.bs.modal', function() {
current__Page = 1;
$('.options-container').empty();
loadProducts();
});

document.querySelector('.selected-option').addEventListener('click', function() {
document.querySelector('.options-container').style.display = 'block';
});

document.querySelector('.options-container').addEventListener('click', function(event) {
if (event.target.classList.contains('option')) {
  selectedValue = event.target.dataset.value;
  const selectedText = event.target.textContent;
  document.querySelector('.selected-option').textContent = selectedText;
  document.querySelector('.options-container').style.display = 'none';
}
});

document.addEventListener('click', function(event) {
const customSelect = document.querySelector('.custom-select');
if (!customSelect.contains(event.target)) {
  document.querySelector('.options-container').style.display = 'none';
}
});

$(document).on('click', '#saveProductBtn', function() {
const orderId = $('#orderModalLabel').data('order-id');
const productId = selectedValue;
const quantity = parseFloat($('#quantityInput').val());

if (productId && quantity > 0) {
  const newLineItem = {
    product_id: parseInt(productId),
    quantity: quantity,
  };

  const updatedFields = {
    line_items: [newLineItem]
  };

  updateOrder(orderId, updatedFields);

  $('#addProductModal').modal('hide');
}
});

$(document).on('click', '.client-tags .btn-close', function() {
$(this).closest('.toast').remove();
});

function createTag(text) {
const existingTag = $('.client-tags .toast-body').filter(function() {
  return $(this).text().trim() === text;
});

if (existingTag.length === 0) {
  const tagElement = `
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-body">
        ${text}
        <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  $('.client-tags').prepend(tagElement);
}
}

$(document).on('click', '#customStatusList .dropdown-item', function(event) {
event.stopPropagation();
const selectedText = $(this).text();
createTag(selectedText);
});

function getSelectedCustomStatuses() {
const selectedStatuses = [];
$('.client-tags .toast').each(function() {
  selectedStatuses.push($(this).find('.toast-body').text().trim());
});
return selectedStatuses;
}

function displayCustomStatuses(customStatuses) {
const customStatusList = $('#customStatusList');
customStatusList.empty();

if (customStatuses && Array.isArray(customStatuses)) {
  customStatuses.forEach(status => {
    const listItem = $('<div>').addClass('dropdown-item d-flex justify-content-between align-items-center');
    listItem.append($('<span>').text(status.value));
    listItem.append($('<img>').attr('src', '/static/images/bin.png').addClass('delete-custom-status').attr('data-key', status.key));
    customStatusList.append(listItem);
  });
}
}

$(document).on('click', '.delete-custom-status', function(event) {
event.stopPropagation();
const key = $(this).data('key');
deleteCustomStatus(key);
});

function deleteCustomStatus(key) {
fetch('/delete_custom_status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ key: key })
})
  .then(response => {
    if (!response.ok) {
      return response.json().then(error => {
        throw new Error('Помилка при видаленні кастомного статусу: ' + error.error);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Кастомний статус успішно видалено:', data);
    load_custom_status();
  })
  .catch(error => {
    console.error('Помилка при видаленні кастомного статусу:', error);
  });
}

$(document).on('click', '#customStatusList .dropdown-item', function() {
const selectedStatus = $(this).text();
createTag(selectedStatus);
});

$(document).on('keypress', '#newCustomStatusInput', function(event) {
if (event.which === 13) {
  const newCustomStatus = $(this).val().trim();
  if (newCustomStatus !== '') {
    createTag(newCustomStatus);
    $(this).val('');
    createCustomStatus('custom_statuses:' + newCustomStatus, newCustomStatus);
    load_custom_status();
  }
}
});

$(document).on('click', '.add-tag-btn', function() {
  load_custom_status();
  });

function load_custom_status() {
fetch(`/custom_status_list`)
  .then(response => response.json())
  .then(data => {
    const customStatuses = data;
    displayCustomStatuses(customStatuses);
  })
  .catch(error => {
    console.error('Ошибка при загрузке кастомных статусов:', error);
  });
}

function createCustomStatus(key, value) {
fetch('/create_custom_status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: key,
    value: value
  })
})
  .then(response => {
    if (!response.ok) {
      return response.json().then(error => {
        throw new Error('Помилка при створенні кастомного статусу: ' + error.error);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Кастомний статус успішно створено:', data);
    load_custom_status();
  })
  .catch(error => {
    console.error('Помилка при створенні кастомного статусу:', error);
  });
}

function populateOrderModal(orderData) {
  $('#orderModalLabel').text(`Замовлення № ${orderData.id}`);
  $('#orderModalLabel').data('order-id', orderData.id);


  // Сохраняем исходное количество товаров
  orderData.line_items.forEach(item => {
  item.original_quantity = parseFloat(item.quantity);
});
  // Заполнение информации о заказе
  populateOrderTab1(orderData);
  populateOrderTab2(orderData);
  populateOrderTab3(orderData);

}


function populateOrderTab1(orderData) {
const tab1Content = `
  <div class="accordion" id="orderAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
          Основна інформація про замовлення
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#orderAccordion" style="">
        <div class="accordion-body">
          <div class="forInModalTable">
            <table class="table" id="inOrderTable">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Назва позиції</th>
                  <th scope="col">Кількість, м</th>
                  <th scope="col">Ціна за метр, грн</th>
                  <th scope="col">Сумма, грн</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.line_items.map((item, index) => `
                  <tr>
                    <td>
                      <img src="${item.image.src}" width="75" height="75">
                    </td>
                    <td>${item.name}</td>
                    <td>
                      <input type="text" class="table-input" value="${item.quantity}" step="any">
                    </td>
                    <td>
                      ${item.price}
                    </td>
                    <td>
                      ${item.total}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="text-end">
            <button type="button" class="btn btn-primary" id="addProductBtn">Додати товар</button>
          </div>
          <div class="client-tags">
            ${orderData.meta_data.find(meta => meta.key === '_custom_statuses')?.value.map(status => `
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body">
                  ${status}
                  <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
              </div>
            `).join('') || ''}
          </div>
          <div class="dropdown">
            <button class="add-tag-btn" type="button" id="addCustomStatusBtn" data-bs-toggle="dropdown" aria-expanded="false">
              +
            </button>
            <div class="dropdown-menu">
              <div class="dropdown-item">
                <input type="text" class="form-control" id="newCustomStatusInput" placeholder="Новий статус">
              </div>
              <div class="dropdown-divider"></div>
              <div id="customStatusList">
              </div>
            </div>
          </div>
          <li>Дата створення: ${orderData.date_created}</li>
          <li>Замовник: ${orderData.billing.last_name + " " + orderData.billing.first_name + " " + orderData.billing.company}</li>
          <li>Статус: 
            <select class="dropdown-list">
              <option value="pending" ${orderData.status === 'pending' ? 'selected' : ''}>В очікуванні оплати</option>
              <option value="processing" ${orderData.status === 'processing' ? 'selected' : ''}>В обробці</option>
              <option value="on-hold" ${orderData.status === 'on-hold' ? 'selected' : ''}>На утриманні</option>
              <option value="completed" ${orderData.status === 'completed' ? 'selected' : ''}>Завершений</option>
              <option value="cancelled" ${orderData.status === 'cancelled' ? 'selected' : ''}>Скасований</option>
              <option value="refunded" ${orderData.status === 'refunded' ? 'selected' : ''}>Повернений</option>
              <option value="failed" ${orderData.status === 'failed' ? 'selected' : ''}>Невдалий</option>
              <option value="trash" ${orderData.status === 'trash' ? 'selected' : ''}>Кошик</option>
            </select>
          </li>
          <li>Коментар до замовлення від покупця: ${orderData.customer_note}</li>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
          Інформація про клієнта
        </button>
      </h2>
      <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#orderAccordion" style="">
        <div class="accordion-body">
          <li>Ім'я: ${orderData.billing.last_name + " " + orderData.billing.first_name + " " + orderData.billing.company}</li>
          <li>Номер телефону: ${orderData.billing.phone}</li>
          <li>Email: ${orderData.billing.email}</li>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          Доставка
        </button>
      </h2>
      <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#orderAccordion" style="">
        <div class="accordion-body">
          <li>Метод доставки: ${orderData.shipping_lines[0].method_title}</li>
          <li>Адреса доставки: ${
            (orderData.shipping.state ? orderData.shipping.state + " " : "") +
            (orderData.shipping.city ? orderData.shipping.city + " " : "") +
            (orderData.shipping.postcode ? orderData.shipping.postcode + " " : "") +
            (orderData.shipping.address_1 ? orderData.shipping.address_1 + " " : "") +
            (orderData.shipping.address_2 ? orderData.shipping.address_2 : "") ||
            (orderData.billing.state ? orderData.billing.state + " " : "") +
            (orderData.billing.city ? orderData.billing.city + " " : "") +
            (orderData.billing.postcode ? orderData.billing.postcode + " " : "") +
            (orderData.billing.address_1 ? orderData.billing.address_1 + " " : "") +
            (orderData.billing.address_2 ? orderData.billing.address_2 : "")
          }</li>
          <li>Отримувач: ${orderData.shipping.last_name + " " + orderData.shipping.first_name + " " + orderData.shipping.company}</li>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
          Оплата
        </button>
      </h2>
      <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#orderAccordion" style="">
        <div class="accordion-body">
          <li>Знижка:
            <input type="number" id="discount_amount" min="0" step="0.01" value="0">
            <select id="discount_type">
              <option value="percentage">%</option>
              <option value="fixed">UAH</option>
            </select>
          </li>
          <li>Загальна сумма: ${orderData.total} ${orderData.currency}</li>
          <li>Вид оплати: ${orderData.payment_method_title}</li>
          <li>Оплачено:
            <select class="dropdown-list" id="if_Paid">
              <option value="true" ${orderData.date_paid ? 'selected' : ''}>Так</option>
              <option value="false" ${!orderData.date_paid ? 'selected' : ''}>Ні</option>
            </select>
          </li>
          <li>Дата оплати: ${orderData.date_paid}</li>
        </div>
      </div>
    </div>
  </div>
`;
$('#tab1').html(tab1Content);
}

function populateOrderTab2(orderData) {
const tab2Content = `
  <div class="container" id='note-cont' style="max-height: 300px; overflow-y: auto;">
    <table class="table" id='noteTable'>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
  <div class="form-group">
    <textarea class="form-control" id="managerNotes" rows="1" placeholder="Введіть вашу примітку"></textarea>
    <button type="button" class="btn btn-primary" id="createNoteBtn">Створити замітку</button>
  </div>
`;
$('#tab2').html(tab2Content);
loadnotes();
}

function populateOrderTab3(orderData) {
const tab3Content = `
  <div class="container" id='sms-cont' style="max-height: 300px; overflow-y: auto;">
    <table class="table" id='smsTable'>
      <thead>
        <tr>
          <th>Текст</th>
          <th>Статус</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
  <div class="form-group">
    <label>Номер телефона: ${orderData.billing.phone}</label>
  </div>
  <div class="form-group">
    <label for="messageText">Текст сообщения:</label>
    <textarea class="form-control" id="messageText" rows="1"></textarea>
  </div>
  <button type="button" class="btn btn-primary" id="sendSMSBtn">Відправити SMS</button>
`;
$('#tab3').html(tab3Content);
loadSMS(orderData);
}




let managers = [];

function loadManagers() {
  return fetch('/get_manager_list')
    .then(response => response.json())
    .then(data => {
      managers = data.map(managerString => JSON.parse(managerString));
    })
    .catch(error => {
      console.error('Ошибка при загрузке списка менеджеров:', error);
    });
}

$(document).ready(function() {
  
  loadCustomers();
  loadManagers();
  load_custom_status();

});

