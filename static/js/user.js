document.addEventListener('DOMContentLoaded', function() {
    const homeImgButton = document.querySelector('.home-img');
  
    homeImgButton.addEventListener('click', function(e) {
      e.preventDefault();
  
      window.location.href = '/admin?page=1';
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const userListImgButton = document.querySelector('.products-img');
  
    userListImgButton.addEventListener('click', function(e) {
      e.preventDefault();
  
      window.location.href = '/product?page=1';
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const userListImgButton = document.querySelector('.menu-list .products-img');
  
    userListImgButton.addEventListener('click', function(e) {
      e.preventDefault();
  
      window.location.href = '/product?page=1';
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const userListButton = document.querySelector('.menu-list #href-products');
  
    userListButton.addEventListener('click', function(e) {
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
  

  // Функция для загрузки пользователей с учетом параметров поиска и пагинации
  function loadUsers() {
    const url = `/user/all`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        populateUsersTable(data);
        // updatePagination(data.current_page, data.total_pages);
      })
      .catch(error => {
        console.error('Ошибка при загрузке пользователей:', error);
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

   function populateUsersTable(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '';
  
    users.forEach(user => {
      const row = document.createElement('tr');
      row.dataset.userId = user.id;
  
      const idCell = document.createElement('td');
      idCell.textContent = user.id;
      row.appendChild(idCell);
  
      const nameCell = document.createElement('td');
      nameCell.textContent = user.name;
      row.appendChild(nameCell);
  
      const loginCell = document.createElement('td');
      loginCell.textContent = user.login;
      row.appendChild(loginCell);
  
      const roleCell = document.createElement('td');
      roleCell.textContent = user.lvl === 1 ? 'Адміністратор' : 'Менеджер';
      row.appendChild(roleCell);
  
      const detailsCell = document.createElement('td');
      const detailsButton = document.createElement('button');
      detailsButton.id = 'details-button';
      detailsButton.classList.add('btn', 'btn-primary');
      detailsButton.textContent = 'Детальніше';
      detailsButton.dataset.userId = user.id;
      detailsButton.dataset.bsToggle = 'modal';
      detailsButton.dataset.bsTarget = '#userModal';
      detailsCell.appendChild(detailsButton);
      row.appendChild(detailsCell);
  
      tableBody.appendChild(row);
    });
  }

  $(document).on('click', '#details-button', function() {
    const userId = $(this).data('user-id');
    openUserModal(userId);
  });

  function openUserModal(userId) {
    fetch(`/user/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при получении данных о пользователе');
        }
        return response.json();
      })
      .then(userData => {
        // Заполнение модального окна данными о пользователе
        $('#userModalLabel').text(`${userData.name}`);
        $('#userModalLabel').data('user-id', userData.id);
        $('#editUserName').val(userData.name);
        $('#editUserLogin').val(userData.login);
        $('#editUserPassword').val(userData.password);
        $('#editUserRole').val(userData.lvl);
  
        // Открытие модального окна
        $('#userModal').modal('show');
      })
      .catch(error => {
        console.error('Ошибка при получении данных о пользователе:', error);
      });
  }

  $(document).on('click', '#togglePasswordBtn', function() {
    const passwordInput = $('#editUserPassword');
    const passwordFieldType = passwordInput.attr('type');
    
    if (passwordFieldType === 'password') {
      passwordInput.attr('type', 'text');
      $(this).html('<i class="bi bi-eye-slash"></i>');
    } else {
      passwordInput.attr('type', 'password');
      $(this).html('<i class="bi bi-eye"></i>');
    }
  });

  $(document).on('click', '#saveChangesBtn', function() {
    const userId = $('#userModalLabel').data('user-id');
    const name = $('#editUserName').val();
    const login = $('#editUserLogin').val();
    const password = $('#editUserPassword').val();
    const lvl = $('#editUserRole').val();
  
    const updatedData = {
      name: name,
      login: login,
      password: password,
      lvl: lvl
    };
  
    updateUser(userId, updatedData);
  });
  
  function updateUser(userId, data) {
    fetch(`/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при обновлении данных пользователя');
      }
      return response.json();
    })
    .then(result => {
      console.log('Данные пользователя успешно обновлены:', result);
      // Закрытие модального окна
      $('#userModal').modal('hide');
      // Обновление данных в таблице
      loadUsers();
    })
    .catch(error => {
      console.error('Ошибка при обновлении данных пользователя:', error);
      // Обработка ошибки
    });
  }

  $(document).on('click', '#create-user', function() {
    $('#createUserModal').modal('show');
  });

  $(document).on('click', '#createUserBtn', function() {
    const name = $('#createUserName').val();
    const login = $('#createUserLogin').val();
    const password = $('#createUserPassword').val();
    const lvl = $('#createUserRole').val();
  
    const data = {
      name: name,
      login: login,
      password: password,
      lvl: lvl
    };
  
    createUser(data);
  });


  function createUser(data) {
    fetch('/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при создании пользователя');
      }
      return response.json();
    })
    .then(result => {
      console.log('Пользователь успешно создан:', result);
      // Закрытие модального окна
      $('#createUserModal').modal('hide');
      // Сброс формы создания пользователя
      $('#createuserForm')[0].reset();
      // Обновление таблицы пользователей
      loadUsers();
    })
    .catch(error => {
      console.error('Ошибка при создании пользователя:', error);
      // Обработка ошибки
    });
    
  }


  $(document).on('click', '#deleteUserBtn', function() {
    const userId = $('#userModalLabel').data('user-id');
  
    if (confirm('Ви дійсно хочете видалити користувача?')) {
      deleteUser(userId);
    }
  });

  function deleteUser(userId) {
    fetch(`/user/${userId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Помилка при видаленні користувача');
        }
        return response.json();
      })
      .then(data => {
        console.log('Користувач успішно видалено:', data);
        // Закрыть модальное окно
        $('#userModal').modal('hide');
        // Обновить данные на странице после успешного удаления пользователя
        loadUsers();
      })
      .catch(error => {
        console.error('Помилка при видаленні користувача:', error);
      });
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

  
   $(document).ready(function() {   
    loadUsers();
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