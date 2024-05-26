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

let selectedProductId;
let currentPage = 1;
let totalPages = 1;
let isLoading = false;

// Обработчик клика по кнопке "Створити замовлення" в модальном окне
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
  const productQuantity = parseInt($('#productQuantityCreate').val());

  const lineItems = [
    {
      product_id: parseInt(selectedProductId),
      quantity: productQuantity,
    }
  ];

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
  console.log(orderData)
});

// Обработчик клика на выбранную опцию товара
document.querySelector('.selected-option-create').addEventListener('click', function() {
  document.querySelector('.options-container-create').style.display = 'block';
});

// Обработчик клика на опцию товара
document.querySelector('.options-container-create').addEventListener('click', function(event) {
  if (event.target.classList.contains('option')) {
    selectedProductId = event.target.dataset.value;
    const selectedText = event.target.textContent;
    document.querySelector('.selected-option-create').textContent = selectedText;
    document.querySelector('.options-container-create').style.display = 'none';
    console.log('Выбранный товар:', selectedProductId);
  }
});

// Обработчик клика вне выпадающего списка товаров
document.addEventListener('click', function(event) {
  const customSelect = document.querySelector('.custom-select-create');
  if (!customSelect.contains(event.target)) {
    document.querySelector('.options-container-create').style.display = 'none';
  }
});

// Обработчик открытия модального окна для создания заказа
$('#createOrderModal').on('show.bs.modal', function() {
  // Очистка выбранного товара
  selectedProductId = null;
  document.querySelector('.selected-option-create').textContent = 'Виберіть товар';
  
  // Загрузка первой страницы товаров
  currentPage = 1;
  $('.options-container-create').empty();
  loadProducts();
});

// Обработчик события прокрутки для контейнера опций товаров
$('.options-container-create').on('scroll', function() {
  const optionsContainer = this;
  if (optionsContainer.scrollTop + optionsContainer.clientHeight >= optionsContainer.scrollHeight) {
    loadProducts();
  }
});

// Функция для загрузки товаров и создания опций
function loadProducts() {
  if (isLoading || currentPage > totalPages) {
    return;
  }

  isLoading = true;

  fetch(`/data_products?page=${currentPage}`)
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      currentPage = data.current_page + 1;
      totalPages = data.total_pages;

      // Создание опций для каждого товара и добавление их в контейнер опций
      const optionsContainer = document.querySelector('.options-container-create');
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

  const selectedCustomStatuses = getSelectedCustomStatuses();
  if (selectedCustomStatuses.length > 0) {
    updatedFields.meta_data = [
      {
        key: '_custom_statuses',
        value: selectedCustomStatuses
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

    row.append($('<td>').addClass('modal-link-cell').html(`
    <a href="#" data-bs-toggle="modal" data-bs-target="#myModal">${order.id}</a>
      <br>
        ${order.date_created}
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

    // Создайте дочерний ряд для кастомных тегов
    const childRow = $('<tr>').addClass('child-row').attr('data-order-id', order.id);
    const childCell = $('<td>').attr('colspan', row.find('td').length);
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
    
    childCell.append(customTagsContainer);
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
let currentPage = 1;
let totalPages = 1;
let isLoading = false;

// Функция для загрузки товаров и создания опций
function loadProducts() {
  if (isLoading || currentPage > totalPages) {
    console.log('Загрузка товаров уже выполняется или достигнута последняя страница');
    return;
  }

  isLoading = true;
  console.log('Загрузка товаров, страница:', currentPage);

  fetch(`/data_products?page=${currentPage}`)
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      currentPage = data.current_page + 1; // Увеличиваем текущую страницу на 1
      totalPages = data.total_pages;

      console.log('Получены товары:', products);
      console.log('Текущая страница:', currentPage);
      console.log('Всего страниц:', totalPages);

      // Создание опций для каждого товара и добавление их в контейнер опций
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

// Обработчик события прокрутки для контейнера опций
$('.options-container').on('scroll', function() {
  const optionsContainer = this;
  console.log('Прокрутка контейнера опций');
  console.log('Позиция прокрутки:', optionsContainer.scrollTop);
  console.log('Высота контейнера:', optionsContainer.clientHeight);
  console.log('Общая высота содержимого контейнера:', optionsContainer.scrollHeight);
  if (optionsContainer.scrollTop + optionsContainer.clientHeight >= optionsContainer.scrollHeight) {
    console.log('Достигнут конец списка опций, загружаем следующую страницу');
    loadProducts();
  }
});
  
// Загрузка первой страницы товаров при открытии модального окна
$('#addProductModal').on('shown.bs.modal', function() {
  console.log('Дочернее модальное окно открыто');
  currentPage = 1;
  $('.options-container').empty();
  loadProducts();
});

  // Обработчик клика на выбранную опцию
  document.querySelector('.selected-option').addEventListener('click', function() {
    document.querySelector('.options-container').style.display = 'block';
  });

  // Обработчик клика на опцию
  document.querySelector('.options-container').addEventListener('click', function(event) {
    if (event.target.classList.contains('option')) {
      selectedValue = event.target.dataset.value;
      const selectedText = event.target.textContent;
      document.querySelector('.selected-option').textContent = selectedText;
      document.querySelector('.options-container').style.display = 'none';
      console.log('Выбранный товар:', selectedValue);
    }
  });

  // Обработчик клика вне выпадающего списка
  document.addEventListener('click', function(event) {
    const customSelect = document.querySelector('.custom-select');
    if (!customSelect.contains(event.target)) {
      document.querySelector('.options-container').style.display = 'none';
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
    
    updateOrder(orderId, updatedFields);
    
    $('#addProductModal').modal('hide');
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
              <div class="client-tags">

          
              <!-- Кнопка "+" для добавления тегов -->
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
             <div class="accordion-body">
             <li>Замовник: ${orderData.customer_id === 0 ? orderData.billing.last_name + " " + orderData.billing.first_name + " " + orderData.billing.company : `<a href="#" class="customer-link" data-customer-id="${orderData.customer_id}">${orderData.billing.last_name + " " + orderData.billing.first_name + " " + orderData.billing.company}</a>`}</li>
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
         <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style="">
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
   </div>
 `);

   // Отображаем ранее сохраненные кастомные статусы
   const customStatuses = orderData.meta_data.find(meta => meta.key === '_custom_statuses');
   if (customStatuses) {
     customStatuses.value.forEach(status => {
       createTag(status);
     });
   }

// Сохраняем исходное количество товаров
orderData.line_items.forEach(item => {
  item.original_quantity = parseFloat(item.quantity);
});
 // Обновляем заголовок модального окна
 $('#myModal .modal-title').text(`Замовлення № ${orderData.id}`);
 
loadnotes();
loadSMS();
load_custom_status();
displayCustomStatuses();
}

$(document).on('click', '.client-tags .btn-close', function() {
  $(this).closest('.toast').remove();
});

// Функция для создания нового тега
function createTag(text) {
  // Проверяем, есть ли уже тег с таким текстом
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

// Обработчик клика на опцию в дропдауне
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

// Обработчик события для добавления выбранного кастомного статуса в теги
$(document).on('click', '#customStatusList .dropdown-item', function() {
  const selectedStatus = $(this).text();
  createTag(selectedStatus);
});

// Обработчик события для создания нового кастомного статуса
$(document).on('keypress', '#newCustomStatusInput', function(event) {
  if (event.which === 13) {
    const newCustomStatus = $(this).val().trim();
    if (newCustomStatus !== '') {
      createTag(newCustomStatus);
      $(this).val('');

      // Создаем новый кастомный статус
      createCustomStatus('custom_statuses:' + newCustomStatus, newCustomStatus);

      // Загружаем обновленный список кастомных статусов
      load_custom_status();
    }
  }
});

// Функция для загрузки кастомных статусов
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
      
      $('#myModal').modal('hide'); // Закрытие модального окна заказа перед открытием модального окна клиента
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
      
      // Обработчик клика по ссылке пагинации для заказов клиента
      $(document).on('click', '#clientOrdersPaginationContainer .page-link', function(e) {
      e.preventDefault();
      const page = $(this).data('page');
      const customerId = $('#clientModalLabel').data('customer-id');
      loadClientOrders(customerId, page);
      });



// Вызвать функцию loadOrders() при загрузке страницы
$(document).ready(function() {
loadManagers();
loadManagerList();
loadOrders();
load_custom_status();
});                  

