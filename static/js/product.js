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

  let currentSearchParams = {
    page: 1,
    searchTerm: '',
    category: '',
    searchBySku: false
  };
  
  function loadProducts(params = {}) {
    currentSearchParams = { ...currentSearchParams, ...params };
  
    let url = `/data_products?page=${currentSearchParams.page}`;
  
    if (currentSearchParams.searchTerm) {
      const encodedSearchTerm = encodeURIComponent(currentSearchParams.searchTerm);
      if (currentSearchParams.searchBySku) {
        url += `&sku=${encodedSearchTerm}`;
      } else {
        url += `&name=${encodedSearchTerm}`;
      }
    }
  
    if (currentSearchParams.category) {
      url += `&category=${currentSearchParams.category}`;
    }
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data);
        $('#productsTable tbody').empty();
        populateProductsTable(data.products);
        updatePagination(data.current_page, data.total_pages);
      })
      .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
      });
  }
  
  // Обработчик изменения чекбокса
  document.getElementById('CheckOldest').addEventListener('change', function() {
    currentSearchParams.searchBySku = this.checked;
    if (currentSearchParams.searchTerm) {
      loadProducts({ page: 1 }); // Перезагружаем первую страницу с новыми параметрами
    }
  });

function loadProductsByName(page = 1, searchTerm = '') {
  let url;
  const encodedSearchTerm = encodeURIComponent(searchTerm);

  if (searchTerm.toLowerCase().startsWith('о-')) {
    // Если поисковый запрос начинается с "О-", ищем только по SKU
    url = `/data_products?page=${page}&sku=${encodedSearchTerm}`;
  } else {
    // В противном случае ищем по имени
    url = `/data_products?page=${page}&name=${encodedSearchTerm}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Received data:', data);
      $('#productsTable tbody').empty();
      populateProductsTable(data.products);
      updatePagination(data.current_page, data.total_pages);
    })
    .catch(error => {
      console.error('Ошибка при загрузке товаров:', error);
    });
}

// Обработчик изменения категории
document.getElementById('categoryFilter').addEventListener('change', function() {
  const category = this.value;
  loadProducts({ page: 1, category: category });
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
  const searchTerm = document.getElementById('searchInput').value.trim();
  loadProducts({ page: 1, searchTerm: searchTerm });
});

// Обработчик нажатия клавиши Enter в поле ввода поиска
document.getElementById('searchInput').addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    const searchTerm = this.value.trim();
    loadProducts({ page: 1, searchTerm: searchTerm });
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
  // Добавьте обработчик события для ссылок пагинации
  $(document).on('click', '.pagination .page-link', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    loadProducts({ page: page });
  });
     

function togglePriceEdit(icon, priceType) {
  const container = icon.parentElement;
  const priceSpan = container.querySelector('span');
  const productId = icon.closest('tr').dataset.productId;
  const currentPrice = priceSpan.textContent !== 'Акційної ціни немає' ? parseFloat(priceSpan.textContent) : 0;

  if (icon.className.includes('fa-edit')) {
    // Переключение в режим редактирования
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.01';
    input.value = currentPrice || '';
    input.style.width = '80px';
    container.insertBefore(input, priceSpan);
    priceSpan.style.display = 'none';
    icon.className = 'fas fa-check edit-price-icon';
  } else {
    // Сохранение изменений
    const input = container.querySelector('input');
    let newPrice = input.value ? parseFloat(input.value).toFixed(2) : '';
    
    if (priceType === 'sale' && (newPrice === '' || parseFloat(newPrice) === 0)) {
        newPrice = " ";
        priceSpan.textContent = 'Акційної ціни немає';
    } else {
        priceSpan.textContent = newPrice ? `${newPrice} грн` : '0.00 грн';
    }
    
    if (newPrice !== currentPrice.toFixed(2)) {
        updateProductPrice(productId, newPrice, priceType);
    }
    priceSpan.style.display = '';
    container.removeChild(input);
    icon.className = 'fas fa-edit edit-price-icon';
  }
}

function updateProductPrice(productId, newPrice, priceType) {
  const data = {
    id: productId
  };
  
  if (priceType === 'regular') {
    data.regular_price = newPrice;
  } else if (priceType === 'sale') {
    data.sale_price = newPrice;
  }

  fetch('/update_product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при обновлении цены товара');
    }
    return response.json();
  })
  .then(result => {
    console.log('Цена товара успешно обновлена:', result);
    // Обновление цены в таблице происходит в функции togglePriceEdit
  })
  .catch(error => {
    console.error('Ошибка при обновлении цены товара:', error);
    alert('Не удалось обновить цену товара. Пожалуйста, попробуйте еще раз.');
  });
}


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

    const skuCell = document.createElement('td');
    skuCell.textContent = product.sku;
    row.appendChild(skuCell);
 
    // Создание ячейки для цен
    const priceCell = document.createElement('td');
    priceCell.appendChild(createPriceElement(product.regular_price, 'regular'));
    priceCell.appendChild(document.createElement('br'));
    priceCell.appendChild(createPriceElement(product.sale_price, 'sale'));
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
      quantityCell.style.color = 'red'; // Добавляем стиль для красного цвета
    } else {
      quantityCell.textContent = '-';
    }
    row.appendChild(quantityCell);
 
    tableBody.appendChild(row);
  });
}

function createPriceElement(price, type) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';

  const priceSpan = document.createElement('span');
  if (type === 'regular') {
    priceSpan.textContent = `${parseFloat(price).toFixed(2)} грн`;
  } else { // type === 'sale'
    if (price && parseFloat(price) > 0) {
      priceSpan.textContent = `${parseFloat(price).toFixed(2)} грн`;
    } else {
      priceSpan.textContent = 'Акційної ціни немає';
    }
  }
  priceSpan.style.marginRight = '5px';

  const editIcon = document.createElement('i');
  editIcon.className = 'fas fa-edit edit-price-icon';
  editIcon.style.cursor = 'pointer';

  container.appendChild(priceSpan);
  container.appendChild(editIcon);

  editIcon.addEventListener('click', function() {
    togglePriceEdit(this, type);
  });

  return container;
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
      const nameInput = $('<textarea>').addClass('form-control').attr('id', 'editProductName').attr('rows', '3');
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
      
      const quantityInputGroup = $('<div>').addClass('input-group input-group-sm mt-2');
      const quantityInput = $('<input>').attr({
        type: 'number',
        id: 'inModalproductQuantity',
        class: 'form-control',
        min: '0',
        style: 'max-width: 80px;'
      });
      const quantityAddon = $('<span>').addClass('input-group-text').text('од');
      
      quantityInputGroup.append(quantityInput, quantityAddon);
      
      if (product.stock_status === 'instock') {
        quantityInput.val(product.stock_quantity);
        quantityInput.prop('disabled', false);
      } else {
        quantityInput.val('');
        quantityInput.prop('disabled', true);
      }
      
      availabilityCell.append(availabilitySelect, quantityInputGroup);
      row.append(availabilityCell);

      // Добавление ячейки с ценой товара (поле ввода)
      const priceCell = $('<td>');
      const priceInput = $('<input>').attr('type', 'number').attr('step', '0.1').addClass('form-control').attr('id', 'editProductPrice');
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

      availabilitySelect.on('change', function() {
        if (this.value === 'instock') {
          quantityInput.prop('disabled', false);
          quantityInput.val(product.stock_quantity || 0);
        } else {
          quantityInput.prop('disabled', true);
          quantityInput.val('');
        }
      });

      $('#productSku').text(`Артикул: ${product.sku}`);
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
        product.images.forEach((image, index) => {
          const imageContainer = $('<div>').addClass('image-container');
          const imageLink = $('<a>').attr('href', image.src).attr('data-fancybox', 'product-images');
          const imageElement = $('<img>').attr('src', image.src).attr('alt', product.name).css({maxWidth: '250px', maxHeight: '250px'});
          imageLink.append(imageElement);
          imageContainer.append(imageLink);

          // Добавление кнопки удаления
          const deleteButton = $('<button>')
            .addClass('btn btn-danger btn-sm delete-image')
            .text('Видалити')
            .attr('data-image-index', index)
            .attr('data-product-id', productId);
          imageContainer.append(deleteButton);

          $('#productImagesGallery').append(imageContainer);
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
  const price = $('#editProductPrice').val();
  const name = $('#editProductName').val();
  const description = $('#editProductDescription').val();
  const quantity = $('#inModalproductQuantity').val();

  const updatedData = {
    stock_status: availability,
    manage_stock: true // Важно для WooCommerce
  };

  if (availability === 'instock') {
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity)) {
      updatedData.stock_quantity = null;
      updatedData.manage_stock = false;
    } else {
      updatedData.stock_quantity = parsedQuantity;
      // Если количество 0, но статус 'instock', установим минимальное положительное значение
      if (parsedQuantity === 0) {
        updatedData.stock_quantity = null;
        updatedData.manage_stock = false;
      }
    }
  } else {
    updatedData.stock_quantity = 0;
    updatedData.manage_stock = false;
  }

  if (price) {
    updatedData.regular_price = price.toString();
  }

  if (name) {
    updatedData.name = name;
  }

  if (description) {
    updatedData.description = description;
  }

  const updatedAttributes = getUpdatedAttributes();
  if (updatedAttributes) {
    updatedData.attributes = updatedAttributes;
  } else {
    updatedData.attributes = [];
  }

  console.log(updatedData);
  updateProduct(productId, updatedData);
});

// Функция для получения обновленных атрибутов из списка атрибутов
function getUpdatedAttributes() {
  const attributes = [];

  $('#productAttributesList li').each(function() {
    const attributeText = $(this).clone().children().remove().end().text().trim();
    if (attributeText !== 'Атрибуты не указаны') {
      const [name, options] = attributeText.split(': ');
      if (name && options) {
        const attribute = {
          name: name,
          options: options.split(', ')
        };
        attributes.push(attribute);
      }
    }
  });

  return attributes.length > 0 ? attributes : null;
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

$(document).on('click', '.delete-image', function(e) {
  e.preventDefault();
  const imageIndex = $(this).data('image-index');
  const productId = $(this).data('product-id');
  
  if (confirm('Вы уверены, что хотите удалить это изображение?')) {
    deleteProductImage(productId, imageIndex);
  }
});

function deleteProductImage(productId, imageIndex) {
  fetch(`/productbyid?id=${productId}`)
    .then(response => response.json())
    .then(productJson => {
      const product = JSON.parse(productJson);
      const updatedImages = product.images.filter((_, index) => index !== imageIndex);
      
      return updateProduct(productId, { images: updatedImages });
    })
    .then(result => {
      console.log('Изображение успешно удалено:', result);
      // Обновление списка изображений товара
      openProductModal(productId);
    })
    .catch(error => {
      console.error('Ошибка при удалении изображения:', error);
      // Обработка ошибки
    });
}

// Обработчик клика на кнопку "Додати зображення"
$(document).on('click', '#addImgBtn', function() {
  $('#addImageModal').modal('show');
});
// Обработчик клика на кнопку "Зберегти" в модальном окне добавления изображения
$(document).on('click', '#addImageSaveBtn', function() {
  const productId = $('#productModalLabel').data('product-id');
  const imageUrl = $('#imageUrl').val();

  if (imageUrl) {
    // Получаем текущие данные о товаре
    fetch(`/productbyid?id=${productId}`)
      .then(response => response.json())
      .then(productJson => {
        const product = JSON.parse(productJson);
        const currentImages = product.images || [];

        // Создаем новый объект изображения
        const newImage = {
          src: imageUrl,
        };

        // Добавляем новое изображение к существующим
        const updatedImages = [...currentImages, newImage];

        // Создаем объект данных для обновления
        const data = {
          id: productId,
          images: updatedImages
        };

        // Отправляем запрос на обновление товара
        return updateProduct(productId, data);
      })
      .then(result => {
        console.log('Изображение успешно добавлено:', result);
        // Закрытие модального окна
        $('#addImageModal').modal('hide');
        // Обновление списка изображений товара
        openProductModal(productId);
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
  const productImageUrl = $('#productImageUrl').val();

  const data = {
    name: productName,
    type: "simple",
    regular_price: productPrice,
    description: productDescription,
    short_description: productShortDescription,
    categories: productCategoryIds.map(id => ({ id: parseInt(id) })),
    stock_quantity: productQuantity,
    manage_stock: true,
    images: [{ src: productImageUrl }]
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

document.addEventListener('DOMContentLoaded', function() {
  const deliveryButton = document.querySelector('#export');

  deliveryButton.addEventListener('click', function(e) {
    e.preventDefault();

    window.location.href = '/delivery?page=1';
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

let resetName="Однотонна фланель світло-оливкового кольору, ширина 240 см";
let dataresetname={
  name:resetName,
};

  // Вызвать функцию loadProducts() при загрузке страницы
$(document).ready(function() {
  loadCategories();
  loadProducts(); 
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