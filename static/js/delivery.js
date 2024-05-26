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
  });