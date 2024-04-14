$('.menu-btn').on('click', function(e) {
  e.preventDefault();
  $(this).hide();
  $('.menu').toggleClass('menu_active');
  $('.content').toggleClass('content_active');
});

$('.menu2-btn').on('click', function(e) {
  e.preventDefault();
  $('.menu').toggleClass('menu_active');
  $('.content').toggleClass('content_active');
});

$(document).ready(function() {
  $(".menu2-btn").click(function() {
    $(".menu-btn").toggle();
  });
});

$(document).ready(function() {
  $('.menu-btn').on('click', function() {
    $('.my-content').toggleClass('content-shifted');
  });

  $('.menu2-btn').on('click', function() {
    $('.my-content').removeClass('content-shifted');
  });
});


let orderData; // Объявляем переменную orderData в глобальной области видимости
let loadOrders_response;
let orderId;
let updated_Order_Data;

// Обработчик клика по кнопке "Створити замовлення"
$(document).on('click', '#create-offer', function() {
  $('#createOrderModal').modal('show');
});

// Обработчик клика по кнопке "Створити замовлення" в модальном окне
// Обработчик клика по кнопке "Створити замовлення" в модальном окне
$(document).on('click', '#createOrderBtn', function() {
  const customerName = $('#customerName').val();
  const customerPhone = $('#customerPhone').val();
  const customerEmail = $('#customerEmail').val();
  const shippingAddress = $('#shippingAddress').val();
  const shippingCity = $('#shippingCity').val();
  const shippingPostcode = $('#shippingPostcode').val();
  const shippingMethod = $('#shippingMethod').val();
  const paymentMethod = $('#paymentMethod').val();
  const productId = $('#productId').val();
  const productQuantity = $('#productQuantity').val();

  const lineItems = [
    {
      product_id: parseInt(productId),
      quantity: parseInt(productQuantity),
    }
  ];

  // Создайте объект с данными заказа
  const orderData = {
    customer: {
      first_name: customerName.split(' ')[0],
      last_name: customerName.split(' ')[1] || '',
      email: customerEmail,
      phone: customerPhone
    },
    billing: {
      first_name: customerName.split(' ')[0],
      last_name: customerName.split(' ')[1] || '',
      address_1: shippingAddress,
      city: shippingCity,
      postcode: shippingPostcode,
      phone: customerPhone,
      email: customerEmail
    },
    shipping: {
      first_name: customerName.split(' ')[0],
      last_name: customerName.split(' ')[1] || '',
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
      const updatedOrders = loadOrders_response.orders.filter(order => order.id !== orderId);
      updated_Order_Data = updatedOrders;
      console.log('Оновлена локальна data', updated_Order_Data);
      // Очистить существующие строки в таблице
      $('#table1 tbody').empty();
      fillOrdersTable(updated_Order_Data);
    })
    .catch(error => {
      console.error('Помилка при видаленні замовлення:', error);
    });
}

// Обработчик изменения количества товара
$(document).on('change', '.table-input', function() {
  const index = $(this).closest('tr').index();
  const newQuantity = parseInt($(this).val());
  
  // Обновляем количество товара в массиве line_items
  orderData.line_items[index].quantity = newQuantity;
  
  // Пересчитываем общую стоимость товара
  const price = parseFloat(orderData.line_items[index].price);
  orderData.line_items[index].total = (price * newQuantity).toFixed(2);
  
  // Обновляем значение общей стоимости в таблице
  $(this).closest('tr').find('#table-input-summ').val(orderData.line_items[index].total);
});

// Обработчик клика на кнопку "Сохранить" в модальном окне
$(document).on('click', '#save-info', function() {
  const orderId = $('#myModal').data('order-id');
  
  // Получаем обновленные данные заказа
  const updatedData = {
    line_items: orderData.line_items.map(item => ({
      id: item.id,
      product_id: item.product_id,
      variation_id: item.variation_id,
      quantity: parseInt(item.quantity),
      total: item.total, 
      
    })),
    
  };
  
  // Отправляем обновленные данные на сервер
  updateOrder(orderId, updatedData);
});


function updateOrder(orderId, data) {
  const discountAmount = parseFloat($('#discount_amount').val());
  const discountType = $('#discount_type').val();

  const updatedData = {
    ...data,
    coupon_lines: [
      {
        code: 'MANAGER_DISCOUNT',
        amount: discountAmount,
        discount_tax: "0",
        discount_type: discountType
      }
    ]
  };

  console.log('Updating order:', orderId, updatedData);
  fetch('/update_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: orderId,
      data: updatedData
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при обновлении заказа');
      }
      return response.json();
    })
    .then(updatedOrder => {
      console.log('Заказ успешно обновлен:', updatedOrder);
      // Закрываем модальное окно
      $('#myModal').modal('hide');
      // Обновляем данные на странице после успешного обновления заказа
      loadOrders();
    })
    .catch(error => {
      console.error('Ошибка при обновлении заказа:', error);
    });
}

// Добавляем слушатель событий на изменение select статуса заказа в таблице
$(document).on('change', '#table1 .dropdown-list', function() {
  const orderId = parseInt($(this).closest('tr').find('a').text());
  const newStatus = $(this).val();
  updateOrder(orderId, { status: newStatus });
});

// Добавляем слушатель событий на клик по кнопке "Зберегти" в модальном окне
$(document).on('click', '#save-info', function() {
  const orderId = $('#myModal').data('order-id');
  const newStatus = $('#myModal .dropdown-list').val();
  const isPaid = $('#if_Paid').val() === 'true';

  const data = {
    status: newStatus,
    set_paid: isPaid
  };

  updateOrder(orderId, data);
});

// Добавляем слушатель событий на клик по ссылке с номером заказа
$(document).on('click', '#table1 tbody tr a', function(e) {
  e.preventDefault();
  const orderId = parseInt($(this).text());
  console.log('ID заказа:', orderId);
  // Сохраняем идентификатор заказа в атрибуте данных модального окна
  $('#myModal').data('order-id', orderId);
});

function loadOrders(page = 1) {
  fetch(`/dataorders?page=${page}`)
    .then(response => response.json())
    .then(data => {
      console.log('COSOLE.LOG(DATA): ', data);
      loadOrders_response = data;
      // Очистить существующие строки в таблице
      $('#table1 tbody').empty();

      // Заполнить таблицу данными из ответа сервера
      fillOrdersTable(data.orders);
      viewModal(data.orders);

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

$(document).on('click', '.pagination .page-link', function(e) {
  e.preventDefault();
  const page = $(this).data('page');
  loadOrders(page);
})

function fillOrdersTable(orders) {
  orders.forEach(order => {
    const row = $('<tr>');
    row.append($('<td>').html('<img src="' + order.line_items[0].image.src + '" width="100" height="100">'));
    row.append($('<td>').html(`
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
    selectDropdown.append($('<option>').attr('value', 'pending').text('В очікуванні'));
    selectDropdown.append($('<option>').attr('value', 'processing').text('В обробці'));
    selectDropdown.append($('<option>').attr('value', 'on-hold').text('На утриманні'));
    selectDropdown.append($('<option>').attr('value', 'completed').text('Завершений'));
    selectDropdown.append($('<option>').attr('value', 'cancelled').text('Скасований'));
    selectDropdown.append($('<option>').attr('value', 'refunded').text('Повернений'));
    selectDropdown.append($('<option>').attr('value', 'failed').text('Невдалий'));
    selectDropdown.append($('<option>').attr('value', 'trash').text('Кошик'));
    selectDropdown.val(order.status); // Установить значение статуса для текущего заказа
    row.append($('<td>').html(selectDropdown));

  $('#table1 tbody').append(row);
});
}

function loadnotes() {
  fetch(`/notes?id=${orderId}&page=1`)
    .then(response => response.json())
    .then(data => {
      console.log('Полученные данные заметок:', data);

      // Очищаем тело таблицы перед заполнением
      $('#noteTable tbody').empty();

      if (data.length > 0) {
        // Если есть заметки, заполняем таблицу заметками
        console.log('Найдены заметки, заполняем таблицу');

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

function viewModal(orders) {
  // Добавляем слушатель событий на клик по ссылке с номером заказа
  $(document).on('click', '#table1 tbody tr a', function(e) {
    e.preventDefault(); // Предотвращаем стандартное действие ссылки
    orderId = parseInt($(this).text()); // Получаем номер заказа
    console.log('ID заказа:', orderId); // Отладочное сообщение

    // Отправляем запрос на сервер для получения данных о заказе по его ID
    fetch(`/dataordersbyid?id=${orderId}`)
      .then(response => response.json())
      .then(data => {
        orderData = data; // Присваиваем полученные данные переменной orderData
        console.log('zakazinfo', orderData);

        loadnotes();

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
                                  <input type="number" class="table-input" value="${item.quantity}">
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
                      <li>Дата створення: ${orderData.date_created}</li>
                      <li>Замовник: ${orderData.billing.last_name + " " + orderData.billing.first_name + " " + orderData.billing.company}</li>
                      <li>Статус: 
                        <select class="dropdown-list">
                          <option value="pending" ${orderData.status === 'pending' ? 'selected' : ''}>В очікуванні</option>
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
                      Інформація про кієнта
                    </button>
                  </h2>
                  <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style="">
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
                          <option value="percent">%</option>
                          <option value="fixed_cart">UAH</option>
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
              Вкладка 3
            </div>
          </div>
        `);
        // Обновляем заголовок модального окна
        $('#myModal .modal-title').text(`Замовлення № ${orderId}`);
      })
      .catch(error => {
        console.error('Ошибка при получении данных о заказе:', error);
      });
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
        option.innerHTML = `<img src="${product.images[0].src}"> ${product.name}`;
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
      const selectedValue = event.target.dataset.value;
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
  const productId = $('#productIdInput').val();
  const quantity = parseInt($('#quantityInput').val());

  // Проверка введенных данных
  if (productId && quantity > 0) {


    // Добавление нового товара в данные заказа
    const newLineItem = {
      product_id: parseInt(productId),
      quantity: quantity,
    };
    currentOrderData.line_items.push(newLineItem);

    // Вызов функции updateOrder для обновления заказа с добавленным товаром
    updateOrder(orderId, currentOrderData);

    // Закрытие дочернего модального окна
    $('#addProductModal').modal('hide');
  }
});


  // Обработчик изменения состояния чекбокса "Від старіших"
  $('#CheckOldest').change(function() {
    if ($(this).is(':checked')) {
      // Если галочка установлена, загружаем заказы от старых к новым
      loadOrdersOldToNew();
    } else {
      // Если галочка снята, загружаем заказы по умолчанию
      loadOrders();
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

$(document).on('click', '.status-sort-select .dropdown-item', function(e) {
  e.preventDefault();
  const selectedStatus = $(this).data('status');
  
  // Отправляем запрос на сервер для получения отсортированных заказов
  fetchOrdersByStatus(selectedStatus, 1);
});

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


// Вызвать функцию loadOrders() при загрузке страницы
$(document).ready(function() {
loadOrders();
});                  








