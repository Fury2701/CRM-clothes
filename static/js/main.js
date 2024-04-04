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

const checkbox = document.getElementById('CheckNewest');
const originalRows = Array.from(table1.rows).slice(1);

checkbox.addEventListener('change', function() {
  if (this.checked) {
    let sortedRows = Array.from(table1.rows)
      .slice(1)
      .sort((rowA, rowB) => {
        let cellAValue = parseInt(rowA.cells[1].querySelector('#t2table tr:nth-child(2) td').textContent);
        let cellBValue = parseInt(rowB.cells[1].querySelector('#t2table tr:nth-child(2) td').textContent);
        return cellAValue - cellBValue;
      });

    table1.tBodies[0].append(...sortedRows);
  } else {
    // Если не отмечен, восстанавливаем исходный порядок строк
    table1.tBodies[0].innerHTML = ''; // Очищаем содержимое тела таблицы

    originalRows.forEach(row => {
      table1.tBodies[0].appendChild(row);
    });
  }
});

const checkbox1 = document.getElementById('CheckOldest');

checkbox1.addEventListener('change', function() {
  if (this.checked) {
    let sortedRows1 = Array.from(table1.rows)
      .slice(1)
      .sort((rowA, rowB) => {
        let cellAValue = parseInt(rowA.cells[1].querySelector('#t2table tr:nth-child(2) td').textContent);
        let cellBValue = parseInt(rowB.cells[1].querySelector('#t2table tr:nth-child(2) td').textContent);
        return cellAValue - cellBValue;
      });

    sortedRows1.reverse();
    table1.tBodies[0].append(...sortedRows1);
  } else {
    // Если не отмечен, восстанавливаем исходный порядок строк
    table1.tBodies[0].innerHTML = ''; // Очищаем содержимое тела таблицы

    originalRows.forEach(row => {
      table1.tBodies[0].appendChild(row);
    });
  }
});

let orderData; // Объявляем переменную orderData в глобальной области видимости

// Обработчик клика по кнопке "Створити замовлення"
$(document).on('click', '#create-offer', function() {
  $('#createOrderModal').modal('show');
});

// Обработчик клика по кнопке "Створити замовлення" в модальном окне
$(document).on('click', '#createOrderBtn', function() {
  const customerName = $('#customerName').val();
  const customerPhone = $('#customerPhone').val();
  const customerEmail = $('#customerEmail').val();
  const shippingMethod = $('#shippingMethod').val();
  const paymentMethod = $('#paymentMethod').val();
  
  // Создайте объект с данными заказа
  const orderData = {
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
    shipping_method: shippingMethod,
    payment_method: paymentMethod
    // Добавьте другие данные заказа по необходимости
  };
  
  // Отправьте данные заказа на сервер
  createOrder(orderData);
});

// Функция для отправки данных заказа на сервер
function createOrder(orderData) {
  fetch('/create_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
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


// Обработчик клика на кнопку удаления товара
$(document).on('click', '.remove-item', function() {
  const index = $(this).data('index');
  const orderId = $('#myModal').data('order-id');
 
  // Удаляем товар из массива line_items
  orderData.line_items.splice(index, 1);
  
  // Обновляем данные заказа на сервере
  updateOrder(orderId, { line_items: orderData.line_items });
});

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
      quantity: item.quantity,
      total: item.total, 
      
    })),
    
  };
  
  // Отправляем обновленные данные на сервер
  updateOrder(orderId, updatedData);
});

// Функция для отправки обновленных данных заказа на сервер
function updateOrder(orderId, data) {
  console.log('Updating order:', orderId, data);
  fetch('/update_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: orderId,
      data: data
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при обновлении заказа');
      }
      return response.json();
    })
    .then(data => {
      console.log('Заказ успешно обновлен:', data);
      // Закрываем модальное окно
      $('#myModal').modal('hide');
      // Обновляем данные на странице после успешного обновления заказа
      loadOrders();
    })
    .catch(error => {
      console.error('Ошибка при обновлении заказа:', error);
    });
}

// Функция для обновления таблицы товаров в модальном окне
function updateOrderItemsTable() {
  const tableBody = $('#inModalTable tbody');
  tableBody.empty();

  orderData.line_items.forEach((item,index) => {
   
  });
  orderData.line_items.forEach((item, index) => {
    const row = `
      <tr>
        <td><img src="${item.image.src}" width="75" height="75"></td>
        <td>${item.name}</td>
        <td><input type="number" class="table-input" value="${item.quantity}"></td>
        <td>${item.price}</td>
        <td><input type="number" class="table-input" id="table-input-summ" value="${item.total}"></td>
        <td>
          <button type="button" class="btn btn-sm btn-danger remove-item" data-index="${index}">
            <i class="fas fa-times"></i>
          </button>
        </td>
      </tr>
    `;
    tableBody.append(row);
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

function loadOrders() {
  fetch('/dataorders')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Очистить существующие строки в таблице
      $('#table1 tbody').empty();

      // Заполнить таблицу данными из ответа сервера
      data.orders.forEach(order => {
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

        // Добавляем слушатель событий на клик по ссылке с номером заказа
        $(document).on('click', '#table1 tbody tr a', function(e) {
          e.preventDefault(); // Предотвращаем стандартное действие ссылки
          const orderId = parseInt($(this).text()); // Получаем номер заказа
          console.log('ID заказа:', orderId); // Отладочное сообщение
          // Находим данные о заказе с соответствующим номером в JSON
          orderData = data.orders.find(order => order.id === orderId); // Присваиваем значение переменной orderData
          console.log('zakazinfo', orderData);

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
                            <th scope="col"></th>
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
                              <input type="number" class="table-input" value="${item.quantity*10}">
                            </td>
                            <td>
                              ${item.price}
                            </td>
                            <td>
                              <input type="number" class="table-input" id="table-input-summ" value="${item.total}">
                            </td>
                            <td>
                              <button type="button" class="btn btn-sm btn-danger remove-item" data-index="${index}">
                                <i class="fas fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        `).join('')}
                        </tbody>
                      </table>
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
                      <li>Адреса доставки: ${orderData.shipping.state + " , " + orderData.shipping.city + " , " + orderData.shipping.postcode + " , " + orderData.shipping.address_1 + " , " + orderData.shipping.address_2}</li>
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
              Вкладка 2
            </div>
            <div class="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-tab">
              Вкладка 3
            </div>
          </div>
        `);

        // Обновляем заголовок модального окна
        $('#myModal .modal-title').text(`Замовлення № ${orderId}`);
      });

      $('#table1 tbody').append(row);
    });
  })
  .catch(error => {
    console.error('Ошибка при загрузке заказов:', error);
  });
}



// Вызвать функцию loadOrders() при загрузке страницы
$(document).ready(function() {
loadOrders();
});                  

