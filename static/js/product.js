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


  let currentPage = 1

// Функция для загрузки товаров
function loadProducts(page = currentPage) {
  fetch(`/data_products?page=${page}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      populateProductsTable(data.products);
      updatePagination(data.current_page, data.total_pages);
      currentPage = data.current_page; // Обновляем текущую страницу
    })
    .catch(error => {
      console.error('Ошибка при загрузке заказов:', error);
    });
}

function loadProductsByName(page = 1, prodName = '') {
  
  const url = `/data_products?page=${page}${prodName ? '&name=' + encodeURIComponent(prodName) : ''}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Очистить существующие строки в таблице
      $('#productsTable tbody').empty();

      // Заполнить таблицу данными из ответа сервера
      
      populateProductsTable(data.products);
      // Обновить пагинацию
      updatePagination(data.current_page, data.total_pages);
    })
    .catch(error => {
      console.error('Ошибка при загрузке заказов:', error);
    });
}

// Обработчик изменения выбранной категории
document.getElementById('categoryFilter').addEventListener('change', function() {
  const selectedCategoryId = this.value;

  if (selectedCategoryId === '') {
    // Если выбрана опция "Товари по всім категоріям", вызываем функцию loadProducts(1)
    loadProducts(1);
  } else {
    // Иначе, загружаем товары по выбранной категории
    loadProductsByCategory(1, selectedCategoryId);
  }
});

function loadProductsByCategory(page = 1, categoryId) {
  const url = `/data_products?page=${page}&category=${categoryId}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Очистить существующие строки в таблице
      $('#productsTable tbody').empty();
      // Заполнить таблицу данными из ответа сервера
      populateProductsTable(data.products);
      // Обновить пагинацию
      updatePagination(data.current_page, data.total_pages);
    })
    .catch(error => {
      console.error('Ошибка при загрузке товаров:', error);
    });
}

// Обработчик клика по кнопке поиска
document.getElementById('searchButton').addEventListener('click', function() {
  const prodName = document.getElementById('searchInput').value;
  loadProductsByName(1,prodName); // Загружаем первую страницу результатов поиска
});

// Обработчик нажатия клавиши Enter в поле ввода поиска
document.getElementById('searchInput').addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    const prodName = document.getElementById('searchInput').value.trim();
    
      loadProductsByName(1, prodName); // Загружаем первую страницу результатов поиска
  
  }
});

// Функция для загрузки категорий
function loadCategories() {
  // Отправка запроса на получение категорий
  fetch('/category')
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при получении категорий');
      }
      return response.json();
    })
    .then(categoryJson => {
      const categories = JSON.parse(categoryJson);
      console.log(categories);
      
      // Очистка списка категорий перед заполнением
      $('#categoryFilter').empty();

      // Добавление опции "Товари по всім категоріям"
      const allCategoriesOption = $('<option>').attr('value', '').text('Товари по всім категоріям');
      $('#categoryFilter').append(allCategoriesOption);

      // Добавление опций категорий в выпадающий список
      categories.forEach(category => {
        const option = $('<option>').attr('value', category.id).text(category.name);
        $('#categoryFilter').append(option);
      });

    })
    .catch(error => {
      console.error('Ошибка при получении категорий:', error);
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

// Обработчик клика по ссылке пагинации
$(document).on('click', '.pagination .page-link', function(e) {
  e.preventDefault();
  const page = $(this).data('page');
  loadProducts(page);
});     

function populateProductsTable(products) {
  const tableBody = document.querySelector('#productsTable tbody');
  tableBody.innerHTML = '';
 
  products.forEach(product => {
    const row = document.createElement('tr');
    row.dataset.productId = product.id;
 
    const imageCell = document.createElement('td');
    const imageElement = document.createElement('img');
    if (product.images && product.images.length > 0) {
      imageElement.src = product.images[0].src;
      imageElement.alt = product.images[0].alt;
    }
    imageElement.width = 75;
    imageElement.height = 75;
    imageCell.appendChild(imageElement);
    row.appendChild(imageCell);
 
    const nameCell = document.createElement('td');
    const nameLink = document.createElement('a');
    nameLink.href = '#';
    nameLink.textContent = product.name;
    nameLink.dataset.productId = product.id;
    nameLink.dataset.bsToggle = 'modal';
    nameLink.dataset.bsTarget = '#productModal';
    nameCell.appendChild(nameLink);
    row.appendChild(nameCell);
 
    const priceCell = document.createElement('td');
    priceCell.textContent = product.price;
    row.appendChild(priceCell);
 
    const categoryCell = document.createElement('td');
    if (product.categories && product.categories.length > 0) {
      const categoryNames = product.categories.map(category => category.name);
      categoryCell.innerHTML = categoryNames.join('<br>');
    }
    row.appendChild(categoryCell);
 
    const quantityCell = document.createElement('td');
    if (product.stock_status === 'instock') {
      if (product.manage_stock && product.stock_quantity !== null) {
        quantityCell.textContent = `В наявності (${product.stock_quantity} шт.)`;
      } else {
        quantityCell.textContent = 'В наявності';
      }
    } else if (product.stock_status === 'outofstock') {
      quantityCell.textContent = 'Немає в наявності';
    } else {
      quantityCell.textContent = '-';
    }
    row.appendChild(quantityCell);
 
    tableBody.appendChild(row);
  });
 }
 
 function openProductModal(productId) {
  fetch(`/productbyid?id=${productId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при получении данных о товаре');
      }
      return response.json();
    })
    .then(productJson => {
      const product = JSON.parse(productJson);
      // Заполнение модального окна данными о товаре
      $('#productModalLabel').text(product.name);
      $('#productModalLabel').data('product-id', product.id);

      // Очистка таблицы перед заполнением
      $('#inProduct-table tbody').empty();

      // Создание строки таблицы с информацией о товаре
      const row = $('<tr>');

      // Добавление ячейки с изображением товара
      const imageCell = $('<td>');
      if (product.images && product.images.length > 0) {
        const image = $('<img>').attr('src', product.images[0].src).attr('alt', product.name).attr('width', '70').attr('height', '70');
        imageCell.append(image);
      }
      row.append(imageCell);

      // Добавление ячейки с названием товара (поле ввода)
      const nameCell = $('<td>');
      const nameInput = $('<textarea>').addClass('form-control').attr('id', 'productName').attr('rows', '3');
      nameInput.val(product.name); // Установка значения названия товара
      nameCell.append(nameInput);
      row.append(nameCell);

      // Добавление ячейки с наличием товара (селект с опциями)
      const availabilityCell = $('<td>');
      const availabilitySelect = $('<select>').addClass('form-select').attr('id', 'productAvailability');
      const inStockOption = $('<option>').attr('value', 'instock').text('В наявності');
      const outOfStockOption = $('<option>').attr('value', 'outofstock').text('Не в наявності');
      availabilitySelect.append(inStockOption, outOfStockOption);
      availabilitySelect.val(product.stock_status);
      availabilityCell.append(availabilitySelect);
      row.append(availabilityCell);

      // Добавление ячейки с ценой товара (поле ввода)
      const priceCell = $('<td>');
      const priceInput = $('<input>').attr('type', 'number').attr('step', '0.1').addClass('form-control').attr('id', 'productPrice');
      priceInput.val(product.price); // Установка значения цены
      priceCell.append(priceInput);
      row.append(priceCell);

      // Добавление ячейки с категорией товара
      const categoryCell = $('<td>');
      if (product.categories && product.categories.length > 0) {
        const categoryNames = product.categories.map(category => category.name);
        categoryCell.text(categoryNames.join(', '));
      }
      row.append(categoryCell);

      // Добавление строки в таблицу
      $('#inProduct-table tbody').append(row);

updateAttributeList(product.attributes);

// Функция для обновления списка атрибутов
function updateAttributeList(attributes) {
  $('#productAttributesList').empty();

  if (attributes && attributes.length > 0) {
    attributes.forEach(attribute => {
      const listItem = $('<li>');
      listItem.text(`${attribute.name}: ${attribute.options.join(', ')}`);

      const deleteButton = $('<span>').text(' x ').addClass('delete-attribute');
      deleteButton.on('click', function() {
        const index = attributes.indexOf(attribute);
        if (index > -1) {
          attributes.splice(index, 1);
        }

        updateAttributeList(attributes);
      });

      listItem.append(deleteButton);
      $('#productAttributesList').append(listItem);
    });
  } else {
    const listItem = $('<li>').text('Атрибуты не указаны');
    $('#productAttributesList').append(listItem);
  }
}


      // Очистка галереи изображений перед заполнением
      $('#productImagesGallery').empty();

      // Проверка наличия изображений товара
      if (product.images && product.images.length > 0) {
        // Создание элементов изображений для каждого изображения товара
        product.images.forEach(image => {
          const imageLink = $('<a>').attr('href', image.src).attr('data-fancybox', 'product-images');
          const imageElement = $('<img>').attr('src', image.src).attr('alt', product.name);
          imageLink.append(imageElement);
          $('#productImagesGallery').append(imageLink);
        });
      } else {
        // Если изображения отсутствуют, вывести сообщение
        const noImagesMessage = $('<p>').text('Изображения не доступны');
        $('#productImagesGallery').append(noImagesMessage);
      }

      // Инициализация Fancybox для текущего модального окна
      Fancybox.bind("#productImagesGallery [data-fancybox]", {
        on: {
          closing: (fancybox) => {
            // Событие закрытия Fancybox
            fancybox.destroy(); // Уничтожить текущий экземпляр Fancybox
            $('#productModal').modal('show'); // Открыть модальное окно
          }
        }
      });

      $('#productDescriptionText').html(product.description);

      // Открытие модального окна
      $('#productModal').modal('show');
    })
    .catch(error => {
      console.error('Ошибка при получении данных о товаре:', error);
    });
}



// Обработчик события клика на название товара
$(document).on('click', '#productsTable tbody tr td:nth-child(2) a', function(event) {
  event.preventDefault();
  const productId = $(this).data('product-id');
  openProductModal(productId);
});

// Обработчик клика на изображения в модальном окне
$(document).on('click', '#productImagesGallery img', function() {
  $('#productModal').modal('hide');
});

function updateProduct(productId, data) {
  fetch('/update_product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: productId,
      ...data
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при обновлении товара');
    }
    return response.json();
  })
  .then(result => {
    console.log('Товар успешно обновлен:', result);
    // Дополнительные действия после успешного обновления товара
    $('#productModal').modal('hide');
    loadProducts(currentPage);
  })
  .catch(error => {
    console.error('Ошибка при обновлении товара:', error);
    // Обработка ошибки
  });
}

let price = ''; // Объявляем переменную price вне обработчика события

// Обработчик события input для поля ввода цены
$(document).on('input', '#productPrice', function() {
  price = $(this).val(); // Присваиваем значение переменной price внутри обработчика
  
});
let pname = '';
// Обработчик события input для поля ввода цены
$(document).on('input', '#productName', function() {
  pname = $(this).val(); // Присваиваем значение переменной price внутри обработчика
  
});

// Обработчик клика на кнопку "Зберегти"
$(document).on('click', '#saveChangesBtn', function() {
  const productId = $('#productModalLabel').data('product-id');
  const availability = $('#productAvailability').val();
  const price = $('#productPrice').val();
  const pname = $('#productName').val();
  const description = $('#productDescription').val();

  const updatedData = {
    stock_status: availability
  };

  // Проверка наличия значения цены
  if (price) {
    updatedData.regular_price = price.toString();
  }

  // Проверка наличия значения названия товара
  if (pname) {
    updatedData.name = pname;
  }

  // Проверка наличия значения описания товара
  if (description) {
    updatedData.description = description;
  }

  // Получение обновленных атрибутов из списка атрибутов
  const updatedAttributes = getUpdatedAttributes();
  updatedData.attributes = updatedAttributes;

  updateProduct(productId, updatedData);
});

// Функция для получения обновленных атрибутов из списка атрибутов
function getUpdatedAttributes() {
  const attributes = [];

  $('#productAttributesList li').each(function() {
    const attributeText = $(this).clone().children().remove().end().text().trim();
    const [name, options] = attributeText.split(': ');
    const attribute = {
      name: name,
      options: options.split(', ')
    };
    attributes.push(attribute);
  });

  return attributes;
}

// Обработчик клика на кнопку "Додати атрибут"
$(document).on('click', '#addAtributeBtn', function() {
  // Показать модальное окно для добавления категории
  $('#addAtributeModal').modal('show');
});

// Обработчик клика на кнопку "Зберегти" в модальном окне добавления атрибута
$(document).on('click', '#saveCategoryBtn', function() {
  const productId = $('#productModalLabel').data('product-id');
  const attributeName = $('#atributeName').val();
  const attributeDescription = $('#atributeDescription').val();

  // Создание объекта атрибута
  const newAttribute = {
    name: attributeName,
    options: [attributeDescription]
  };

  // Получение существующих атрибутов товара
  fetch(`/productbyid?id=${productId}`)
    .then(response => response.json())
    .then(productJson => {
      const product = JSON.parse(productJson);
      const existingAttributes = product.attributes || [];

      // Добавление нового атрибута к существующим атрибутам
      const updatedAttributes = [...existingAttributes, newAttribute];

      // Вызов функции updateProduct с обновленными атрибутами
      updateProduct(productId, { attributes: updatedAttributes });

      // Закрытие модального окна
      $('#addAtributeModal').modal('hide');
    })
    .catch(error => {
      console.error('Ошибка при получении данных о товаре:', error);
    });
});

// Обработчик клика на кнопку "Додати зображення"
$(document).on('click', '#addImgBtn', function() {
  $('#addImageModal').modal('show');
});
// Обработчик клика на кнопку "Зберегти" в модальном окне добавления изображения
$(document).on('click', '#addImageSaveBtn', function() {
  const productId = $('#productModalLabel').data('product-id');
  const imageFile = $('#imageFile')[0].files[0];

  if (imageFile) {
    const formData = new FormData();
    formData.append('id', productId);
    formData.append('imageFile', imageFile);

    fetch('/update_product', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при добавлении изображения');
      }
      return response.json();
    })
    .then(result => {
      console.log('Изображение успешно добавлено:', result);
      // Закрытие модального окна
      $('#addImageModal').modal('hide');
      // Обновление списка изображений товара
      updateProductImages(productId);
    })
    .catch(error => {
      console.error('Ошибка при добавлении изображения:', error);
      // Обработка ошибки
    });
  }
});

function updateProductImages(productId) {
  fetch(`/productbyid?id=${productId}`)
    .then(response => response.json())
    .then(productJson => {
      const product = JSON.parse(productJson);
      
      // Очистка галереи изображений перед заполнением
      $('#productImagesGallery').empty();

      // Проверка наличия изображений товара
      if (product.images && product.images.length > 0) {
        // Создание элементов изображений для каждого изображения товара
        product.images.forEach(image => {
          const imageLink = $('<a>').attr('href', image.src).attr('data-fancybox', 'product-images');
          const imageElement = $('<img>').attr('src', image.src).attr('alt', product.name);
          imageLink.append(imageElement);
          $('#productImagesGallery').append(imageLink);
        });
      } else {
        // Если изображения отсутствуют, вывести сообщение
        const noImagesMessage = $('<p>').text('Изображения не доступны');
        $('#productImagesGallery').append(noImagesMessage);
      }

      // Инициализация Fancybox для обновленной галереи изображений
      Fancybox.bind("#productImagesGallery [data-fancybox]", {
        // Опции Fancybox
      });
    })
    .catch(error => {
      console.error('Ошибка при получении данных о товаре:', error);
    });
}

// Обработчик клика на кнопку "Создать товар"
$(document).on('click', '#create-product', function() {
  // Отправка запроса на получение категорий
  fetch('/category')
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при получении категорий');
      }
      return response.json();
    })
    .then(categoryJson => {
      const categories = JSON.parse(categoryJson);
      console.log(categories);
      
      // Очистка списка категорий перед заполнением
      $('#productCategorySelect').empty();

      // Добавление опций категорий в выпадающий список
      categories.forEach(category => {
        const option = $('<option>').attr('value', category.id).text(category.name);
        $('#productCategorySelect').append(option);
      });

      // Показ модального окна создания товара
      $('#createProductModal').modal('show');
    })
    .catch(error => {
      console.error('Ошибка при получении категорий:', error);
      // Обработка ошибки
    });
});

// Обработчик клика на кнопку "Зберегти" в модальном окне создания товара
$(document).on('click', '#createProductBtn', function() {
  const productName = $('#productName').val();
  const productPrice = $('#productPrice').val();
  const productCategoryIds = $('#productCategorySelect').val();
  const productQuantity = $('#productQuantity').val();
  const productDescription = $('#productDescription').val();
  const productShortDescription = $('#productShortDescription').val();
  const productImage = $('#productImage')[0].files[0];

  const data = {
    name: productName,
    type: "simple",
    regular_price: productPrice,
    description: productDescription,
    short_description: productShortDescription,
    categories: productCategoryIds.map(id => ({ id: parseInt(id) })),
    stock_quantity: productQuantity,
    manage_stock: true,
    images: []
  };
 createProduct(data);

});

function createProduct(data) {
  fetch('/create_product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при создании товара');
    }
    return response.json();
  })
  .then(result => {
    console.log('Товар успешно создан:', result);
    // Закрытие модального окна
    $('#createProductModal').modal('hide');
    // Сброс формы создания товара
    $('#createProductForm')[0].reset();
    // Обновление списка товаров
    loadProducts(currentPage);
  })
  .catch(error => {
    console.error('Ошибка при создании товара:', error);
    // Обработка ошибки
  });
}

// Обработчик клика по кнопке "Видалити товар"
$(document).on('click', '#delete-order', function() {
  const productId = $('#productModalLabel').data('product-id');
  
  if (confirm('Ви дійсно хочете видалити товар?')) {
    deleteProduct(productId);
  }
});

// Функция для отправки запроса на удаление товара
function deleteProduct(productId) {
  fetch(`/delete_product?id=${productId}`, {
    method: 'POST'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Помилка при видаленні товару');
      }
      return response.json();
    })
    .then(data => {
      console.log('Товар успішно видалено:', data);
      // Закрыть модальное окно
      $('#productModal').modal('hide');
      // Обновить данные на странице после успешного удаления товара
      loadProducts(currentPage);
    })
    .catch(error => {
      console.error('Помилка при видаленні товару:', error);
    });
}




document.addEventListener('DOMContentLoaded', function() {
  const homeImgButton = document.querySelector('.home-img');

  homeImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/admin" с параметром "page=1"
    window.location.href = '/admin?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.categories-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/customer?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListImgButton = document.querySelector('.menu-list .categories-img');

  customerListImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/customer?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const customerListButton = document.querySelector('.menu-list #href-categories');

  customerListButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/customer?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const homeImgButton = document.querySelector('.menu-list .home-img');

  homeImgButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/admin?page=1';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const homeButton = document.querySelector('.menu-list #href-main');

  homeButton.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    // Перенаправляем пользователя на страницу "/customer" с параметром "page=1"
    window.location.href = '/admin?page=1';
  });
});

  // Вызвать функцию loadProducts() при загрузке страницы
$(document).ready(function() {
  loadCategories();
  loadProducts();  
  }); 