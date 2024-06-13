
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
  })

  // Обробник кліка для кнопки "Створити доставку"
document.getElementById("create-shipment").addEventListener("click", function() {
  // Отримуємо модальне вікно за його id
  var modal = new bootstrap.Modal(document.getElementById("createShipmentModal"));
  
  modal.show();
});


// Ваш API-ключ Нової пошти
const API_KEY = '1e4e49d462079985b99e1b39effc9ae6';


const senderCitySearchInput = document.getElementById('sender-city-search');
const senderCityOptionsContainer = document.getElementById('sender-city-options');
const recipientCitySearchInput = document.getElementById('recipient-city-search');
const recipientCityOptionsContainer = document.getElementById('recipient-city-options');

senderCitySearchInput.addEventListener('click', function() {
  if (senderCityOptionsContainer.style.display === 'none') {
    searchSettlements(this.value, senderCityOptionsContainer);
  } else {
    senderCityOptionsContainer.style.display = 'none';
  }
});

recipientCitySearchInput.addEventListener('click', function() {
  if (recipientCityOptionsContainer.style.display === 'none') {
    searchSettlements(this.value, recipientCityOptionsContainer);
  } else {
    recipientCityOptionsContainer.style.display = 'none';
  }
});

senderCitySearchInput.addEventListener('input', function() {
  searchSettlements(this.value, senderCityOptionsContainer);
});

recipientCitySearchInput.addEventListener('input', function() {
  searchSettlements(this.value, recipientCityOptionsContainer);
});

document.addEventListener('click', function(event) {
  const target = event.target;
  if (!senderCityOptionsContainer.contains(target) && target !== senderCitySearchInput) {
    senderCityOptionsContainer.style.display = 'none';
  }
  if (!recipientCityOptionsContainer.contains(target) && target !== recipientCitySearchInput) {
    recipientCityOptionsContainer.style.display = 'none';
  }
});

function searchSettlements(searchTerm, optionsContainer) {
  if (searchTerm.length >= 3) {
    const apiKey = API_KEY; // Замініть на свій ключ API
    const url = 'https://api.novaposhta.ua/v2.0/json/';

    const data = {
      apiKey: apiKey,
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: searchTerm,
        Limit: '50',
        Page: '1'
      }
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const settlements = data.data[0].Addresses;
          displaySettlementOptions(settlements, optionsContainer);
        } else {
          console.error('Помилка при отриманні даних:', data.errors);
        }
      })
      .catch(error => {
        console.error('Помилка:', error);
      });
  } else {
    optionsContainer.innerHTML = '';
    optionsContainer.style.display = 'none';
  }
}

function displaySettlementOptions(settlements, optionsContainer) {
  optionsContainer.innerHTML = '';
  settlements.forEach(settlement => {
    const option = document.createElement('div');
    option.classList.add('option');
    option.setAttribute('data-ref', settlement.Ref);

    const settlementInfo = document.createElement('div');
    settlementInfo.textContent = `${settlement.SettlementTypeCode} ${settlement.MainDescription}`;

    const additionalInfo = document.createElement('div');
    additionalInfo.classList.add('additional-info');
    
    let additionalInfoText = `обл. ${settlement.Area}`;
    if (settlement.Region) {
      additionalInfoText += `, район ${settlement.Region}`;
    }
    
    additionalInfo.textContent = additionalInfoText;

    option.appendChild(settlementInfo);
    option.appendChild(additionalInfo);

    option.addEventListener('click', function() {
      const selectedOption = `${settlement.SettlementTypeCode} ${settlement.MainDescription}, ${additionalInfoText}`;
      optionsContainer.previousElementSibling.value = selectedOption;
      optionsContainer.previousElementSibling.setAttribute('data-ref', settlement.Ref); // Сохраняем Ref выбранного населенного пункта
  
      console.log('Selected Settlement:', settlement);
      console.log('DeliveryCity:', settlement.DeliveryCity);
      console.log('SettlementTypeCode:', settlement.SettlementTypeCode);
      console.log('MainDescription:', settlement.MainDescription);
      console.log('Area:', settlement.Area);
      console.log('Region:', settlement.Region);
      
      if (optionsContainer === senderCityOptionsContainer) {
        senderCitySearchInput.dataset.deliveryCity = settlement.DeliveryCity;
      } else if (optionsContainer === recipientCityOptionsContainer) {
        recipientCitySearchInput.dataset.deliveryCity = settlement.DeliveryCity;
      }
  
      optionsContainer.style.display = 'none';
    });

    optionsContainer.appendChild(option);
  });
  optionsContainer.style.display = 'block';
}

const senderWarehouseSearchInput = document.getElementById('sender-warehouse-search');
const senderWarehouseOptionsContainer = document.getElementById('sender-warehouse-options');
const recipientWarehouseSearchInput = document.getElementById('recipient-warehouse-search');
const recipientWarehouseOptionsContainer = document.getElementById('recipient-warehouse-options');

senderWarehouseSearchInput.addEventListener('click', function() {
  const deliveryCity = senderCitySearchInput.dataset.deliveryCity; // Получаем DeliveryCity для отправителя
  if (deliveryCity && senderWarehouseOptionsContainer.style.display === 'none') {
    searchWarehouses(deliveryCity, senderWarehouseOptionsContainer);
  } else {
    senderWarehouseOptionsContainer.style.display = 'none';
  }
});

recipientWarehouseSearchInput.addEventListener('click', function() {
  const deliveryCity = recipientCitySearchInput.dataset.deliveryCity; // Получаем DeliveryCity для получателя
  if (deliveryCity && recipientWarehouseOptionsContainer.style.display === 'none') {
    searchWarehouses(deliveryCity, recipientWarehouseOptionsContainer);
  } else {
    recipientWarehouseOptionsContainer.style.display = 'none';
  }
});

senderWarehouseSearchInput.addEventListener('input', function() {
  const deliveryCity = senderCitySearchInput.dataset.deliveryCity; // Получаем DeliveryCity для отправителя
  if (deliveryCity) {
    searchWarehouses(deliveryCity, senderWarehouseOptionsContainer);
  } else {
    senderWarehouseOptionsContainer.innerHTML = '';
    senderWarehouseOptionsContainer.style.display = 'none';
  }
});

recipientWarehouseSearchInput.addEventListener('input', function() {
  const deliveryCity = recipientCitySearchInput.dataset.deliveryCity; // Получаем DeliveryCity для получателя
  if (deliveryCity) {
    searchWarehouses(deliveryCity, recipientWarehouseOptionsContainer);
  } else {
    recipientWarehouseOptionsContainer.innerHTML = '';
    recipientWarehouseOptionsContainer.style.display = 'none';
  }
});

document.addEventListener('click', function(event) {
  const target = event.target;
  if (!senderWarehouseOptionsContainer.contains(target) && target !== senderWarehouseSearchInput) {
    senderWarehouseOptionsContainer.style.display = 'none';
  }
  if (!recipientWarehouseOptionsContainer.contains(target) && target !== recipientWarehouseSearchInput) {
    recipientWarehouseOptionsContainer.style.display = 'none';
  }
});

function searchWarehouses(deliveryCity, optionsContainer) {
  console.log('searchWarehouses - deliveryCity:', deliveryCity);

  if (!deliveryCity) {
    optionsContainer.innerHTML = '';
    optionsContainer.style.display = 'none';
    return;
  }

  const apiKey = API_KEY;
  const url = 'https://api.novaposhta.ua/v2.0/json/';

  const data = {
    apiKey: apiKey,
    modelName: 'AddressGeneral',
    calledMethod: 'getWarehouses',
    methodProperties: {
      CityRef: deliveryCity // Используем DeliveryCity вместо CityRef
    }
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const warehouses = data.data;
        console.log('Полученные отделения:', warehouses); // Добавьте эту строку
        displayWarehouseOptions(warehouses, optionsContainer);
      } else {
        console.error('Ошибка при получении данных:', data.errors);
      }
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
}

function displayWarehouseOptions(warehouses, optionsContainer) {
  optionsContainer.innerHTML = '';
  warehouses.forEach(warehouse => {
    const option = document.createElement('div');
    option.classList.add('option');
    option.setAttribute('data-ref', warehouse.Ref);
    option.setAttribute('data-warehouse-index', warehouse.WarehouseIndex); // Добавляем атрибут data-warehouse-index
    option.textContent = warehouse.Description;
    option.addEventListener('click', function() {
      optionsContainer.previousElementSibling.value = warehouse.Description;
      optionsContainer.previousElementSibling.setAttribute('data-ref', warehouse.Ref);
      optionsContainer.previousElementSibling.setAttribute('data-warehouse-index', warehouse.WarehouseIndex); // Устанавливаем атрибут data-warehouse-index для выбранного отделения
      optionsContainer.style.display = 'none';
    });
    optionsContainer.appendChild(option);
  });
  optionsContainer.style.display = 'block';
}


// Обработчик клика на кнопку "Зберегти" в модальном окне создания контрагента 
$(document).on('click', '#saveCounterparty', function() {
  const firstName = document.getElementById('firstName').value;
  const middleName = document.getElementById('middleName').value;
  const lastName = document.getElementById('lastName').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const counterpartyType = document.getElementById('counterpartyType').value;
  const counterpartyProperty = document.getElementById('counterpartyProperty').value;

  const data = {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    phone: phone,
    email: email,
    counterparty_type: counterpartyType,
    counterparty_property: counterpartyProperty,
    city_ref: "1b009444-4e4a-11ed-a361-48df37b92096",
  };

  createCounterparty(data);  
});

function createCounterparty(data) {
  fetch('/create_counterparty', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
    if (result.error) {
        console.error('Ошибка создания контрагента:', result.error);
        
    } else {
        console.log('Контрагент успешно создан:', result);
        $('#counterpartyModal').modal('hide');
        
    }
})
.catch(error => {
    console.error('Ошибка отправки запроса:', error);
    
});
}

$(document).on('click', '#createCounerparty', function() {
  $('#counterpartyModal').modal('show');
});

function loadCounterparties() {
  getCounteragents(1, 20)
    .then(data => {
      const counterpartySelect = document.getElementById('counterpartySelect');
      counterpartySelect.innerHTML = '';

      data.counteragents.forEach(counterparty => {
        const option = document.createElement('option');
        option.value = counterparty.ref;
        option.textContent = counterparty.name;
        counterpartySelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Ошибка загрузки контрагентов:', error);
    });
}

function createCounterparty(data) {
  fetch('/create_counterparty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.error) {
        console.error('Ошибка создания контрагента:', result.error);
      } else {
        console.log('Контрагент успешно создан:', result);
        $('#counterpartyModal').modal('hide');

        setTimeout(() => {
          // Открытие модального окна создания контактного лица с задержкой
          loadCounterparties(); // Загрузка списка контрагентов в выпадающий список
          currentRecipientPage = 1; // Сброс текущей страницы получателей
          loadCounteragents(); // Обновление списка получателей
        }, 1000);
      }
    })
    .catch(error => {
      console.error('Ошибка отправки запроса:', error);
    });
}

document.getElementById('createContactPersonButton').addEventListener('click', function() {
  const counterpartyRef = document.getElementById('counterpartySelect').value;
  const firstName = document.getElementById('contactPersonFirstName').value;
  const lastName = document.getElementById('contactPersonLastName').value;
  const middleName = document.getElementById('contactPersonMiddleName').value;
  const phone = document.getElementById('contactPersonPhone').value;

  const data = {
    CounterpartyRef: counterpartyRef,
    FirstName: firstName,
    LastName: lastName,
    MiddleName: middleName,
    Phone: phone
  };

  createContactPerson(data)
    .then(result => {
      console.log('Контактное лицо успешно создано:', result);
      $('#contactPersonModal').modal('hide');
    })
    .catch(error => {
      console.error('Ошибка создания контактного лица:', error);
    });
});

let firstContactPersonRef = '';

function getCounterpartyContactPersons(counterpartyRef) {
  const apiKey = API_KEY;
  const url = 'https://api.novaposhta.ua/v2.0/json/';

  const data = {
    apiKey: apiKey,
    modelName: 'Counterparty',
    calledMethod: 'getCounterpartyContactPersons',
    methodProperties: {
      Ref: counterpartyRef,
      Page: '1'
    }
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    if (result.success) {
      
      return result.data;
    } else {
      console.error('Ошибка получения контактных лиц контрагента:', result.errors);
      throw new Error(result.errors[0]);
    }
  });
}


// Функция для получения данных о контрагентах
async function getCounteragents(page, pageSize, searchName, searchPhone) {
  const url = new URL('/counteragents', window.location.origin);
  
  // Добавляем параметры запроса
  url.searchParams.append('page', page);
  url.searchParams.append('page_size', pageSize);
  
  if (searchName) {
    url.searchParams.append('search_name', searchName);
  }
  
  if (searchPhone) {
    url.searchParams.append('search_phone', searchPhone);
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching counteragents:', error);
    throw error;
  }
}

let currentRecipientPage = 1;
let totalRecipientPages = 1;

// Функция для загрузки контрагентов в выпадающий список
function loadCounteragents(searchName = '', searchPhone = '', page = 1, append = false) {
  return getCounteragents(page, 20, searchName, searchPhone)
    .then(data => {
      console.log(data);
      const counteragents = data.counteragents;
      totalRecipientPages = data.total_pages;
      const recipientList = document.getElementById('recipientList');

      if (!append) {
        recipientList.innerHTML = '';
      }

      // Добавляем контрагентов в выпадающий список получателя
      counteragents.forEach(counteragent => {
        const recipientItem = document.createElement('li');
        recipientItem.textContent = counteragent.name;
        recipientItem.dataset.ref = counteragent.ref;
        recipientItem.dataset.contactRef = counteragent.contact_ref;
        recipientList.appendChild(recipientItem);
      });

      return totalRecipientPages;
    })
    .catch(error => {
      console.error('Error loading counteragents:', error);
    });
}

// Обработчики событий для выпадающих списков
document.addEventListener('DOMContentLoaded', function() {
  const senderInput = document.getElementById('senderInput');
  const senderList = document.getElementById('senderList');
  const recipientInput = document.getElementById('recipientInput');
  const recipientList = document.getElementById('recipientList');

  // Обработчик прокрутки для загрузки новых страниц получателей
  recipientList.addEventListener('scroll', function() {
    if (this.scrollTop + this.clientHeight >= this.scrollHeight && currentRecipientPage < totalRecipientPages) {
      currentRecipientPage++;
      loadCounteragents('', '', currentRecipientPage, true);
    }
  });

  // Открытие выпадающего списка отправителя при фокусе на поле ввода
  senderInput.addEventListener('focus', function() {
    senderList.style.display = 'block';
  });

  // Открытие выпадающего списка получателя при фокусе на поле ввода
  recipientInput.addEventListener('focus', function() {
    recipientList.style.display = 'block';
  });


// Обработчик ввода текста в поле получателя
recipientInput.addEventListener('input', function() {
  const searchText = this.value;
  loadCounteragents(searchText,'')
    .then(() => {
      recipientList.style.display = 'block';
    });
});

// Выбор элемента из выпадающего списка отправителя
senderList.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    senderInput.value = event.target.textContent;
    senderInput.dataset.ref = event.target.dataset.ref;

    const counterpartyRef = event.target.dataset.ref;

    getCounterpartyContactPersons(counterpartyRef)
      .then(contactPersons => {
        if (contactPersons.length > 0) {
          const contactSenderRef = contactPersons[0].Ref;
          senderInput.dataset.contactRef = contactSenderRef;
          console.log('Ref контактного лица отправителя:', contactSenderRef);
        } else {
          senderInput.dataset.contactRef = '';
          console.log('У контрагента нет контактных лиц');
        }
      })
      .catch(error => {
        console.error('Ошибка получения контактных лиц контрагента:', error);
      });

    senderList.style.display = 'none';
  }
});

// Выбор элемента из выпадающего списка получателя
recipientList.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    recipientInput.value = event.target.textContent;
    recipientInput.dataset.ref = event.target.dataset.ref;
    recipientInput.dataset.contactRef = event.target.dataset.contactRef; // Сохраняем contact_ref в атрибуте
    console.log(recipientInput.dataset.contactRef);
    recipientList.style.display = 'none';
  }
});

  // Закрытие выпадающих списков при клике вне их
  document.addEventListener('click', function(event) {
    if (!senderInput.contains(event.target)) {
      senderList.style.display = 'none';
    }
    if (!recipientInput.contains(event.target)) {
      recipientList.style.display = 'none';
    }
  });
});

// Функция для получения данных о контрагентах отправителях
async function getCounterpartiesSenders(page, limit) {
  const url = 'https://api.novaposhta.ua/v2.0/json/';
  
  const data = {
    apiKey: API_KEY,
    modelName: 'Counterparty',
    calledMethod: 'getCounterparties',
    methodProperties: {
      CounterpartyProperty: 'Sender',
      Page: page.toString(),
      Limit: limit.toString()
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching counterparties senders:', error);
    throw error;
  }
}

// Функция для загрузки контрагентов отправителей в выпадающий список
function loadCounterpartiesSenders(page = 1, limit = 500) {
  getCounterpartiesSenders(page, limit)
    .then(data => {
      console.log(data);
      const senderList = document.getElementById('senderList');
      
      // Очищаем текущие опции в выпадающем списке
      senderList.innerHTML = '';

      // Добавляем контрагентов отправителей в выпадающий список
      data.forEach(sender => {
        const senderItem = document.createElement('li');
        senderItem.textContent = sender.Description;
        senderItem.dataset.ref = sender.Ref;
        senderList.appendChild(senderItem);
      });
    })
    .catch(error => {
      console.error('Error loading counterparties senders:', error);
    });
}

// Загружаем контрагентов отправителей при открытии модального окна
document.getElementById('createShipmentModal').addEventListener('show.bs.modal', () => {
  loadCounterpartiesSenders();
});


// Загружаем контрагентов при открытии модального окна
document.getElementById('createShipmentModal').addEventListener('show.bs.modal', () => {
  loadCounteragents();
});

// Функция для преобразования даты из формата "гггг-мм-дд" в "дд.мм.гггг"
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
}

// Обработчик отправки формы создания ТТН
document.getElementById('createShipmentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Получение значений полей формы
  const senderWarehouseIndex = senderWarehouseSearchInput.getAttribute('data-warehouse-index');
  const recipientWarehouseIndex = recipientWarehouseSearchInput.getAttribute('data-warehouse-index');
  const payerType = document.getElementById('payerType').value;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const dateTime = document.getElementById('dateTime').value;
  const formattedDateTime = formatDate(dateTime);
  const cargoType = 'Cargo';
  const weight = document.getElementById('weight').value;
  const serviceType = document.getElementById('serviceType').value;
  const seatsAmount = document.getElementById('seatsAmount').value;
  const description = document.getElementById('description').value;
  const cost = document.getElementById('cost').value;
  const citySender = senderCitySearchInput.getAttribute('data-ref');
  const cityRecipient = recipientCitySearchInput.getAttribute('data-ref');
  const sender = document.getElementById('senderInput').dataset.ref;
  const senderAddress = senderWarehouseSearchInput.getAttribute('data-ref');
  const recipientAddress = recipientWarehouseSearchInput.getAttribute('data-ref');
  const contactSender = document.getElementById('senderInput').dataset.contactRef; // Получаем реф контактного лица отправителя
  const sendersPhone = "0669693502";
  const recipient = document.getElementById('recipientInput').dataset.ref;
  const contactRecipient = document.getElementById('recipientInput').dataset.contactRef;
  const recipientsPhone = document.getElementById('recipientPhone').value;
  const ord_id = document.getElementById('ord_id').value;
  // Создание объекта с данными для отправки на сервер
  const data = {
    sender_warehouse_index: senderWarehouseIndex,
    recipient_warehouse_index: recipientWarehouseIndex,
    payer_type: payerType,
    payment_method: paymentMethod,
    date_time: formattedDateTime,
    cargo_type: cargoType,
    weight: weight,
    service_type: serviceType,
    seats_amount: seatsAmount,
    description: description,
    cost: cost,
    city_sender: citySender, 
    sender: sender, 
    sender_address: senderAddress, 
    contact_sender: contactSender, 
    senders_phone: sendersPhone,
    city_recipient: cityRecipient, 
    recipient: recipient, 
    recipient_address: recipientAddress, 
    contact_recipient: contactRecipient, 
    recipients_phone: recipientsPhone
  };
  console.log(data);
// Отправка POST-запроса на сервер для создания ТТН
fetch(`/create_internet_document/${ord_id}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => {
    console.log(data)
    console.log(ord_id)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    if (result.error) {
      // Обработка ошибок при создании ТТН
      console.error('Ошибка создания ТТН:', result.error);
    } else {
      // Обработка успешного создания ТТН
      console.log('ТТН успешно создана:', result);
      // Закрытие модального окна
      $('#createShipmentModal').modal('hide');
      // Обновление списка ТТН на странице (если необходимо)
      // ...
    }
  })
  .catch(error => {
    console.error('Ошибка отправки запроса:', error);
  });
});

let currentDeleteCounterpartyPage = 1;
let totalDeleteCounterpartyPages = 1;

// Обработчик клика на кнопку "Видалити контрагента"
$(document).on('click', '#deleteCounterparty', function() {
  $('#deleteCounterpartyModal').modal('show');
  currentDeleteCounterpartyPage = 1;
  loadCounterpartiesForDeletion();
});

// Функция для загрузки контрагентов в выпадающий список для удаления
function loadCounterpartiesForDeletion(searchName = '', searchPhone = '', page = 1, append = false) {
  return getCounteragents(page, 20, searchName, searchPhone)
    .then(data => {
      const counteragents = data.counteragents;
      totalDeleteCounterpartyPages = data.total_pages;
      const deleteCounterpartyList = document.getElementById('deleteCounterpartyList');

      if (!append) {
        deleteCounterpartyList.innerHTML = '';
      }

      counteragents.forEach(counteragent => {
        const deleteCounterpartyItem = document.createElement('li');
        deleteCounterpartyItem.textContent = counteragent.name;
        deleteCounterpartyItem.dataset.ref = counteragent.ref;
        deleteCounterpartyItem.dataset.id = counteragent.id;
        deleteCounterpartyList.appendChild(deleteCounterpartyItem);
      });

      return totalDeleteCounterpartyPages;
    })
    .catch(error => {
      console.error('Ошибка загрузки контрагентов для удаления:', error);
    });
}

// Обработчик клика на поле ввода контрагента для удаления
document.getElementById('deleteCounterpartyInput').addEventListener('click', function() {
  document.getElementById('deleteCounterpartyList').style.display = 'block';
  document.querySelector('#deleteCounterpartyModal .modal-body').style.height = '400px';
});

// Обработчик клика вне поля ввода и списка контрагентов для удаления
document.addEventListener('click', function(event) {
  const deleteCounterpartyInput = document.getElementById('deleteCounterpartyInput');
  const deleteCounterpartyList = document.getElementById('deleteCounterpartyList');

  if (!deleteCounterpartyInput.contains(event.target) && !deleteCounterpartyList.contains(event.target)) {
    deleteCounterpartyList.style.display = 'none';
    document.querySelector('#deleteCounterpartyModal .modal-body').style.height = 'auto';
  }
});

// Обработчик прокрутки для загрузки новых страниц контрагентов для удаления
document.getElementById('deleteCounterpartyList').addEventListener('scroll', function() {
  if (this.scrollTop + this.clientHeight >= this.scrollHeight && currentDeleteCounterpartyPage < totalDeleteCounterpartyPages) {
    currentDeleteCounterpartyPage++;
    loadCounterpartiesForDeletion('', '', currentDeleteCounterpartyPage, true);
  }
});

// Обработчик ввода текста в поле поиска контрагента для удаления
document.getElementById('deleteCounterpartyInput').addEventListener('input', function() {
  const searchText = this.value;
  currentDeleteCounterpartyPage = 1;
  loadCounterpartiesForDeletion(searchText, '');
  document.getElementById('deleteCounterpartyList').style.display = 'block';
});

// Обработчик выбора контрагента из списка для удаления
document.getElementById('deleteCounterpartyList').addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    document.getElementById('deleteCounterpartyInput').value = event.target.textContent;
    document.getElementById('deleteCounterpartyInput').dataset.ref = event.target.dataset.ref;
    document.getElementById('deleteCounterpartyInput').dataset.id = event.target.dataset.id;
    document.getElementById('deleteCounterpartyList').style.display = 'none';
  }
});

// Обработчик клика на кнопку "Видалити" в модальном окне удаления контрагента
$(document).on('click', '#deleteCounterpartyButton', function() {
  const counterpartyRef = document.getElementById('deleteCounterpartyInput').dataset.ref;
  const counterpartyId = document.getElementById('deleteCounterpartyInput').dataset.id;

  deleteCounterparty(counterpartyRef, counterpartyId)
    .then(() => {
      $('#deleteCounterpartyModal').modal('hide');
      loadCounteragents(); // Обновление списка контрагентов
    })
    .catch(error => {
      console.error('Ошибка удаления контрагента:', error);
    });
});

// Функция для удаления контрагента
function deleteCounterparty(counterpartyRef, counterpartyId) {
  return fetch(`/delete_counterparty/${counterpartyRef}/${counterpartyId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(result => {
      if (result.error) {
        throw new Error(result.error);
      } else {
        console.log('Контрагент успешно удален');
      }
    });
}