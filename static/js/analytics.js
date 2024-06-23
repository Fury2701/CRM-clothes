document.addEventListener('DOMContentLoaded', function() {
  const homeImgButton = document.querySelector('.home-img');

  homeImgButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/admin?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.offer-list-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/product?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.menu-list .offer-list-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/product?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListButton = document.querySelector('.menu-list #href-offer-list');

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



document.addEventListener('DOMContentLoaded', function() {
  displaySalesReport();
  displayTopSellers();
});

function displaySalesReport() {
  const salesReportData = JSON.parse(document.getElementById('sales-report').textContent);
  console.log(salesReportData);

  // Отображение данных отчета о продажах
  document.getElementById('averageSales').textContent = salesReportData[0].average_sales;
  document.getElementById('totalCustomers').textContent = salesReportData[0].total_customers;
  document.getElementById('totalItems').textContent = salesReportData[0].total_items;
  document.getElementById('totalOrders').textContent = salesReportData[0].total_orders;
  document.getElementById('totalSales').textContent = salesReportData[0].total_sales;
}


document.getElementById('getReportBtn').addEventListener('click', function() {
  const dateMin = document.getElementById('dateMin').value;
  const dateMax = document.getElementById('dateMax').value;

  if (dateMin && dateMax) {
      fetchSalesReportCustom(dateMin, dateMax);
  }
});

function fetchSalesReportCustom(dateMin, dateMax) {
  fetch(`/sales_report?date_min=${dateMin}&date_max=${dateMax}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
          displaySalesReportCustom(data);
      })
      .catch(error => {
          console.error('Error fetching custom sales report:', error);
      });
}

function displaySalesReportCustom(salesReportData) {
  document.getElementById('averageSalesCustom').textContent = salesReportData[0].average_sales;
  document.getElementById('totalCustomersCustom').textContent = salesReportData[0].total_customers;
  document.getElementById('totalItemsCustom').textContent = salesReportData[0].total_items;
  document.getElementById('totalOrdersCustom').textContent = salesReportData[0].total_orders;
  document.getElementById('totalSalesCustom').textContent = salesReportData[0].total_sales;
}


function displayTopSellers() {
  const topSellersData = JSON.parse(document.getElementById('top-sellers').textContent);
  console.log(topSellersData);

  // Отображение данных топ продаж
  for (let i = 0; i < 3; i++) {
      if (topSellersData[i]) {
          document.getElementById(`topSellerName${i + 1}`).textContent = topSellersData[i].name;
          document.getElementById(`topSellerQuantity${i + 1}`).textContent = topSellersData[i].quantity;
      } else {
          document.getElementById(`topSellerName${i + 1}`).textContent = '';
          document.getElementById(`topSellerQuantity${i + 1}`).textContent = '';
      }
  }
}

document.getElementById('getTopSellersBtn').addEventListener('click', function() {
  const dateMin = document.getElementById('dateMinTopSellers').value;
  const dateMax = document.getElementById('dateMaxTopSellers').value;

  if (dateMin && dateMax) {
      fetchTopSellersCustom(dateMin, dateMax);
  }
});

function fetchTopSellersCustom(dateMin, dateMax) {
  fetch(`/top_sellers?date_min=${dateMin}&date_max=${dateMax}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
          displayTopSellersCustom(data);
      })
      .catch(error => {
          console.error('Error fetching custom top sellers:', error);
      });
}

function displayTopSellersCustom(topSellersData) {
  for (let i = 0; i < 3; i++) {
      if (topSellersData[i]) {
          document.getElementById(`topSellerNameCustom${i + 1}`).textContent = topSellersData[i].title;
          document.getElementById(`topSellerQuantityCustom${i + 1}`).textContent = topSellersData[i].quantity;
      } else {
          document.getElementById(`topSellerNameCustom${i + 1}`).textContent = '';
          document.getElementById(`topSellerQuantityCustom${i + 1}`).textContent = '';
      }
  }
}

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
