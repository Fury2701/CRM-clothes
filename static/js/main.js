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

let selectedValue;
let orderData; // Объявляем переменную orderData в глобальной области видимости
let loadOrders_response;
let updated_Order_Data;

// Обработчик клика по кнопке "Створити замовлення"
$(document).on('click', '#create-offer', function() {
  $('#createOrderModal').modal('show');
});

let currentPageForCreate = 1;
let totalPagesForCreate = 1;
let isLoadingForCreate = false;
let selectedProductForCreate = null;
let searchBySkuForCreate = false;
let selectedProducts = []; // Массив для хранения выбранных товаров

function loadProductsForCreate(searchQuery = '') {
  if (isLoadingForCreate || currentPageForCreate > totalPagesForCreate) return;

  isLoadingForCreate = true;
  console.log('Загрузка товаров. Страница:', currentPageForCreate, 'Поисковый запрос:', searchQuery);

  let url = `/data_products?page=${currentPageForCreate}`;
  if (searchQuery) {
    url += searchBySkuForCreate ? `&sku=${encodeURIComponent(searchQuery)}` : `&name=${encodeURIComponent(searchQuery)}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Данные о товарах:', data);
      const optionsContainer = $('.options-container-create');
      
      if (currentPageForCreate === 1) {
        optionsContainer.empty();
      }

      if (data.products && Array.isArray(data.products)) {
        data.products.forEach(product => {
          const option = $('<div>', {
            class: 'option-create',
            'data-value': product.id,
            'data-price': product.price,
            html: `
              <img src="${product.images[0].src}" alt="${product.name}">
              <span>${product.name} (Артикул: ${product.sku})</span>
            `
          });
          optionsContainer.append(option);
        });
        currentPageForCreate++;
        totalPagesForCreate = data.total_pages;
      } else {
        console.error('Неверный формат данных:', data);
      }
      isLoadingForCreate = false;
    })
    .catch(error => {
      console.error('Помилка при завантаженні товарів:', error);
      isLoadingForCreate = false;
    });
}

$('#searchBySkuForCreate').on('change', function() {
  searchBySkuForCreate = $(this).is(':checked');
});

$('#productSearchCreate').on('keypress', function(event) {
  if (event.which === 13) {
    event.preventDefault();
    const searchQuery = $(this).val().trim();
    if (searchQuery !== '') {
      currentPageForCreate = 1;
      $('.options-container-create').empty();
      loadProductsForCreate(searchQuery);
    }
  }
});

$('.selected-option-create').on('click', function() {
  $('.options-container-create').toggle();
});

$(document).on('click', '.option-create', function() {
  const selectedText = $(this).find('span').text();
  const selectedValue = $(this).data('value');
  const selectedPrice = $(this).data('price');
  const selectedImage = $(this).find('img').attr('src');
  
  selectedProductForCreate = {
    id: selectedValue,
    name: selectedText,
    price: selectedPrice,
    image: selectedImage
  };

  // Добавляем выбранный товар в таблицу
  addProductToTable(selectedProductForCreate);

  $('.selected-option-create').text('Виберіть товар');
  $('.options-container-create').hide();
});

function addProductToTable(product) {
  const tableBody = document.querySelector('#selectedProductsTable tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
    <td>${product.name}</td>
    <td><input type="number" class="form-control product-quantity" value="1" min="1"></td>
    <td>${product.price}</td>
    <td><button class="btn btn-danger btn-sm remove-product">Видалити</button></td>
  `;
  tableBody.appendChild(row);

  // Добавляем товар в массив выбранных товаров
  selectedProducts.push({...product, quantity: 1});

  // Добавляем обработчик для кнопки удаления
  row.querySelector('.remove-product').addEventListener('click', function() {
    row.remove();
    selectedProducts = selectedProducts.filter(p => p.id !== product.id);
  });

  // Добавляем обработчик для изменения количества
  row.querySelector('.product-quantity').addEventListener('change', function() {
    const index = selectedProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      selectedProducts[index].quantity = parseFloat(this.value);
    }
  });
}

$('.options-container-create').on('scroll', function() {
  const container = $(this);
  if (container.scrollTop() + container.innerHeight() >= container[0].scrollHeight - 20) {
    loadProductsForCreate($('#productSearchCreate').val().trim());
  }
});

$('#createOrderModal').on('show.bs.modal', function() {
  selectedProducts = [];
  document.querySelector('#selectedProductsTable tbody').innerHTML = '';
  selectedProductForCreate = null;
  document.querySelector('.selected-option-create').textContent = 'Виберіть товар';
  
  currentPageForCreate = 1;
  $('.options-container-create').empty();
  loadProductsForCreate();
});

$(document).on('click', function(event) {
  if (!$(event.target).closest('.custom-select-create').length) {
    $('.options-container-create').hide();
  }
});

// Обработчик события закрытия модального окна
$('#createOrderModal').on('hidden.bs.modal', function () {
  // Очистка всех текстовых полей и полей ввода
  $('#createOrderModal input[type="text"], #createOrderModal input[type="email"], #createOrderModal input[type="tel"], #createOrderModal input[type="number"]').val('');
  
  // Сброс значений выпадающих списков
  $('#shippingMethod, #paymentMethod').val('');
  
  // Очистка таблицы выбранных товаров
  $('#selectedProductsTable tbody').empty();
  
  // Сброс выбранного товара
  $('.selected-option-create').text('Виберіть товар');
  
  // Очистка массива выбранных товаров
  selectedProducts = [];
  
  // Сброс чекбокса поиска по артикулу
  $('#searchBySkuForCreate').prop('checked', false);
  searchBySkuForCreate = false;
  
  // Очистка поля поиска товара
  $('#productSearchCreate').val('');
  
  // Сброс страниц загрузки товаров
  currentPageForCreate = 1;
  totalPagesForCreate = 1;
  
  // Очистка контейнера опций товаров
  $('.options-container-create').empty();
});


// Обработчик клика на кнопку "Створити замовлення"
$(document).on('click', '#createOrderBtn', function() {
  const customerFirstName = $('#customerFirstName').val();
  const customerLastName = $('#customerLastName').val();
  const customerMiddleName = $('#customerMiddleName').val();
  const customerPhone = $('#customerPhone').val();
  const customerEmail = $('#customerEmail').val();
  const shippingAddress = $('#shippingAddress').val();
  const shippingCity = $('#shippingCity').val();
  const shippingPostcode = $('#shippingPostcode').val();
  const shippingMethod = $('#shippingMethod').val();
  const paymentMethod = $('#paymentMethod').val();

  const lineItems = selectedProducts.map(product => ({
    product_id: parseInt(product.id),
    quantity: product.quantity,
  }));

  // Создайте объект с данными заказа
  const orderData = {
    customer: {
      first_name: customerFirstName,
      last_name: customerLastName,
      company: customerMiddleName,
      email: customerEmail,
      phone: customerPhone
    },
    billing: {
      first_name: customerFirstName,
      last_name: customerLastName,
      company: customerMiddleName,
      address_1: shippingAddress,
      city: shippingCity,
      postcode: shippingPostcode,
      phone: customerPhone,
      email: customerEmail
    },
    shipping: {
      first_name: customerFirstName,
      last_name: customerLastName,
      company: customerMiddleName,
      address_1: shippingAddress,
      city: shippingCity,
      postcode: shippingPostcode
    },
    line_items: lineItems,
    shipping_lines: [
      {
        method_id: shippingMethod,
        method_title: $('#shippingMethod option:selected').text()
      }
    ],
    payment_method: paymentMethod,
    payment_method_title: $('#paymentMethod option:selected').text()
  };

  // Отправьте данные заказа на сервер
  createOrder(orderData);
  console.log(orderData);
});

// Функция для отправки данных заказа на сервер
function createOrder(newOrder) {
  fetch('/create_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newOrder)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Помилка при створенні замовлення');
      }
      return response.json();
    })
    .then(data => {
      console.log('Замовлення успішно створено:', data);
      // Закрыть модальное окно
      $('#createOrderModal').modal('hide');
      // Обновить данные на странице после успешного создания заказа
      loadOrders();
    })
    .catch(error => {
      console.error('Помилка при створенні замовлення:', error);
    });
}


// Обработчик клика по кнопке "Видалити замовлення"
$(document).on('click', '#delete-order', function() {
  const orderId = $('#myModal').data('order-id');
  
  if (confirm('Ви дійсно хочете видалити замовлення?')) {
    deleteOrder(orderId);
  }
});

// Функция для отправки запроса на удаление заказа
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
      // Закрыть модальное окно
      $('#myModal').modal('hide');
      // Обновить данные на странице после успешного удаления заказа
      loadOrders();
    })
    .catch(error => {
      console.error('Помилка при видаленні замовлення:', error);
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




function updateOrder(orderId, updatedFields) {
  console.log('Updating order:', orderId, updatedFields);
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
      // Обновление данных на странице после успешного обновления заказа
      loadOrders();
    
    })
    .catch(error => {
      console.error('Ошибка при обновлении заказа:', error);
    });
}

// Добавляем слушатель событий на изменение select статуса заказа в таблице
$(document).on('change', '#table1 .status-cell .dropdown-list', function() {
  const orderId = $(this).closest('tr').attr('data-order-id');
  const newStatus = $(this).val();
  updateOrder(orderId, { status: newStatus });
});

function getUpdatedFields(orderId) {
  const newStatus = $('#myModal .dropdown-list').val();
  const isPaid = $('#if_Paid').val() === 'true';
  
  const updatedFields = {};

  if (newStatus !== orderData.status) {
    updatedFields.status = newStatus;
  }

  if (isPaid !== !!orderData.date_paid) {
    updatedFields.set_paid = isPaid;
  }
  
  const updatedLineItems = orderData.line_items.filter(item => item.quantity !== item.original_quantity);
  if (updatedLineItems.length > 0) {
    updatedFields.line_items = updatedLineItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      total:item.total
    }));
  }

  const selectedCustomStatuses = getSelectedOrderStatuses();
  // Удаляем дубликаты
  const uniqueStatuses = [...new Set(selectedCustomStatuses)];
  
  if (uniqueStatuses.length > 0) {
    updatedFields.meta_data = [
      {
        key: '_custom_statuses',
        value: uniqueStatuses
      }
    ];
  } else {
    // Если нет выбранных кастомных статусов, но они были ранее сохранены,
    // нужно явно указать пустой массив, чтобы удалить ранее сохраненные статусы
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
$(document).on('click', '#save-info', function() {
  const orderId = $('#myModal').data('order-id');
  
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
      $('#myModal').modal('hide');
      loadOrders();
    })
    .catch(error => {
      console.error('Помилка при оновленні знижки замовлення:', error);
    });
}

// Добавляем слушатель событий на клик по ссылке с номером заказа
$(document).on('click', '#table1 .modal-link-cell a', function(e) {
  e.preventDefault();
  const orderId = $(this).closest('tr').attr('data-order-id');
  $('#myModal').data('order-id', orderId);
  
  // Отправляем запрос на сервер для получения данных о заказе по его ID
  fetch(`/dataordersbyid?id=${orderId}`)
    .then(response => response.json())
    .then(data => {
      orderData = data;
      console.log(orderData);
      populateModal();
    })
    .catch(error => {
      console.error('Ошибка при получении данных о заказе:', error);
    });
});

function loadOrders(page = 1) {
  fetch(`/dataorders?page=${page}`)
    .then(response => response.json())
    .then(data => {
      loadOrders_response = data;
      // Очистить существующие строки в таблице
      $('#table1 tbody').empty();

      // Заполнить таблицу данными из ответа сервера
      fillOrdersTable(data.orders);

      // Обновить пагинацию
      updatePagination(data.current_page, data.total_pages);

      // Сбросить состояние уведомления
      alertShown = false;
    })
    .catch(error => {
      console.error('Ошибка при загрузке заказов:', error);
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

let currentSortFunction = loadOrders; // Переменная для хранения текущей функции загрузки заказов

// Обработчик клика по ссылке пагинации
$(document).on('click', '.pagination .page-link', function(e) {
  e.preventDefault();
  const page = $(this).data('page');
  currentSortFunction(page); // Вызов текущей функции загрузки заказов с передачей номера страницы
});

// Обработчик изменения состояния чекбокса "Від старіших"
$('#CheckOldest').change(function() {
  if ($(this).is(':checked')) {
    // Если галочка установлена, загружаем заказы от старых к новым
    currentSortFunction = loadOrdersOldToNew;
    loadOrdersOldToNew(1);
  } else {
    // Если галочка снята, загружаем заказы по умолчанию
    currentSortFunction = loadOrders;
    loadOrders(1);
  }
});

// Обработчик клика по опции сортировки по статусу
$(document).on('click', '.status-sort-select .dropdown-item', function(e) {
  e.preventDefault();
  const selectedStatus = $(this).data('status');
  
  // Устанавливаем функцию загрузки заказов по статусу
  currentSortFunction = function(page) {
    fetchOrdersByStatus(selectedStatus, page);
  };
  
  fetchOrdersByStatus(selectedStatus, 1);
});

// Обработчик клика по кнопке поиска
$('#searchButton').on('click', function() {
  const fullName = $('#searchInput').val().trim();
  if (fullName !== '') {
    // Устанавливаем функцию загрузки заказов с учетом поиска по имени
    currentSortFunction = function(page) {
      loadOrders(page, fullName);
    };
    loadOrders(1, fullName);
  } else {
    // Если поле поиска пустое, загружаем заказы по умолчанию
    currentSortFunction = loadOrders;
    loadOrders(1);
  }
});

// Обработчик изменения выбранного менеджера
$('#managerFilter').on('change', function() {
  const managerId = $(this).val();
  if (managerId) {
    // Устанавливаем функцию загрузки заказов по менеджеру
    currentSortFunction = function(page) {
      loadOrdersByManager(managerId, page);
    };
    loadOrdersByManager(managerId, 1);
  } else {
    // Если менеджер не выбран, загружаем заказы по умолчанию
    currentSortFunction = loadOrders;
    loadOrders(1);
  }
});

function getManagerList(){
  // Загрузить список менеджеров и добавить опции в дропдаун
  fetch('/get_manager_list')
    .then(response => response.json())
    .then(managers => {
      console.log("managers: ", managers);
    })
    .catch(error => {
      console.error('Ошибка при загрузке списка менеджеров:', error);
    });
}

function fillOrdersTable(orders) {
  orders.forEach(order => {
    const row = $('<tr>');

    // Проверяем наличие элементов 'line_items' и свойства 'image'
    const imageUrl = order.line_items && order.line_items[0] && order.line_items[0].image ? order.line_items[0].image.src : '';
    row.append($('<td>').html(`<img src="${imageUrl}" width="100" height="100">`));

    // Изменяем эту часть, добавляя количество товаров
    const itemCount = order.line_items ? order.line_items.length : 0;
    row.append($('<td>').addClass('modal-link-cell').html(`
      <a href="#" data-bs-toggle="modal" data-bs-target="#myModal">${order.id}</a>
      <br>
      ${order.date_created}
      <br>
      <span style="font-size: 0.9em; color: #666;">Товарів: ${itemCount} од.</span>
    `));

    row.append($('<td>').text(order.total + " " + order.currency));
    row.append($('<td>').html(`${order.billing.last_name + " " + order.billing.first_name + " " + order.billing.company}<br>${order.billing.phone}`));
    
    // Добавляем картинку в зависимости от статуса оплаты заказа
    const paidIcon = order.date_paid ? '<img src="/static/images/ok.png" width="16" height="16">' : '<img src="/static/images/ok.png" width="16" height="16">';
    row.append($('<td>').html(`${order.shipping_lines[0].method_title} ${paidIcon}<br>${order.payment_method_title}`));
    
    // Создать элемент select с заданным классом и установить значение по умолчанию
    const selectDropdown = $('<select>').addClass('dropdown-list');
    selectDropdown.append($('<option>').attr('value', 'pending').text('В очікуванні оплати'));
    selectDropdown.append($('<option>').attr('value', 'processing').text('В обробці'));
    selectDropdown.append($('<option>').attr('value', 'on-hold').text('На утриманні'));
    selectDropdown.append($('<option>').attr('value', 'completed').text('Завершений'));
    selectDropdown.append($('<option>').attr('value', 'cancelled').text('Скасований'));
    selectDropdown.append($('<option>').attr('value', 'refunded').text('Повернений'));
    selectDropdown.append($('<option>').attr('value', 'failed').text('Невдалий'));
    selectDropdown.append($('<option>').attr('value', 'trash').text('Корзина'));
    selectDropdown.val(order.status); // Установить значение статуса для текущего заказа

    // Создание элемента select для списка менеджеров
    const managerDropdown = $('<select>').addClass('manager-dropdown');

    // Добавление опций менеджеров в дропдаун
    managerDropdown.append($('<option>').attr('value', 'none').text('-'));
    managers.forEach(manager => {
      const option = $('<option>').attr('value', manager.id).text(manager.name);
      managerDropdown.append(option);
    });

    // Установка выбранной опции менеджера на основе метаданных заказа
    const savedManagerId = order.meta_data.find(meta => meta.key === '_manager_id')?.value;
    if (savedManagerId) {
      managerDropdown.val(savedManagerId);
    }
    // Создать контейнер для обоих дропдаунов
    const dropdownContainer = $('<div>').addClass('dropdown-container');
    dropdownContainer.append(selectDropdown);
    dropdownContainer.append(managerDropdown);
    
    row.append($('<td>').addClass('status-cell').html(dropdownContainer));

    // Добавьте data-атрибут с идентификатором заказа для дочернего ряда
    row.attr('data-order-id', order.id);

    $('#table1 tbody').append(row);

    // Здесь начинается новый код
    // Создайте дочерний ряд для кастомных тегов, информации о доставке и комментария заказчика
    const childRow = $('<tr>').addClass('child-row').attr('data-order-id', order.id);
    const childCell = $('<td>').attr('colspan', row.find('td').length);
    
    // Контейнер для кастомных тегов (оставьте существующий код)
    const customTagsContainer = $('<div>').addClass('custom-tags-container');
    
    order.meta_data.forEach(meta => {
      if (meta.key === '_custom_statuses') {
        meta.value.forEach(status => {
          const tagElement = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="toast-body">
                ${status}
              </div>
            </div>
          `;
          customTagsContainer.append(tagElement);
        });
      }
    });

    // Функция для формирования адреса доставки
    function formatShippingAddress(billing) {
      const addressParts = [
        billing.address_1,
        billing.address_2,
        billing.city,
        billing.state,
        billing.postcode,
        billing.country
      ].filter(Boolean); // Удаляем пустые значения

      return addressParts.join(', ');
    }

    // Формируем имя получателя
    const recipientName = [order.shipping.first_name, order.shipping.last_name, order.shipping.company]
      .filter(Boolean)
      .join(' ');

    // Формируем информацию о доставке
    let shippingInfoHTML = '<strong>Інформація про доставку:</strong><br>';
    
    if (order.shipping_lines && order.shipping_lines.length > 0) {
      shippingInfoHTML += `Метод: ${order.shipping_lines[0].method_title}<br>`;
    }
    
    const formattedAddress = formatShippingAddress(order.billing);
    if (formattedAddress) {
      shippingInfoHTML += `Адреса: ${formattedAddress}<br>`;
    }
    
    if (recipientName) {
      shippingInfoHTML += `Отримувач: ${recipientName}<br>`;
    }
    
    if (order.shipping.phone) {
      shippingInfoHTML += `Телефон: ${order.shipping.phone}`;
    }

    // Если нет никакой информации о доставке, выводим сообщение
    if (shippingInfoHTML === '<strong>Інформація про доставку:</strong><br>') {
      shippingInfoHTML += 'Інформація про доставку відсутня';
    }

    // Добавляем информацию о доставке
    const shippingInfo = $('<div>').addClass('shipping-info').html(shippingInfoHTML);

    // Добавляем комментарий заказчика
    const customerNote = $('<div>').addClass('customer-note').html(`
      <strong>Коментар замовника:</strong><br>
      ${order.customer_note ? order.customer_note : 'Немає коментаря'}
    `);

    childCell.append(customTagsContainer, shippingInfo, customerNote);
    childRow.append(childCell);
    
    // Добавьте дочерний ряд после основного ряда заказа
    row.after(childRow);
  });
}

$(document).on('change', '#table1 .status-cell .manager-dropdown', function() {
  const orderId = $(this).closest('tr').attr('data-order-id');
  const selectedManagerId = $(this).val();
  updateOrder(orderId, {
    meta_data: [
      {
        key: '_manager_id',
        value: selectedManagerId
      }
    ]
  });
});

$(document).on('change', '#table1 .status-cell .manager-dropdown', function() {
  const orderId = $(this).closest('tr').attr('data-order-id');
  const selectedManagerId = $(this).val();
  console.log('Selected manager ID:', selectedManagerId);
  console.log('Order ID:', orderId);
  
  // Отправляем запрос на сервер для получения данных о заказе по его ID
  fetch(`/dataordersbyid?id=${orderId}`)
    .then(response => response.json())
    .then(orderData => {
      console.log('Order data:', orderData);
      
      // Ищем значение manager_id в метаданных заказа
      const managerMeta = orderData.meta_data.find(meta => meta.key === '_manager_id');
      const previousManagerId = managerMeta ? managerMeta.value : undefined;
      console.log('Previous manager ID:', previousManagerId);
      
      if (!previousManagerId) {
        console.log('No previous manager assigned');
        // Если ранее менеджер не был назначен, отправляем запрос по маршруту add_manager_order_info
        fetch('/add_manager_order_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: selectedManagerId,
            order_id: orderId
          })
        })
          .then(response => {
            console.log("Adding manager is done");
            if (!response.ok) {
              throw new Error('Ошибка при добавлении информации о менеджере к заказу');
            }
            return response.json();
          })
          .then(data => {
            console.log('Информация о менеджере успешно добавлена к заказу:', data);
          })
          .catch(error => {
            console.error('Ошибка при добавлении информации о менеджере к заказу:', error);
          });
      } else {
        console.log('Previous manager assigned');
        // Если ранее менеджер был назначен, отправляем запрос по маршруту update_manager_order_info
        fetch('/update_manager_order_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: selectedManagerId,
            order_id: orderId
          })
        })
          .then(response => {
            console.log('Updating manager is done');
            if (!response.ok) {
              throw new Error('Ошибка при обновлении информации о менеджере заказа');
            }
            return response.json();
          })
          .then(data => {
            console.log('Информация о менеджере заказа успешно обновлена:', data);
          })
          .catch(error => {
            console.error('Ошибка при обновлении информации о менеджере заказа:', error);
          });
      }
    })
    .catch(error => {
      console.error('Ошибка при получении данных о заказе:', error);
    });
});

$(document).on('click', '#table1 tbody tr:not(.child-row)', function(event) {
  if (!$(event.target).closest('.status-cell, .modal-link-cell').length) {
    const orderId = $(this).attr('data-order-id');
    const childRow = $(this).next('.child-row[data-order-id="' + orderId + '"]');
    childRow.toggle();
  }
});

function loadSMS() {
  const phoneNumber = orderData.billing.phone;
  fetch(`/get_all_sms?number=${phoneNumber}`)
    .then(response => response.json())
    .then(data => {
      
      console.log(data);
      // Очищаем тело таблицы перед заполнением
      $('#smsTable tbody').empty();

      if (data.sms_data && data.sms_data.length > 0) {
        // Если есть SMS, заполняем таблицу
        

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
        // Если SMS нет, выводим сообщение
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
      // Обновляем таблицу SMS после успешного обновления статуса
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

// Обработчик клика по кнопке "Відправити SMS"
$(document).on('click', '#sendSMSBtn', function() {
  const orderId = $('#myModal').data('order-id');
  const phoneNumber = orderData.billing.phone;
  const messageText = $('#messageText').val();

  // Проверка введенных данных
  if (phoneNumber && messageText) {
    // Создание объекта с данными SMS
    const smsData = {
      phone_number: phoneNumber,
      message_text: messageText
    };

    // Вызов функции для отправки SMS
    sendSMS(orderId, smsData);
  }
});

// Функция для отправки SMS
function sendSMS(orderId, smsData) {
  const requested_data = {
    id: orderId,
    message_type:"sms",
    phone_number: smsData.phone_number,
    message_text: smsData.message_text
  };
  console.log(requested_data);
  fetch('/send_phone_sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requested_data)
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
      // Очистка поля ввода после успешной отправки SMS
      $('#messageText').val('');
      // Обновление списка сообщений после успешной отправки SMS
      loadSMS();
    })
    .catch(error => {
      console.error('Помилка при відправці SMS:', error);
    });
}

function loadnotes() {
  const orderId = $('#myModal').data('order-id');
  fetch(`/notes?id=${orderId}&page=1`)
    .then(response => response.json())
    .then(data => {
      

      // Очищаем тело таблицы перед заполнением
      $('#noteTable tbody').empty();

      if (data.length > 0) {
        // Если есть заметки, заполняем таблицу заметками

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
        // Если заметок нет, выводим сообщение
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
    const orderId = $('#myModal').data('order-id');
    const noteText = $('#managerNotes').val();
  
    if (noteText.trim() !== '') {
      createNote(orderId, noteText);
      $('#managerNotes').val(''); // Очистка поля ввода после создания заметки
    }
  });
  
  // Функция для отправки данных заметки на сервер
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
        // Обновление списка заметок после успешного создания новой заметки
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
  // Функция для отправки запроса на удаление заметки
function deleteNote(noteId) {
  const orderId = $('#myModal').data('order-id');

  fetch(`/delete_note?id=${orderId}&note_id=${noteId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Помилка при видаленні замітки');
      }
      return response.json();
    })
    .then(data => {
      console.log('Замітка успішно видалена:', data);
      // Обновление списка заметок после успешного удаления заметки
      loadnotes();
    })
    .catch(error => {
      console.error('Помилка при видаленні замітки:', error);
    });
}

// Обработчик клика по кнопке "Додати товар"
$(document).on('click', '#addProductBtn', function() {
  // Открытие дочернего модального окна
  $('#addProductModal').modal('show');
  let currentPageForAddProduct = 1;
  let totalPagesForAddProduct = 1;
  let isLoadingForAddProduct = false;
  let searchBySkuForAddProduct = false;
  
  // Функция для загрузки товаров и создания опций
  function loadProductsForAddProduct(searchQuery = '') {
    if (isLoadingForAddProduct || currentPageForAddProduct > totalPagesForAddProduct) {
      console.log('Загрузка товаров уже выполняется или достигнута последняя страница');
      return;
    }
  
    isLoadingForAddProduct = true;
    console.log('Загрузка товаров, страница:', currentPageForAddProduct);
  
    let url = `/data_products?page=${currentPageForAddProduct}`;
    if (searchQuery) {
      url += searchBySkuForAddProduct ? `&sku=${encodeURIComponent(searchQuery)}` : `&name=${encodeURIComponent(searchQuery)}`;
    }
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const products = data.products;
        currentPageForAddProduct = data.current_page + 1;
        totalPagesForAddProduct = data.total_pages;
  
        console.log('Получены товары:', products);
        console.log('Текущая страница:', currentPageForAddProduct);
        console.log('Всего страниц:', totalPagesForAddProduct);
  
        const optionsContainer = document.querySelector('#addProductModal .options-container');
        products.forEach(function(product) {
          const option = document.createElement('div');
          option.className = 'option';
          option.dataset.value = product.id;
  
          const imageSrc = product.images && product.images.length > 0 ? product.images[0].src : '';
          option.innerHTML = `<img src="${imageSrc}"> ${product.name} (Артикул: ${product.sku})`;
  
          optionsContainer.appendChild(option);
        });
  
        isLoadingForAddProduct = false;
      })
      .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
        isLoadingForAddProduct = false;
      });
  }
  
  // Обработчик изменения чекбокса поиска по артикулу
  $('#searchBySkuForAddProduct').on('change', function() {
    searchBySkuForAddProduct = $(this).is(':checked');
  });
  
  $('#productSearch').on('keypress', function(event) {
    if (event.which === 13) {
      const searchQuery = $(this).val().trim();
      currentPageForAddProduct = 1;
      $('#addProductModal .options-container').empty();
      loadProductsForAddProduct(searchQuery);
    }
  });
  
  // Обработчик события прокрутки для контейнера опций
  $('#addProductModal .options-container').on('scroll', function() {
    const optionsContainer = this;
    if (optionsContainer.scrollTop + optionsContainer.clientHeight >= optionsContainer.scrollHeight - 20) {
      console.log('Достигнут конец списка опций, загружаем следующую страницу');
      loadProductsForAddProduct($('#productSearch').val().trim());
    }
  });
  
  $('#addProductModal').on('shown.bs.modal', function() {
    console.log('Дочернее модальное окно открыто');
    currentPageForAddProduct = 1;
    totalPagesForAddProduct = 1;
    $('#addProductModal .options-container').empty();
    loadProductsForAddProduct();
  });

  
  // Обработчик клика на выбранную опцию
  $('#addProductModal .selected-option').on('click', function() {
    $('#addProductModal .options-container').toggle();
  });
  
  // Обработчик клика на опцию
  $('#addProductModal .options-container').on('click', '.option', function() {
    selectedValue = $(this).data('value');
    const selectedText = $(this).text();
    $('#addProductModal .selected-option').text(selectedText);
    $('#addProductModal .options-container').hide();
    console.log('Выбранный товар:', selectedValue);
  });
  
  // Обработчик клика вне выпадающего списка
  $(document).on('click', function(event) {
    if (!$(event.target).closest('#addProductModal .custom-select').length) {
      $('#addProductModal .options-container').hide();
    }
  });

});

// Обработчик клика по кнопке "Зберегти" в дочернем модальном окне
$(document).on('click', '#saveProductBtn', function() {
  const orderId = $('#myModal').data('order-id');
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
    
    // Оборачиваем updateOrder в Promise
    new Promise((resolve, reject) => {
      updateOrder(orderId, updatedFields);
      // Предполагаем, что updateOrder выполняется синхронно
      // Если это асинхронная функция с колбэком, нужно будет изменить эту часть
      resolve();
    })
    .then(() => {
      // Отправляем запрос на сервер для получения данных о заказе по его ID
      return fetch(`/dataordersbyid?id=${orderId}`);
    })
    .then(response => response.json())
    .then(data => {
      orderData = data;
      console.log(orderData);
      populateModal();
    })
    .catch(error => {
      console.error('Ошибка при обновлении или получении данных о заказе:', error);
    })
    .finally(() => {
      $('#addProductModal').modal('hide');
    });
  }
});





// Функция для загрузки заказов, отсортированных от старых к новым
function loadOrdersOldToNew(page = 1) {
  fetch(`/dataordersoldtonew?page=${page}`)
    .then(response => response.json())
    .then(data => {
      // Очищаем существующие строки в таблице
      $('#table1 tbody').empty();

      fillOrdersTable(data.orders);
      updatePagination(data.current_page, data.total_pages);
    })
    .catch(error => {
      console.error('Ошибка при загрузке заказов:', error);
    });
}


function fetchOrdersByStatus(status, page = 1) {
  const url = `/dataordersstatus?status=${status}&page=${page}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при получении заказов');
      }
      return response.json();
    })
    .then(data => {
      const orders = data.orders;
      const currentPage = data.current_page;
      const totalPages = data.total_pages;

      // Очистка таблицы и отображение отсортированных заказов
      $('#table1 tbody').empty();
      fillOrdersTable(orders);
      updatePagination(currentPage, totalPages);
    })
    .catch(error => {
      console.error('Ошибка при получении заказов:', error);
    });
}

function updateOrderData(loadOrders_response, orderId, updatedOrder) {
  return loadOrders_response.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        ...updatedOrder
      };
    }
    return order;
  });
}       

function populateModal(){
   // Заполняем модальное окно данными о заказе
   $('#myModal .modal-body').html(`
   <ul class="nav nav-tabs" id="myTab" role="tablist">
     <li class="nav-item" role="presentation">
       <button class="nav-link active" id="tab1-tab" data-bs-toggle="tab" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">Інформація про замовлення</button>
     </li>
     <li class="nav-item" role="presentation">
       <button class="nav-link" id="tab2-tab" data-bs-toggle="tab" data-bs-target="#tab2" type="button" role="tab" aria-controls="tab2" aria-selected="false">Примітки</button>
     </li>
     <li class="nav-item" role="presentation">
       <button class="nav-link" id="tab3-tab" data-bs-toggle="tab" data-bs-target="#tab3" type="button" role="tab" aria-controls="tab3" aria-selected="false">Повідомлення</button>
     </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="viber-tab" data-bs-toggle="tab" data-bs-target="#viber" type="button" role="tab" aria-controls="viber" aria-selected="false">Viber</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="email-tab" data-bs-toggle="tab" data-bs-target="#email" type="button" role="tab" aria-controls="email" aria-selected="false">Email</button>
    </li>
   </ul>

   <div class="tab-content" id="myTabContent">
     <div class="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
       <div class="accordion" id="accordionExample">
         <div class="accordion-item">
           <h2 class="accordion-header">
             <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
               Основна інформація про замовлення
             </button>
           </h2>
           <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style="">
             <div class="accordion-body">
               <div class="forInModalTable">
                 <table class="table" id="inModalTable">
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
                  <div class="dropdown">
                  <button class="add-tag-btn dropdown-toggle" type="button" id="addCustomStatusBtn" data-bs-toggle="dropdown" aria-expanded="false">
                    +
                  </button>
                  <div class="dropdown-menu">
                    <div class="dropdown-item">
                      <input type="text" class="form-control" id="newCustomStatusInput" placeholder="Новий статус">
                    </div>
                    <div class="dropdown-divider"></div>
                    <div id="customStatusList">
                      <!-- Список кастомных статусов будет динамически заполнен -->
                    </div>
                  </div>
                </div>
                <div class="client-tags">
                  <!-- Теги будут добавляться сюда -->
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
                   <option value="trash" ${orderData.status === 'trash' ? 'selected' : ''}>Корзина</option>
                 </select>
               </li>
               <li>Коментар до замовлення від покупця: ${orderData.customer_note}</li>
             </div>
           </div>
         </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Інформація про кієнта
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style="">
              <div class="accordion-body" id="customerInfoContent">
                <!-- Здесь будет динамически вставлена информация о клиенте -->
              </div>
            </div>
          </div>
         <div class="accordion-item">
         <h2 class="accordion-header">
           <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
             Доставка
           </button>
         </h2>
         <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style="">
           <div class="accordion-body">
             <li>Метод доставки: ${orderData.shipping_lines[0].method_title}</li>
            <li>Адреса доставки: ${
              (orderData.billing.state ? orderData.billing.state + "обл, " : "") +
              (orderData.billing.city ? "м." + orderData.billing.city + " (" : "") +
              (orderData.billing.postcode ? orderData.billing.postcode + "), " : "") +
              (orderData.billing.address_1 ? orderData.billing.address_1 + " ," : "") +
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
           <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style="">
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
     </div>
     <div class="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
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
     </div>
     <div class="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-tab">
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
</div>
    <div class="tab-pane fade" id="viber" role="tabpanel" aria-labelledby="viber-tab">
    <div class="container" id='sms-cont' style="max-height: 300px; overflow-y: auto;">
        <table class="table" id='ViberTable'>
          <thead>
            <tr>
              <th>Текст</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
    </div>
    <div class="mb-3">
      <label for="viberPhone" class="form-label">Номер телефона для Viber</label>
      <input type="tel" class="form-control bg-light" id="viberPhone" readonly>
    </div>
    <div class="mb-3">
      <label for="viberMessage" class="form-label">Повідомлення Viber</label>
      <textarea class="form-control" id="viberMessage" rows="3"></textarea>
    </div>
    <button type="button" class="btn btn-primary" id="sendViberBtn">Відправити Viber</button>
  </div>
  <div class="tab-pane fade" id="email" role="tabpanel" aria-labelledby="email-tab">
      <div class="container" id='email-cont' style="max-height: 300px; overflow-y: auto;">
      <table class="table" id='emailTable'>
        <thead>
          <tr>
            <th style="width: 30%;">Статус</th>
            <th style="width: 70%;">Текст</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
    <div class="mb-3">
      <label for="emailAddress" class="form-label">Email адрес</label>
      <input type="email" class="form-control" id="emailAddress">
    </div>
    <div class="mb-3">
      <label for="emailSubject" class="form-label">Тема листа</label>
      <input type="text" class="form-control" id="emailSubject">
    </div>
    <div class="mb-3">
      <label for="emailMessage" class="form-label">Текст листа</label>
      <textarea class="form-control" id="emailMessage" rows="3"></textarea>
    </div>
    <button type="button" class="btn btn-primary" id="sendEmailBtn">Відправити Email</button>
  </div>
   </div>
   
 `);
 
 $('#viberPhone').val(orderData.billing.phone);
 $('#emailAddress').val(orderData.billing.email);
 
// Загрузка статистики клиента
fetch(`/customer/${orderData.customer_id}`)
  .then(response => response.json())
  .then(data => {
    if(orderData.customer_id>0){
    $('#orderOrderCount').text(data.order_count);
    $('#ordertotalAmount').text(data.total_amount.toFixed(2));
  }
  else{
    $('#orderOrderCount').text("Немає замовлень ");
    $('#ordertotalAmount').text("0");
  }
  })
  .catch(error => {
    console.error('Ошибка при получении статистики клиента:', error);
  });




 let customerInfoHtml = `
 <li>Замовник: ${orderData.customer_id === 0 ? 
   `${orderData.billing.last_name} ${orderData.billing.first_name} ${orderData.billing.company}` : 
   `<a href="#" class="customer-link" data-customer-id="${orderData.customer_id}">${orderData.billing.last_name} ${orderData.billing.first_name} ${orderData.billing.company}</a>`}
`;




const productIds = orderData.line_items.map(item => item.product_id);

fetch('/productbyid_extend', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ ids: productIds }),
})
.then(response => response.json())
.then(productsInfo => {
  const productsMap = new Map(productsInfo.map(p => [p.id, p]));

  const tableBody = document.querySelector('#inModalTable tbody');
  tableBody.innerHTML = '';

  orderData.line_items.forEach((item, index) => {
    const product = productsMap.get(item.product_id);
    let remainingInfo;

    if (product && product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity !== "") {
      const remaining = product.stock_quantity - item.quantity;
      remainingInfo = `Залишок: ${remaining} м.`;
    } else {
      remainingInfo = "Немає інформації про залишок";
    }

    const row = `
      <tr>
        <td>
          <img src="${item.image.src}" width="75" height="75">
        </td>
        <td>${item.name}</td>
        <td>
          <input type="text" class="table-input" value="${item.quantity}" step="any">
          <br>
          <span style="font-size: 0.8em; color: #666;">${remainingInfo}</span>
        </td>
        <td>
          ${item.price}
        </td>
        <td>
          ${item.total}
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
})
.catch(error => {
  console.error('Error fetching product information:', error);
});

if (orderData.customer_id !== 0) {
 fetch(`/customerbyid?id=${orderData.customer_id}`)
   .then(response => response.json())
   .then(customerData => {
     const customer = JSON.parse(customerData);
     const customStatuses = customer.meta_data.find(meta => meta.key === '_custom_statuses');
     
     let addedStatuses = new Set();
     let statusesHtml = '';

     if (customStatuses && Array.isArray(customStatuses.value)) {
       customStatuses.value.forEach(status => {
         if (!addedStatuses.has(status)) {
           statusesHtml += `<span class="badge bg-secondary">${status}</span> `;
           addedStatuses.add(status);
         }
       });
     }

     if (statusesHtml) {
       customerInfoHtml += `
         <div class="customer-tags" style="display: inline-block; margin-left: 10px;">
           ${statusesHtml}
         </div>
       `;
     }
     
     customerInfoHtml += `</li>`;
     
     // Обновляем содержимое элемента с информацией о клиенте
     const customerInfoElement = document.querySelector('#customerInfoContent');
     customerInfoElement.innerHTML = `
       ${customerInfoHtml}
        <li>Кількість замовлень: <span id="orderOrderCount"></span></li>
        <li>Загальна сума замовлень: <span id="ordertotalAmount"></span> грн</li>
       <li>Номер телефону: ${orderData.billing.phone}</li>
       <li>Email: ${orderData.billing.email}</li>

     `;
   })
   .catch(error => {
     console.error('Ошибка при получении данных о клиенте:', error);
     finishCustomerInfoHtml();
   });
} else {
 finishCustomerInfoHtml();
}

function finishCustomerInfoHtml() {
 customerInfoHtml += `</li>`;
 const customerInfoElement = document.querySelector('#customerInfoContent');
 customerInfoElement.innerHTML = `
   ${customerInfoHtml}
  
  <li>Кількість замовлень: <span id="orderOrderCount"></span></li>
  <li>Загальна сума замовлень: <span id="ordertotalAmount"></span> грн</li>
   <li>Номер телефону: ${orderData.billing.phone}</li>
   <li>Email: ${orderData.billing.email}</li>
 `;

 $('#myModal .client-tags').empty();
const customStatuses = orderData.meta_data.find(meta => meta.key === '_custom_statuses');
if (customStatuses && Array.isArray(customStatuses.value)) {
  customStatuses.value.forEach(status => {
    createOrderTag(status);
  });
}
}

$('#myModal .client-tags').empty();
const customStatuses = orderData.meta_data.find(meta => meta.key === '_custom_statuses');
if (customStatuses && Array.isArray(customStatuses.value)) {
  customStatuses.value.forEach(status => {
    createOrderTag(status);
  });
}

// Сохраняем исходное количество товаров
orderData.line_items.forEach(item => {
  item.original_quantity = parseFloat(item.quantity);
});
 // Обновляем заголовок модального окна
 $('#myModal .modal-title').text(`Замовлення № ${orderData.id}`);
loadViberSMS();
loadEmails();
loadnotes();
loadSMS();
load_custom_status();
displayCustomStatuses();
}

$(document).on('keypress', '#myModal #newCustomStatusInput', function(event) {
  if (event.which === 13) {
    const newCustomStatus = $(this).val().trim();
    if (newCustomStatus !== '' && !orderStatusExists(newCustomStatus)) {
      createOrderTag(newCustomStatus);
      $(this).val('');

      // Создаем новый кастомный статус
      createCustomStatus('custom_statuses:' + newCustomStatus, newCustomStatus);

      // Загружаем обновленный список кастомных статусов
      load_custom_status();
    }
  }
});

function orderStatusExists(status) {
  return $('#myModal .client-tags .toast-body').filter(function() {
    return $(this).text().trim() === status;
  }).length > 0;
}

$(document).on('click', '.client-tags .btn-close', function() {
  $(this).closest('.toast').remove();
});

$(document).on('click', '#myModal .client-tags .btn-close', function() {
  $(this).closest('.toast').remove();
});

function createOrderTag(text) {
  const existingTag = $('#myModal .client-tags .toast-body').filter(function() {
    return $(this).text().trim() === text.trim();
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
    $('#myModal .client-tags').prepend(tagElement);
  }
}

function createCustomerTag(text) {
  const existingTag = $('#clientModal .client-tags .toast-body').filter(function() {
    return $(this).text().trim() === text.trim();
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
    $('#clientModal .client-tags').prepend(tagElement);
  }
}

// Для заказов
$(document).on('click', '#myModal #customStatusList .dropdown-item', function(event) {
  event.stopPropagation();
  const selectedText = $(this).text().trim();
  if (selectedText) {
    createOrderTag(selectedText);
  }
});

// Для клиентов
$(document).on('click', '#clientModal #customStatusList .dropdown-item', function(event) {
  event.stopPropagation();
  const selectedText = $(this).text().trim();
  if (selectedText) {
    createCustomerTag(selectedText);
  }
});

function getSelectedOrderStatuses() {
  const selectedStatuses = [];
  $('#myModal .client-tags .toast').each(function() {
    selectedStatuses.push($(this).find('.toast-body').text().trim());
  });
  return selectedStatuses;
}

function getSelectedCustomerStatuses() {
  const selectedStatuses = [];
  $('#clientModal .client-tags .toast').each(function() {
    selectedStatuses.push($(this).find('.toast-body').text().trim());
  });
  return selectedStatuses;
}

function displayOrderCustomStatuses(customStatuses) {
  const customStatusList = $('#myModal #customStatusList');
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

// Функция для отображения кастомных статусов в дропдауне
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
      // Перезагрузка списка кастомных статусов после удаления
      load_custom_status();
    })
    .catch(error => {
      console.error('Помилка при видаленні кастомного статусу:', error);
    });
}


function load_custom_status() {
  fetch(`/custom_status_list`)
    .then(response => response.json())
    .then(data => {
      const customStatuses = data;
      displayCustomStatuses(customStatuses);
      displayOrderCustomStatuses(customStatuses);
    })
    .catch(error => {
      console.error('Ошибка при загрузке кастомных статусов:', error);
    });
}

// Функция для создания кастомного статуса
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
      // Загрузка обновленного списка кастомных статусов после успешного создания нового статуса
      load_custom_status();
    })
    .catch(error => {
      console.error('Помилка при створенні кастомного статусу:', error);
    });
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
  $('#searchButton').on('click', function() {
    const fullName = $('#searchInput').val().trim();
    if (fullName !== '') {
      loadOrders(1, fullName);
    } else {
      loadOrders(1);
    }
  });

  $('#searchInput').on('keypress', function(event) {
    if (event.which === 13) {
      event.preventDefault();
      $('#searchButton').click();
    }
  });
});

function loadOrders(page = 1, fullName = '') {
  const url = `/dataorders?page=${page}${fullName ? '&full_name=' + encodeURIComponent(fullName) : ''}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Очистить существующие строки в таблице
      $('#table1 tbody').empty();

      // Заполнить таблицу данными из ответа сервера
      fillOrdersTable(data.orders);

      // Обновить пагинацию
      updatePagination(data.current_page, data.total_pages);
    })
    .catch(error => {
      console.error('Ошибка при загрузке заказов:', error);
    });
}

function loadManagerList() {
  fetch('/get_manager_list')
    .then(response => response.json())
    .then(managerStrings => {
      const managerSelect = document.getElementById('managerFilter');
      const managers = managerStrings.map(managerString => JSON.parse(managerString));
      managers.forEach(manager => {
        const option = document.createElement('option');
        option.value = manager.id;
        option.text = manager.name;
        managerSelect.add(option);
      });
    })
    .catch(error => {
      console.error('Ошибка при загрузке списка менеджеров:', error);
    });
}



function loadOrdersByManager(managerId, page = 1) {
  fetch(`/get_orders_by_manager?page=${page}&manager_id=${managerId}`)
    .then(response => response.json())
    .then(data => {
      console.log('Received data:', data);
      // Очистить существующие строки в таблице
      $('#table1 tbody').empty();

      // Проверяем наличие массива orders в ответе и его тип
      if (data && data.orders && Array.isArray(data.orders)) {
        console.log('Orders data:', data.orders);
        // Заполнить таблицу данными из ответа сервера
        fillOrdersTable(data.orders);
        updatePagination(data.current_page, data.total_pages);
      } else {
        console.error('Ошибка: Некорректный формат ответа сервера.');
      }
    })
    .catch(error => {
      console.error('Ошибка при загрузке заказов:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const offerListImgButton = document.querySelector('.offer-list-img');

  offerListImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/product" с параметром "page=1"
    window.location.href = '/product?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.clients-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/customer?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.menu-list .clients-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/customer?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListButton = document.querySelector('.menu-list #href-clients');

  customerListButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/customer?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const offerListImgButton = document.querySelector('.menu-list .offer-list-img');

  offerListImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/product?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const offerListButton = document.querySelector('.menu-list #href-offer-list');

  offerListButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/product?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const deliveryButton = document.querySelector('#export');

  deliveryButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/delivery?page=1';
  });
});

// Обработчик клика по кнопке "Друк"
$(document).on('click', '#printButton', function() {
  const orderId = $('#myModal').data('order-id');
  
  // Отправляем GET-запрос на сервер по маршруту "/print" с параметром "id"
  fetch(`/print?id=${orderId}`)
    .then(response => {
      if (response.ok) {
        // Если ответ успешный, переходим на страницу "print.html"
        window.location.href = `/print?id=${orderId}`;
      } else {
        response.json().then(data => {
          console.error('Ошибка при отправке запроса на печать:', data.error);
        });
      }
    })
    .catch(error => {
      console.error('Ошибка при отправке запроса на печать:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const analyticsImgButton = document.querySelector('.analytics-img');
  const herfAnalyticsButton = document.querySelector('.herf-analytics');

  analyticsImgButton.addEventListener('click', function(e) {
    e.preventDefault();
    fetchAnalyticsData();
  });

  herfAnalyticsButton.addEventListener('click', function(e) {
    e.preventDefault();
    fetchAnalyticsData();
  });

  function fetchAnalyticsData() {
    fetch('/analytics')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching analytics data');
        }
        return response.text();
      })
      .then(html => {
        // Создаем временный элемент для парсинга HTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // Извлекаем данные sales_report и top_sellers из HTML
        const salesReportElement = tempElement.querySelector('#sales-report');
        const topSellersElement = tempElement.querySelector('#top-sellers');

        const salesReportData = JSON.parse(salesReportElement.textContent);
        const topSellersData = JSON.parse(topSellersElement.textContent);

        console.log('Sales Report:', salesReportData);
        console.log('Top Sellers:', topSellersData);

        // Перенаправляем пользователя на страницу аналитики
        window.location.href = '/analytics';
      })
      .catch(error => {
        console.error('Error fetching analytics data:', error);
      });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.user-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/user_page';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.menu-list .user-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/user_page';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListButton = document.querySelector('.menu-list .href-user');

  customerListButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/user_page';
  });
});


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

      // Загрузка кастомных статусов клиента
      $('#clientModal .client-tags').empty();
      const customStatuses = customer.meta_data.find(meta => meta.key === '_custom_statuses');
      if (customStatuses && Array.isArray(customStatuses.value)) {
        customStatuses.value.forEach(status => {
          createCustomerTag(status);
        });
      }
      // Загрузка статистики клиента
      fetch(`/customer/${customer.id}`)
        .then(response => response.json())
        .then(data => {
          $('#orderCount').text(data.order_count);
          $('#totalAmount').text(data.total_amount.toFixed(2));
        })
        .catch(error => {
          console.error('Ошибка при получении статистики клиента:', error);
        });
      
      loadClientOrders(customerId);
      
      $('#clientModal').modal('show');
    })
    .catch(error => {
      console.error('Ошибка при получении данных о клиенте:', error);
    });
}

  // Обработчик события клика на имя клиента
  $(document).on('click', '.customer-link', function(event) {
    event.preventDefault();
    const customerId = $(this).data('customer-id');
    openCustomerModal(customerId);
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
      orderLink.dataset.bsTarget = '#myModal';
  
      // Добавляем обработчик клика к ссылке заказа
      orderLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Клик на ссылку заказа');
        const orderId = this.dataset.orderId;
        console.log('Order ID:', orderId);
        $('#clientModal').modal('hide');
        
        fetch(`/dataordersbyid?id=${orderId}`)
          .then(response => response.json())
          .then(data => {
            orderData = data;
            console.log(orderData);
            populateModal();
            $('#myModal').modal('show');
          })
          .catch(error => {
            console.error('Ошибка при получении данных о заказе:', error);
          });
      });
  
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

      function updateCustomer(customerId, data) {
        const selectedCustomStatuses = getSelectedCustomerStatuses();
        
        if (!data.meta_data) {
          data.meta_data = [];
        }
        data.meta_data.push({
          key: '_custom_statuses',
          value: selectedCustomStatuses
        });
      
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
          $('#clientModal').modal('hide');
          loadCustomers(currentPage);
        })
        .catch(error => {
          console.error('Ошибка при обновлении клиента:', error);
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
      
      // Обработчик клика по ссылке пагинации для заказов клиента
      $(document).on('click', '#clientOrdersPaginationContainer .page-link', function(e) {
      e.preventDefault();
      const page = $(this).data('page');
      const customerId = $('#clientModalLabel').data('customer-id');
      loadClientOrders(customerId, page);
      });

      let alertShown = false;

      function checkNewOrders() {
        if (!alertShown) {
          fetch('/check_orders')
            .then(response => response.json())
            .then(data => {
              const orderAlert = document.getElementById('order-alert');
              if (data.new_orders_exist && !alertShown) {
                orderAlert.style.display = 'flex';
                alertShown = true;
              }
            })
            .catch(error => {
              console.error('Ошибка при проверке новых заказов:', error);
            });
        }
      }
      
      document.addEventListener('DOMContentLoaded', function() {
        checkNewOrders();
        setInterval(checkNewOrders, 60000);
      
        const closeBtn = document.querySelector('.order-alert .close-btn');
        closeBtn.addEventListener('click', function() {
          document.getElementById('order-alert').style.display = 'none';
          alertShown = false;
        });
      });
      let currentPageForCopy = 1;
      let totalPagesForCopy = 1;
      let isLoadingForCopy = false;
      let selectedProductForCopy = null;
      let searchBySkuForCopy = false;
      
      function loadProductsForCopy(searchQuery = '') {
        if (isLoadingForCopy || currentPageForCopy > totalPagesForCopy) return;
      
        isLoadingForCopy = true;
        console.log('Загрузка товаров. Страница:', currentPageForCopy, 'Поисковый запрос:', searchQuery);
      
        let url = `/data_products?page=${currentPageForCopy}`;
        if (searchQuery) {
          url += searchBySkuForCopy ? `&sku=${encodeURIComponent(searchQuery)}` : `&name=${encodeURIComponent(searchQuery)}`;
        }
      
        fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log('Данные о товарах:', data);
            const optionsContainer = $('.options-container-copy');
            
            if (currentPageForCopy === 1) {
              optionsContainer.empty();
            }
      
            if (data.products && Array.isArray(data.products)) {
              data.products.forEach(product => {
                const option = $('<div>', {
                  class: 'option-copy',
                  'data-value': product.id,
                  'data-price': product.price,
                  html: `
                    <img src="${product.images[0].src}" alt="${product.name}">
                    <span>${product.name} (Артикул: ${product.sku})</span>
                  `
                });
                optionsContainer.append(option);
              });
              currentPageForCopy++;
              totalPagesForCopy = data.total_pages;
            } else {
              console.error('Неверный формат данных:', data);
            }
            isLoadingForCopy = false;
          })
          .catch(error => {
            console.error('Помилка при завантаженні товарів:', error);
            isLoadingForCopy = false;
          });
      }
      
      $('#searchBySkuForCopy').on('change', function() {
        searchBySkuForCopy = $(this).is(':checked');
      });
      
      $('#productSearchForCopy').on('keypress', function(event) {
        if (event.which === 13) {
          event.preventDefault();
          const searchQuery = $(this).val().trim();
          if (searchQuery !== '') {
            currentPageForCopy = 1;
            $('.options-container-copy').empty();
            loadProductsForCopy(searchQuery);
          }
        }
      });
      
      $('.selected-option-copy').on('click', function() {
        $('.options-container-copy').toggle();
      });
      
      $(document).on('click', '.option-copy', function() {
        const selectedText = $(this).find('span').text();
        const selectedValue = $(this).data('value');
        const selectedPrice = $(this).data('price');
        const selectedImage = $(this).find('img').attr('src');
        
        selectedProductForCopy = {
          id: selectedValue,
          name: selectedText,
          price: selectedPrice,
          image: selectedImage
        };
      
        $('.selected-option-copy').text(selectedText);
        $('.options-container-copy').hide();
      });
      
      $('.options-container-copy').on('scroll', function() {
        const container = $(this);
        if (container.scrollTop() + container.innerHeight() >= container[0].scrollHeight - 20) {
          loadProductsForCopy($('#productSearchForCopy').val().trim());
        }
      });
      
      function openAddProductModal(targetTableId) {
        $('#addProductModalForCopy').data('targetTableId', targetTableId);
        $('#addProductModalForCopy').modal('show');
        currentPageForCopy = 1;
        totalPagesForCopy = 1;
        $('.options-container-copy').empty();
        $('.selected-option-copy').text('Виберіть товар');
        selectedProductForCopy = null;
        loadProductsForCopy();
      }
      
      $(document).on('click', function(event) {
        if (!$(event.target).closest('.custom-select-copy').length) {
          $('.options-container-copy').hide();
        }
      });
      
      $(document).on('click', '#addProductToCopyBtn', function() {
        openAddProductModal('copyOrderProducts');
      });
      
      $('#addProductConfirm').on('click', function() {
        if (selectedProductForCopy) {
          const quantity = $('#productQuantityForCopy').val();
          if (quantity && quantity > 0) {
            const targetTableId = $('#addProductModalForCopy').data('targetTableId');
            const newRow = `
              <tr data-product-id="${selectedProductForCopy.id}">
                <td><img src="${selectedProductForCopy.image}" alt="${selectedProductForCopy.name}" width="50" height="50"></td>
                <td>${selectedProductForCopy.name}</td>
                <td><input type="number" class="form-control copyOrderQuantity" value="${quantity}"></td>
                <td>${selectedProductForCopy.price}</td>
                <td><button type="button" class="btn btn-danger btn-sm removeProduct">Видалити</button></td>
              </tr>
            `;
            $(`#${targetTableId} tbody`).append(newRow);
            $('#addProductModalForCopy').modal('hide');
          } else {
            alert('Будь ласка, введіть коректну кількість товару');
          }
        } else {
          alert('Будь ласка, виберіть товар');
        }
      });
      
      $(document).on('click', '.removeProduct', function() {
        $(this).closest('tr').remove();
      });
      
      $('#createCopyOrderBtn').on('click', function() {
        const newOrder = {
          customer: {
            first_name: $('#copyOrderCustomerName').val().split(' ')[0],
            last_name: $('#copyOrderCustomerName').val().split(' ')[1] || '',
            email: $('#copyOrderEmail').val(),
            phone: $('#copyOrderPhone').val()
          },
          billing: {
            first_name: $('#copyOrderCustomerName').val().split(' ')[0],
            last_name: $('#copyOrderCustomerName').val().split(' ')[1] || '',
            email: $('#copyOrderEmail').val(),
            phone: $('#copyOrderPhone').val(),
            address_1: $('#copyOrderAddress').val()
          },
          shipping: {
            first_name: $('#copyOrderCustomerName').val().split(' ')[0],
            last_name: $('#copyOrderCustomerName').val().split(' ')[1] || '',
            address_1: $('#copyOrderAddress').val()
          },
          line_items: $('#copyOrderProducts tbody tr').map(function() {
            return {
              product_id: $(this).data('product-id'),
              quantity: $(this).find('.copyOrderQuantity').val()
            };
          }).get(),
          shipping_lines: [{
            method_id: $('#copyOrderShippingMethod').val(),
            method_title: $('#copyOrderShippingMethod option:selected').text()
          }],
          payment_method: $('#copyOrderPaymentMethod').val(),
          payment_method_title: $('#copyOrderPaymentMethod option:selected').text()
        };
      
        fetch('/create_order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newOrder)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Помилка при створенні копії замовлення');
          }
          return response.json();
        })
        .then(data => {
          console.log('Копія замовлення успішно створена:', data);
          $('#copyOrderModal').modal('hide');
          $('#myModal').modal('hide');
          loadOrders();
          
        })
        .catch(error => {
          console.error('Помилка при створенні копії замовлення:', error);
          
        });
      });
      
      $('#createOrderCopy').on('click', function() {
        const orderId = $('#myModal').data('order-id');
        createOrderCopy(orderId);
      });
      
      function createOrderCopy(orderId) {
        fetch(`/dataordersbyid?id=${orderId}`)
          .then(response => response.json())
          .then(originalOrder => {
            populateCopyOrderModal(originalOrder);
            $('#copyOrderModal').modal('show');
          })
          .catch(error => {
            console.error('Помилка при отриманні даних замовлення:', error);
            alert('Помилка при отриманні даних замовлення');
          });
      }
      
      function populateCopyOrderModal(order) {
        $('#copyOrderModalBody').html(`
          <form id="copyOrderForm">
            <div class="mb-3">
              <label for="copyOrderCustomerName" class="form-label">Ім'я клієнта</label>
              <input type="text" class="form-control" id="copyOrderCustomerName" value="${order.billing.first_name} ${order.billing.last_name}">
            </div>
            <div class="mb-3">
              <label for="copyOrderEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="copyOrderEmail" value="${order.billing.email}">
            </div>
            <div class="mb-3">
              <label for="copyOrderPhone" class="form-label">Телефон</label>
              <input type="tel" class="form-control" id="copyOrderPhone" value="${order.billing.phone}">
            </div>
            <div class="mb-3">
              <label for="copyOrderAddress" class="form-label">Адреса</label>
              <input type="text" class="form-control" id="copyOrderAddress" value="${order.billing.address_1}">
            </div>
            <div class="mb-3">
              <label class="form-label"><strong>Товари</strong></label>
              <table class="table" id="copyOrderProducts">
                <thead>
                  <tr>
                    <th>Зображення</th>
                    <th>Назва</th>
                    <th>Кількість</th>
                    <th>Ціна</th>
                    <th>Дія</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.line_items.map(item => `
                    <tr data-product-id="${item.product_id}">
                      <td><img src="${item.image.src}" alt="${item.name}" width="50" height="50"></td>
                      <td>${item.name}</td>
                      <td><input type="number" class="form-control copyOrderQuantity" value="${item.quantity}"></td>
                      <td>${item.price}</td>
                      <td><button type="button" class="btn btn-danger btn-sm removeProduct">Видалити</button></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <button type="button" class="btn btn-primary" id="addProductToCopyBtn">Додати товар</button>
            </div>
            <div class="mb-3">
              <label for="copyOrderShippingMethod" class="form-label">Метод доставки</label>
              <select class="form-control" id="copyOrderShippingMethod">
                <option value="flat_rate" ${order.shipping_lines[0].method_id === 'flat_rate' ? 'selected' : ''}>Нова Пошта</option>
                <option value="free_shipping" ${order.shipping_lines[0].method_id === 'free_shipping' ? 'selected' : ''}>Укрпошта</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="copyOrderPaymentMethod" class="form-label">Метод оплати</label>
              <select class="form-control" id="copyOrderPaymentMethod">
                <option value="bacs" ${order.payment_method === 'bacs' ? 'selected' : ''}>Переказ на Р/Р</option>
                <option value="cod" ${order.payment_method === 'cod' ? 'selected' : ''}>Готівка при отриманні</option>
              </select>
            </div>
          </form>
        `);
      }

// Обработчик события для кнопки отправки Viber
$(document).on('click', '#sendViberBtn', function() {
  const orderId = $('#myModal').data('order-id');
  const phoneNumber = $('#viberPhone').val();
  const messageText = $('#viberMessage').val();
  
  const requested_data = {
    id: orderId,
    message_type: 'viber',
    phone_number: phoneNumber,
    message_text: messageText
  };
  console.log(requested_data);
  fetch('/send_phone_sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requested_data)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(error => {
        throw new Error('Помилка при відправці Viber повідомлення: ' + error.error);
      });
    }
    else{
      loadViberSMS()
    }
    return response.json();
  })
});

// Обработчик события для кнопки отправки Email
$(document).on('click', '#sendEmailBtn', function() {
  const orderId = $('#myModal').data('order-id');
  const emailAddress = $('#emailAddress').val();
  const emailSubject = $('#emailSubject').val();
  const messageText = $('#emailMessage').val();

  const requested_data = {
    id: orderId,
    message_type: 'email',
    email_address: emailAddress,
    subject: emailSubject,
    message_text: messageText
  };
  console.log(requested_data);
  fetch('/send_phone_sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requested_data)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(error => {
        throw new Error('Помилка при відправці Email: ' + error.error);
      });
    }
    else{
      loadEmails();
    }
    return response.json();
  })
  .then(data => {
    console.log('Email успішно відправлено:', data);
    alert('Email успішно відправлено');
  })
  .catch(error => {
    console.error('Помилка при відправці Email:', error);
    alert('Помилка при відправці Email: ' + error.message);
  });
});

// Функция для загрузки SMS
function loadViberSMS() {
  const phoneNumber = orderData.billing.phone;
  fetch(`/get_all_sms?number=${phoneNumber}`)
    .then(response => response.json())
    .then(data => {
      if (data.sms_data && data.sms_data.length > 0) {
        // Если есть SMS, заполняем таблицу
        const tableBody = $('#ViberTable tbody');
        tableBody.empty(); // Очищаем существующие строки

        data.sms_data.forEach(sms => {
          const row = `
            <tr>
              <td>${sms.text || ''}</td>
              <td>${sms.status || ''}</td>
              <td>${sms.date || ''}</td>
            </tr>
          `;
          tableBody.append(row);
        });
      } else {
        // Если SMS нет, выводим сообщение
        $('#ViberTable tbody').html(`
          <tr>
            <td colspan="3">SMS не знайдено</td>
          </tr>
        `);
      }
    })
    .catch(error => {
      console.error('Ошибка при получении SMS:', error);
      $('#ViberTable tbody').html(`
        <tr>
          <td colspan="3">Помилка при завантаженні SMS</td>
        </tr>
      `);
    });
}

function loadEmails() {
  const emailAddress = orderData.billing.email;
  fetch(`/get_all_sms?number=${encodeURIComponent(emailAddress)}`)
    .then(response => response.json())
    .then(data => {
      const tableBody = $('#emailTable tbody');
      tableBody.empty(); // Очищаем существующие строки

      if (data.sms_data && data.sms_data.length > 0) {
        // Если есть письма, заполняем таблицу
        data.sms_data.forEach(email => {
          if (email.type === 'email') {
            const row = `
              <tr>
                <td>${email.status || ''}</td>
                <td>${email.text || ''}</td>
              </tr>
            `;
            tableBody.append(row);
          }
        });
      } else {
        // Если писем нет, выводим сообщение
        tableBody.html(`
          <tr>
            <td colspan="3">Листів не знайдено</td>
          </tr>
        `);
      }
    })
    .catch(error => {
      console.error('Помилка при отриманні листів:', error);
      $('#emailTable tbody').html(`
        <tr>
          <td colspan="3">Помилка при завантаженні листів</td>
        </tr>
      `);
    });
}


// Вызвать функцию loadOrders() при загрузке страницы
$(document).ready(function() {
loadManagers();
loadManagerList();
loadOrders();
load_custom_status();
});                  

document.addEventListener('DOMContentLoaded', function() {
  const logoutLink = document.querySelector('.href-exit');

  logoutLink.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    fetch('/logout')
      .then(response => {
        if (response.redirected) {
        
          window.location.href = response.url;
        }
      })
      .catch(error => {
        console.error('Ошибка при выполнении запроса:', error);
      });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const logoutLink = document.querySelector('.exit-img');

  logoutLink.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    fetch('/logout')
      .then(response => {
        if (response.redirected) {
        
          window.location.href = response.url;
        }
      })
      .catch(error => {
        console.error('Ошибка при выполнении запроса:', error);
      });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const logoutLink = document.querySelector('.exit1-img');

  logoutLink.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    fetch('/logout')
      .then(response => {
        if (response.redirected) {
        
          window.location.href = response.url;
        }
      })
      .catch(error => {
        console.error('Ошибка при выполнении запроса:', error);
      });
  });
});