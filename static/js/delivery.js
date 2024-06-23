
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
  const deliveryCity = senderCitySearchInput.dataset.deliveryCity;
  if (deliveryCity && senderWarehouseOptionsContainer.style.display === 'none') {
    searchWarehouses(deliveryCity, '', senderWarehouseOptionsContainer);
  } else {
    senderWarehouseOptionsContainer.style.display = 'none';
  }
});

recipientWarehouseSearchInput.addEventListener('click', function() {
  const deliveryCity = recipientCitySearchInput.dataset.deliveryCity;
  if (deliveryCity && recipientWarehouseOptionsContainer.style.display === 'none') {
    searchWarehouses(deliveryCity, '', recipientWarehouseOptionsContainer);
  } else {
    recipientWarehouseOptionsContainer.style.display = 'none';
  }
});

senderWarehouseSearchInput.addEventListener('input', function() {
  const deliveryCity = senderCitySearchInput.dataset.deliveryCity;
  const searchTerm = this.value;
  if (deliveryCity) {
    searchWarehouses(deliveryCity, searchTerm, senderWarehouseOptionsContainer);
  } else {
    senderWarehouseOptionsContainer.innerHTML = '';
    senderWarehouseOptionsContainer.style.display = 'none';
  }
});

recipientWarehouseSearchInput.addEventListener('input', function() {
  const deliveryCity = recipientCitySearchInput.dataset.deliveryCity;
  const searchTerm = this.value;
  if (deliveryCity) {
    searchWarehouses(deliveryCity, searchTerm, recipientWarehouseOptionsContainer);
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

function searchWarehouses(deliveryCity, searchTerm, optionsContainer) {
  console.log('searchWarehouses - deliveryCity:', deliveryCity);
  console.log('searchWarehouses - searchTerm:', searchTerm);

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
      CityRef: deliveryCity,
      FindByString: searchTerm
    }
  };

  fetch(url, {
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
    .then(data => {
      if (data.success) {
        const warehouses = data.data;
        console.log('Полученные отделения:', warehouses);
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
      
        loadTTNsForTable();
        
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
  const cargoType = 'Parcel';
  const weight = document.getElementById('weight').value;
  const serviceType = document.getElementById('serviceType').value;
  const seatsAmount = document.getElementById('seatsAmount').value;
  const description = document.getElementById('description').value;
  const cost = document.getElementById('cost').value;
  const citySender = senderCitySearchInput.getAttribute('data-ref');
  const sender = document.getElementById('senderInput').dataset.ref;
  const senderAddress = senderWarehouseSearchInput.getAttribute('data-ref');
  const contactSender = document.getElementById('senderInput').dataset.contactRef;
  const sendersPhone = document.getElementById('senderPhone').value;
  const cityRecipient = recipientCitySearchInput.getAttribute('data-ref');
  const recipient = document.getElementById('recipientInput').dataset.ref;
  const recipientAddress = recipientWarehouseSearchInput.getAttribute('data-ref');
  const contactRecipient = document.getElementById('recipientInput').dataset.contactRef;
  const recipientsPhone = document.getElementById('recipientPhone').value;
  const ord_id = document.getElementById('ord_id').value;
  const AfterpaymentOnGoodsCost = document.getElementById('afterpaymentOnGoodsCost').value;

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

// Добавление свойства afterpayment_ongoodscost только если значение не пустое
if (AfterpaymentOnGoodsCost) {
  data.afterpayment_ongoodscost = AfterpaymentOnGoodsCost;
}
  // Добавление параметров для каждого места отправления в объект data
  const seatsOptions = document.querySelectorAll('.seat-options');

  // Флаг для проверки наличия пустых полей
  let hasEmptyFields = false;

  seatsOptions.forEach((seatOptions, index) => {
    const volumetricVolume = seatOptions.querySelector('.volumetric-volume').value;
    const volumetricWidth = seatOptions.querySelector('.volumetric-width').value;
    const volumetricLength = seatOptions.querySelector('.volumetric-length').value;
    const volumetricHeight = seatOptions.querySelector('.volumetric-height').value;
    const weight = seatOptions.querySelector('.weight').value;

    // Проверка наличия пустых полей
    if (!volumetricVolume || !volumetricWidth || !volumetricLength || !volumetricHeight || !weight) {
      hasEmptyFields = true;
      return;
    }

    // Если все поля заполнены, добавляем объект в массив OptionsSeat
    if (!data.options_seat) {
      data.options_seat = [];
    }

    data.options_seat.push({
      volumetricVolume: volumetricVolume,
      volumetricWidth: volumetricWidth,
      volumetricLength: volumetricLength,
      volumetricHeight: volumetricHeight,
      weight: weight
    });
  });

  // Если есть пустые поля, удаляем свойство OptionsSeat из объекта data
  if (hasEmptyFields) {
    delete data.options_seat;
  }

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
      
      console.error('Ошибка создания ТТН:', result.error);
     
      
      // Обновление списка ТТН на странице (если необходимо)
    } else {
      $('#createShipmentModal').modal('hide');
      console.log('ТТН успешно создана:', result.data);
    }
  })
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

function delivery_data() {
  const url = '/delivery_data';

  const params = new URLSearchParams({
    page: 1,
    order_by: 'date',
    order: 'desc',
    search_ord_id: 123
  });

  fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Обработка полученных данных
      const entries = data.entries;
      const totalPages = data.total_pages;
      const currentPage = data.current_page;

      // Очистка таблицы перед заполнением новыми данными
      const tableBody = document.querySelector('#shipmentsTable tbody');
      tableBody.innerHTML = '';

      // Заполнение таблицы полученными данными
      entries.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td data-ttn-ref="${entry.ttn_ref}">${entry.ttn_id}</td>
          <td>${entry.ord_id}</td>
          <td>${entry.client_name}</td>
          <td>${formatDate(entry.date)}</td>
          <td><a class="details" href="#">Детальніше</a></td>
        `;
        tableBody.appendChild(row);
        updatePagination(data.current_page, data.total_pages);
      });
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
}

// Функция для форматирования даты
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Обработчик клика на кнопку "Створити доставку"
document.getElementById("print-ttn").addEventListener("click", function() {
  // Отримуємо модальне вікно за його id
  var modal = new bootstrap.Modal(document.getElementById("print-ttn-modal"));
  
  modal.show();
});

$('#print-ttn-modal').on('shown.bs.modal', function () {
  const selectedOption = document.getElementById('doc_type').value;
  const printButton = document.getElementById('printTTN');

  if (selectedOption === 'ttnFull') {
    printButton.onclick = function() {
      const selectedTTN = document.getElementById('ttnSearch').value;
      if (selectedTTN) {
        printTTN(selectedTTN);
        $('#print-ttn-modal').modal('hide');
      }
    };
  } else if (selectedOption === 'ttnMark') {
    printButton.onclick = function() {
      const selectedTTN = document.getElementById('ttnSearch').value;
      if (selectedTTN) {
        printMarking(selectedTTN);
        $('#print-ttn-modal').modal('hide');
      }
    };
  }
});

  let currentTTNPage = 1;
  let totalTTNPages = 1;
  
  // Функция для получения данных о доставках
  async function getDeliveryData(page, orderId) {
    const url = `/delivery_data?page=${page}&search_value=${orderId}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching delivery data:', error);
      throw error;
    }
  }
  
// Функция для загрузки ТТН в выпадающий список
function loadTTNs(orderId = '', page = 1, append = false) {
  return getDeliveryData(page, orderId)
    .then(data => {
      const entries = data.entries;
      totalTTNPages = data.total_pages;
      const ttnList = document.getElementById('ttnList');

      if (!append) {
        ttnList.innerHTML = '';
      }

      entries.forEach(entry => {
        const ttnItem = document.createElement('li');
        const dateObj = new Date(entry.date.split(' ')[0]); // Создаем объект Date из части строки даты без времени
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getFullYear()}`; // Форматируем дату в формате "дд.мм.гггг"
        ttnItem.textContent = `ТТН: ${entry.ttn_id}, Замовлення: ${entry.ord_id}, Дата: ${formattedDate}`;
        ttnItem.dataset.ttnRef = entry.ttn_id; // Сохраняем ttnRef вместо ttnId
        ttnList.appendChild(ttnItem);
      });

      return totalTTNPages;
    })
    .catch(error => {
      console.error('Error loading TTNs:', error);
    });
}
  
  // Обработчик открытия модального окна
  $('#print-ttn-modal').on('show.bs.modal', function () {
    currentTTNPage = 1;
    loadTTNs();
  });
  
  // Обработчик клика на поле ввода поиска ТТН
  document.getElementById('ttnSearch').addEventListener('click', function() {
    document.getElementById('ttnList').style.display = 'block';
  });
  
  // Обработчик клика вне поля ввода и списка ТТН
  document.addEventListener('click', function(event) {
    const ttnSearch = document.getElementById('ttnSearch');
    const ttnList = document.getElementById('ttnList');
  
    if (!ttnSearch.contains(event.target) && !ttnList.contains(event.target)) {
      ttnList.style.display = 'none';
    }
  });
  
  // Обработчик прокрутки для загрузки новых страниц ТТН
  document.getElementById('ttnList').addEventListener('scroll', function() {
    if (this.scrollTop + this.clientHeight >= this.scrollHeight && currentTTNPage < totalTTNPages) {
      currentTTNPage++;
      loadTTNs('', currentTTNPage, true);
    }
  });
  
  // Обработчик ввода текста в поле поиска ТТН
  document.getElementById('ttnSearch').addEventListener('input', function() {
    const orderId = this.value;
    currentTTNPage = 1;
    loadTTNs(orderId);
  });
  
// Обработчик выбора ТТН из списка
document.getElementById('ttnList').addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    const selectedTTNRef = event.target.dataset.ttnRef;
    document.getElementById('ttnSearch').value = selectedTTNRef;
    document.getElementById('ttnList').style.display = 'none';
  }
});
  
// Обработчик клика на кнопку "Отримати для друку"
document.getElementById('printTTN').addEventListener('click', function() {
// Обработчик изменения значения селекта #doc_type
document.getElementById('doc_type').addEventListener('change', function() {
  const selectedOption = this.value;
  const printButton = document.getElementById('printTTN');

  if (selectedOption === 'ttnFull') {
    printButton.onclick = function() {
      const selectedTTN = document.getElementById('ttnSearch').value;
      if (selectedTTN) {
        printTTN(selectedTTN);
        $('#print-ttn-modal').modal('hide');
      }
    };
  } else if (selectedOption === 'ttnMark') {
    printButton.onclick = function() {
      const selectedTTN = document.getElementById('ttnSearch').value;
      if (selectedTTN) {
        printMarking(selectedTTN);
        $('#print-ttn-modal').modal('hide');
      }
    };
  }
});
});

// Обработчик изменения значения селекта #doc_type
document.getElementById('doc_type').addEventListener('change', function() {
  const selectedOption = this.value;
  const printButton = document.getElementById('printTTN');

  if (selectedOption === 'ttnFull') {
    printButton.onclick = function() {
      const selectedTTN = document.getElementById('ttnSearch').value;
      if (selectedTTN) {
        printTTN(selectedTTN);
        $('#print-ttn-modal').modal('hide');
      }
    };
  } else if (selectedOption === 'ttnMark') {
    printButton.onclick = function() {
      const selectedTTN = document.getElementById('ttnSearch').value;
      if (selectedTTN) {
        printMarking(selectedTTN);
        $('#print-ttn-modal').modal('hide');
      }
    };
  }
});

// Функция для печати ТТН
function printTTN(ttnRef) {
  const apiKey = API_KEY;
  const printUrl = `https://my.novaposhta.ua/orders/printDocument/orders[]/${ttnRef}/type/pdf/apiKey/${apiKey}`;
  window.open(printUrl, '_blank');
}

// Функция для печати маркування
function printMarking(ttnRef) {
  const apiKey = API_KEY;
  const printUrl = `https://my.novaposhta.ua/orders/printMarking85x85/orders[]/${ttnRef}/type/pdf8/apiKey/${apiKey}`;
  window.open(printUrl, '_blank');
}


// Очистка полей ввода при открытии модального окна создания доставки
$('#createShipmentModal').on('show.bs.modal', function () {
  $('#createShipmentForm')[0].reset();
});

// Очистка полей ввода при открытии модального окна создания контактного лица
$('#contactPersonModal').on('show.bs.modal', function () {
  $('#createContactPersonForm')[0].reset();
});

// Очистка полей ввода при открытии модального окна создания контрагента
$('#counterpartyModal').on('show.bs.modal', function () {
  $('#counterpartyModal form')[0].reset();
});

// Очистка полей ввода при открытии модального окна удаления контрагента
$('#deleteCounterpartyModal').on('show.bs.modal', function () {
  $('#deleteCounterpartyInput').val('');
});

// Очистка полей ввода при открытии модального окна печати ТТН
$('#print-ttn-modal').on('show.bs.modal', function () {
  $('#ttnSearch').val('');
});

function loadTTNsForTable(ttnId = '', page = 1) {
  return getDeliveryData(page, ttnId)
    .then(data => {
      const entries = data.entries;
      totalTTNPages = data.total_pages;
      const tableBody = document.querySelector('#shipmentsTable tbody');

      tableBody.innerHTML = '';

      entries.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td data-ttn-ref="${entry.ttn_ref}">${entry.ttn_id}</td>
          <td>${entry.ord_id}</td>
          <td>${entry.client_name}</td>
          <td>${formatDate(entry.date)}</td>
          <td><a class="details" href="#">Детальніше</a></td>
        `;
        tableBody.appendChild(row);
      });

      return TablecurrentTTNPage;
    })
    .catch(error => {
      console.error('Error loading TTNs:', error);
    });
}
let client_name;
let TablecurrentTTNPage = 1;
// Обработчик клика на кнопку поиска
document.getElementById('searchButton').addEventListener('click', function() {
  const ttnId = document.getElementById('searchInput').value;
  TablecurrentTTNPage = 1;
  loadTTNsForTable(ttnId);
});

// Обработчик ввода текста в поле поиска ТТН
document.getElementById('searchInput').addEventListener('input', function() {
  const ttnId = this.value;
  TablecurrentTTNPage = 1;
  loadTTNsForTable(ttnId);
});



$(document).on('click', '.details', function() {
  const row = $(this).closest('tr');
  const ttnId = row.find('td:first-child').text();
  const ordId = row.find('td:nth-child(2)').text();
  client_name = row.find('td:nth-child(3)').text();
  const ttnRef = row.find('td:first-child').attr('data-ttn-ref');
  const modal = document.querySelector('#shipmentModal');
  modal.setAttribute('data-ttn-ref', ttnRef);
  console.log('ttn-ref', ttnRef);
  
  const data = [
    {
      DocumentNumber: ttnId,
      Phone: '' // Додайте номер телефону, якщо потрібно
    }
  ];

  fetch('/nova_tracking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.error) {
        console.error('Помилка трекінгу посилки:', result.error);
        // Обробка помилки
      } else {
        console.log('Результат трекінгу посилки:', result);
        
        // Заповнення заголовку модального вікна
        const modalTitle = document.querySelector('#shipmentModal .modal-title');
        modalTitle.innerHTML = `ТТН: ${ttnId} Замовлення №${ordId}`;
        
        // Відображення результату трекінгу посилки
        displayShipmentInfo(result);
      }
    })
    .catch(error => {
      console.error('Помилка запиту:', error);
      // Обробка помилки
    });
});

let ttnNumber = '';
function displayShipmentInfo(shipmentInfo, ttnRef) {
  // Перевірка, чи shipmentInfo є масивом
  if (Array.isArray(shipmentInfo) && shipmentInfo.length > 0) {
    // Використовуємо перший елемент масиву
    const shipment = shipmentInfo[0];

    const modalBody = document.querySelector('#shipmentModal .modal-body');
    ttnNumber=shipment.Number;
    // Очистка попереднього вмісту модального вікна
    modalBody.innerHTML = '';

    // Створення груп інформації
    const generalInfo = document.createElement('div');
    const recipientInfo = document.createElement('div');
    const senderInfo = document.createElement('div');

// Заповнення загальної інформації
let afterpaymentInfo;
if (shipment.AfterpaymentOnGoodsCost) {
   afterpaymentInfo = `<p><strong>Наложений платіж:</strong> ${shipment.AfterpaymentOnGoodsCost} грн</p>`;
} else {
   afterpaymentInfo = '<p><strong>Наложений платіж:</strong> Відсутній</p>';
}

let payerType;
if (shipment.PayerType === "Sender") {
   payerType = "Відправник";
} else if (shipment.PayerType === "Recipient") {
   payerType = "Одержувач";
} else {
   payerType = shipment.PayerType;
}

generalInfo.innerHTML = `
 <h4>Загальна інформація</h4>
 <p><strong>Статус:</strong> ${shipment.Status}</p>
 <p><strong>Платник доставки:</strong> ${payerType}</p>
 <p><strong>Вартість доставки:</strong> ${shipment.DocumentCost} грн</p>
 ${afterpaymentInfo}
 <p><strong>Вага відправлення:</strong> ${shipment.DocumentWeight} кг</p>
 <p><strong>Дата створення:</strong> ${shipment.DateCreated}</p>
`;

    // Заповнення інформації про одержувача
    recipientInfo.innerHTML = `
      <h4>Інформація про одержувача</h4>
      <p><strong>Одержувач:</strong> ${client_name}</p>
      <p><strong>Місто одержувача:</strong> ${shipment.CityRecipient}</p>
      <p><strong>Відділення одержувача:</strong> ${shipment.WarehouseRecipient}</p>
    `;

    // Заповнення інформації про відправника
    senderInfo.innerHTML = `
      <h4>Інформація про відправника</h4>
      <p><strong>Місто відправника:</strong> ${shipment.CitySender}</p>
      <p><strong>Відділення відправника:</strong> ${shipment.WarehouseSender}</p>
    `;

    // Додавання груп інформації до модального вікна
    modalBody.appendChild(generalInfo);
    modalBody.appendChild(recipientInfo);
    modalBody.appendChild(senderInfo);

    // Відкриття модального вікна
    $('#shipmentModal').modal('show');
  } else {
    console.error('Неправильний формат даних про посилку');
  }
}

// Обработчик события click для кнопки "Видалити"
$(document).on('click', '#deleteTTNButton', function() {
  const ttnId = document.querySelector('#shipmentModal .modal-title').textContent.split('ТТН: ')[1].split(' ')[0];
  const modal = document.querySelector('#shipmentModal');
  const ttnRef = modal.getAttribute('data-ttn-ref');
  console.log(ttnRef);
  if (confirm(`Ви дійсно хочете видалити ТТН ${ttnId}?`)) {
    deleteTTN(ttnRef);
  }
});

// Функция для удаления ТТН
function deleteTTN(ttnId) {
  const data = {
    document_refs: [ttnId]
  };

  fetch('/delete_internet_document', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        console.log('ТТН успішно видалено');
        // Обновление таблицы на странице
        delivery_data();
        // Закрытие модального окна
        $('#shipmentModal').modal('hide');
      } else {
        console.error('Помилка видалення ТТН:', result.error);
        // Обработка ошибки
      }
    })
    .catch(error => {
      console.error('Помилка запиту:', error);
      // Обработка ошибки
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
  delivery_data(page, searchQuery);
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


$(document).ready(function() {
  
delivery_data();

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