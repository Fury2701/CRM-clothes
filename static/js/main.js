$('.menu-btn').on('click', function(e) {
  e.preventDefault();
  $(this).hide();
  $('.menu').toggleClass('menu_active');
  $('.content').toggleClass('content_active');
}) 

$('.menu2-btn').on('click', function(e) {
    e.preventDefault();
    $('.menu').toggleClass('menu_active');
    $('.content').toggleClass('content_active');
  })
  
$(document).ready(function(){
      $(".menu2-btn").click(function(){
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
  } 
  else {
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

  } 
  else {
    // Если не отмечен, восстанавливаем исходный порядок строк
    table1.tBodies[0].innerHTML = ''; // Очищаем содержимое тела таблицы

    originalRows.forEach(row => {
      table1.tBodies[0].appendChild(row);
    });
  }
});
