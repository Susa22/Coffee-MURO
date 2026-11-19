// ===== Lucide icons =====
if (window.lucide) {
  lucide.createIcons({
    attrs: {
      'stroke-width': 1
    }
  });
}

// ===== Rating stars (index.html) =====
const starSvg = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
let starsHtml = '';
for (let i = 0; i < 5; i++) {
  starsHtml += starSvg;
}

const starContainers = document.querySelectorAll('.stars');
for (let i = 0; i < starContainers.length; i++) {
  starContainers[i].innerHTML = starsHtml;
}

// ===== Sticky header =====
const header = document.querySelector('header');

function updateHeader() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader);
updateHeader();

// ===== Mobile menu =====
const nav = document.querySelector('.nav');
const menuBtn = document.getElementById('menu-btn');

menuBtn.addEventListener('click', function () {
  if (nav.classList.contains('open')) {
    nav.classList.remove('open');
  } else {
    nav.classList.add('open');
  }
});

const navLinks = document.querySelectorAll('#nav-links a');
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener('click', function () {
    for (let j = 0; j < navLinks.length; j++) {
      if (j === i) {
        navLinks[j].classList.add('active');
      } else {
        navLinks[j].classList.remove('active');
      }
    }
    nav.classList.remove('open');
  });
}

// ===== Bestsellers carousel (index.html only) =====
const carousel = document.getElementById('carousel');

if (carousel) {
  const arrows = document.querySelectorAll('.arrow');

  for (let i = 0; i < arrows.length; i++) {
    arrows[i].addEventListener('click', function () {
      const firstDrink = carousel.querySelector('.drink');
      const step = firstDrink.offsetWidth + 20;
      const direction = Number(arrows[i].getAttribute('data-dir'));
      carousel.scrollBy({
        left: step * direction,
        behavior: 'smooth'
      });
    });
  }
}

// ===== Testimonials slider (index.html only) =====
const slides = document.querySelectorAll('.t-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let sliderTimer;

function showSlide(index) {
  currentSlide = index;

  for (let i = 0; i < slides.length; i++) {
    if (i === index) {
      slides[i].classList.add('is-active');
    } else {
      slides[i].classList.remove('is-active');
    }
  }

  for (let i = 0; i < dots.length; i++) {
    if (i === index) {
      dots[i].classList.add('is-active');
    } else {
      dots[i].classList.remove('is-active');
    }
  }
}

function nextSlideStep() {
  let nextSlide = currentSlide + 1;
  if (nextSlide >= slides.length) {
    nextSlide = 0;
  }
  showSlide(nextSlide);
}

function restartTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlideStep, 7000);
}

if (slides.length > 0) {
  restartTimer();

  for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener('click', function () {
      showSlide(i);
      restartTimer();
    });
  }
}

// ===== Cart (both pages) =====
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartDiscountRow = document.getElementById('cart-discount-row');
const cartDiscount = document.getElementById('cart-discount');
const bonusUseWrap = document.getElementById('bonus-use-wrap');
const useBonusesCheckbox = document.getElementById('use-bonuses');
const availableBonusesEl = document.getElementById('available-bonuses');
const cartBonusDiscount = document.getElementById('cart-bonus-discount');
const cartLoginHint = document.getElementById('cart-login-hint');
const cartTotal = document.getElementById('cart-total');
let cart = loadCart();

function loadCart() {
  const savedCart = localStorage.getItem('muroCart');
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  return [];
}

function saveCart() {
  localStorage.setItem('muroCart', JSON.stringify(cart));
}

function getCurrentUser() {
  const savedUser = localStorage.getItem('muroUser');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  return null;
}

function getCartTotal() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
  }
  return total;
}

function updateCartCount() {
  if (cartCount) {
    let count = 0;
    for (let i = 0; i < cart.length; i++) {
      count += cart[i].qty;
    }
    cartCount.textContent = count;
  }
}

function renderCart() {
  if (!cartItemsList) {
    return;
  }

  const user = getCurrentUser();
  if (cartLoginHint) {
    if (user) {
      cartLoginHint.classList.add('is-hidden');
    } else {
      cartLoginHint.classList.remove('is-hidden');
    }
  }

  if (cart.length === 0) {
    cartItemsList.innerHTML = '<li class="cart-empty">Ваш кошик поки що порожній. Додайте щось смачне з каталогу вище.</li>';
    if (cartSubtotal) {
      cartSubtotal.textContent = '0 грн';
    }
    if (cartDiscountRow) {
      cartDiscountRow.classList.add('is-hidden');
    }
    if (bonusUseWrap) {
      bonusUseWrap.classList.add('is-hidden');
    }
    cartTotal.textContent = '0 грн';
    return;
  }

  let html = '';
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    html += '<li class="cart-item">';
    html += '<div class="cart-item-info">';
    html += '<span class="cart-item-name">' + item.name + '</span>';
    html += '<span class="cart-item-price">' + item.price + ' грн / шт.</span>';
    html += '</div>';
    html += '<div class="qty">';
    html += '<button class="qty-btn qty-minus">−</button>';
    html += '<span class="qty-value">' + item.qty + '</span>';
    html += '<button class="qty-btn qty-plus">+</button>';
    html += '</div>';
    html += '<span class="cart-item-sum">' + (item.price * item.qty) + ' грн</span>';
    html += '<button class="remove-item">Видалити</button>';
    html += '</li>';
  }

  cartItemsList.innerHTML = html;

  const subtotal = getCartTotal();
  if (cartSubtotal) {
    cartSubtotal.textContent = subtotal + ' грн';
  }

  let discount = 0;
  if (user) {
    discount = Math.round(subtotal * 0.1);
    if (cartDiscount && cartDiscountRow) {
      cartDiscount.textContent = '−' + discount + ' грн';
      cartDiscountRow.classList.remove('is-hidden');
    }
  } else if (cartDiscountRow) {
    cartDiscountRow.classList.add('is-hidden');
  }

  const afterDiscountTotal = subtotal - discount;
  let usedBonuses = 0;

  if (user && user.bonuses > 0 && bonusUseWrap) {
    bonusUseWrap.classList.remove('is-hidden');
    availableBonusesEl.textContent = user.bonuses;
    if (useBonusesCheckbox && useBonusesCheckbox.checked) {
      usedBonuses = Math.min(user.bonuses, afterDiscountTotal);
    }
    cartBonusDiscount.textContent = '−' + usedBonuses + ' грн';
  } else if (bonusUseWrap) {
    bonusUseWrap.classList.add('is-hidden');
    if (useBonusesCheckbox) {
      useBonusesCheckbox.checked = false;
    }
  }

  const finalTotal = afterDiscountTotal - usedBonuses;
  cartTotal.textContent = finalTotal + ' грн';

  // buttons are created again on every render, so we attach the listeners here
  const minusButtons = cartItemsList.querySelectorAll('.qty-minus');
  const plusButtons = cartItemsList.querySelectorAll('.qty-plus');
  const removeButtons = cartItemsList.querySelectorAll('.remove-item');

  for (let i = 0; i < minusButtons.length; i++) {
    minusButtons[i].addEventListener('click', function () {
      changeQty(i, -1);
    });
    plusButtons[i].addEventListener('click', function () {
      changeQty(i, 1);
    });
    removeButtons[i].addEventListener('click', function () {
      removeFromCart(i);
    });
  }
}

if (useBonusesCheckbox) {
  useBonusesCheckbox.addEventListener('change', function () {
    renderCart();
  });
}

function updateCart() {
  saveCart();
  updateCartCount();
  renderCart();
}

function addToCart(name, price, qty) {
  let amount = qty || 1;
  let found = false;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].qty += amount;
      found = true;
    }
  }

  if (!found) {
    cart.push({ name: name, price: price, qty: amount });
  }

  updateCart();
}

function changeQty(index, step) {
  cart[index].qty += step;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

updateCartCount();
renderCart();

// ===== Product quantity selectors & "У кошик" buttons (shop.html) =====
const productCards = document.querySelectorAll('.shop-catalog .product');

for (let i = 0; i < productCards.length; i++) {
  const minusBtn = productCards[i].querySelector('.card-qty-minus');
  const plusBtn = productCards[i].querySelector('.card-qty-plus');
  const qtyValue = productCards[i].querySelector('.card-qty-value');
  const addBtn = productCards[i].querySelector('.add-to-cart');

  if (minusBtn && plusBtn && qtyValue) {
    minusBtn.addEventListener('click', function () {
      let current = Number(qtyValue.textContent);
      if (current > 1) {
        qtyValue.textContent = current - 1;
      }
    });

    plusBtn.addEventListener('click', function () {
      let current = Number(qtyValue.textContent);
      qtyValue.textContent = current + 1;
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      const name = addBtn.getAttribute('data-name');
      const price = Number(addBtn.getAttribute('data-price'));
      let qty = 1;
      if (qtyValue) {
        qty = Number(qtyValue.textContent);
        qtyValue.textContent = '1';
      }

      addToCart(name, price, qty);

      addBtn.textContent = 'Додано ✓';
      setTimeout(function () {
        addBtn.textContent = 'У кошик';
      }, 1200);
    });
  }
}

// ===== Category filter (shop.html) =====
const filterButtons = document.querySelectorAll('.filter-btn');
const shopProducts = document.querySelectorAll('.shop-catalog .product');

for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener('click', function () {
    const category = filterButtons[i].getAttribute('data-category');

    for (let j = 0; j < filterButtons.length; j++) {
      if (j === i) {
        filterButtons[j].classList.add('btn-primary');
        filterButtons[j].classList.remove('btn-outline');
      } else {
        filterButtons[j].classList.add('btn-outline');
        filterButtons[j].classList.remove('btn-primary');
      }
    }

    for (let j = 0; j < shopProducts.length; j++) {
      const productCategory = shopProducts[j].getAttribute('data-category');
      if (category === 'all' || productCategory === category) {
        shopProducts[j].classList.remove('is-hidden');
      } else {
        shopProducts[j].classList.add('is-hidden');
      }
    }
  });
}

// ===== Checkout (shop.html) =====
const checkoutForm = document.getElementById('checkout-form');
const checkoutMessage = document.getElementById('checkout-message');

if (checkoutForm) {
  checkoutForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (cart.length === 0) {
      checkoutMessage.classList.add('is-error');
      checkoutMessage.textContent = 'Кошик порожній — спершу додайте товари з каталогу.';
      return;
    }

    const name = document.getElementById('checkout-name').value;
    const pickup = document.getElementById('checkout-pickup').value;
    const subtotal = getCartTotal();
    const user = getCurrentUser();

    let discount = 0;
    if (user) {
      discount = Math.round(subtotal * 0.1);
    }

    const afterDiscountTotal = subtotal - discount;
    let usedBonuses = 0;

    if (user && user.bonuses > 0 && useBonusesCheckbox && useBonusesCheckbox.checked) {
      usedBonuses = Math.min(user.bonuses, afterDiscountTotal);
    }

    const finalTotal = afterDiscountTotal - usedBonuses;
    let bonusInfo = '';

    if (user) {
      if (user.bonuses === undefined) {
        user.bonuses = 150;
      }
      const earnedBonuses = Math.floor(finalTotal * 0.1);
      user.bonuses = user.bonuses - usedBonuses + earnedBonuses;

      localStorage.setItem('muroUser', JSON.stringify(user));
      localStorage.setItem('muroAccount', JSON.stringify(user));

      const profileBonusEl = document.getElementById('profile-bonus');
      if (profileBonusEl) {
        profileBonusEl.textContent = user.bonuses + ' бонусів';
      }

      if (useBonusesCheckbox) {
        useBonusesCheckbox.checked = false;
      }

      if (usedBonuses > 0) {
        bonusInfo += ' Списано ' + usedBonuses + ' бонусів.';
      }
      bonusInfo += ' Нараховано +' + earnedBonuses + ' бонусів кешбеку.';
    }

    checkoutMessage.classList.remove('is-error');
    checkoutMessage.textContent = 'Дякуємо, ' + name + '! Замовлення на суму ' + finalTotal + ' грн прийнято.' + bonusInfo + ' Пункт отримання: ' + pickup + '. Ми зателефонуємо вам для підтвердження.';

    cart = [];
    updateCart();
    checkoutForm.reset();

    if (user) {
      const checkoutName = document.getElementById('checkout-name');
      const checkoutPhone = document.getElementById('checkout-phone');
      if (checkoutName) {
        checkoutName.value = user.name;
      }
      if (checkoutPhone && user.phone) {
        checkoutPhone.value = user.phone;
      }
    }
  });
}

// ===== Account: registration / login (shop.html) =====
const authTabs = document.getElementById('auth-tabs');
const tabButtons = document.querySelectorAll('.auth-tab');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const profileView = document.getElementById('profile-view');
const logoutBtn = document.getElementById('logout-btn');

function showTab(tabName) {
  for (let i = 0; i < tabButtons.length; i++) {
    if (tabButtons[i].getAttribute('data-tab') === tabName) {
      tabButtons[i].classList.add('is-active');
    } else {
      tabButtons[i].classList.remove('is-active');
    }
  }

  if (tabName === 'register') {
    registerForm.classList.remove('is-hidden');
    loginForm.classList.add('is-hidden');
  } else {
    registerForm.classList.add('is-hidden');
    loginForm.classList.remove('is-hidden');
  }
}

function showProfile(user) {
  if (user.bonuses === undefined) {
    user.bonuses = 150;
    localStorage.setItem('muroUser', JSON.stringify(user));
  }

  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-avatar').textContent = user.name.charAt(0).toUpperCase();

  const profileBonusEl = document.getElementById('profile-bonus');
  if (profileBonusEl) {
    profileBonusEl.textContent = user.bonuses + ' бонусів';
  }

  authTabs.classList.add('is-hidden');
  registerForm.classList.add('is-hidden');
  loginForm.classList.add('is-hidden');
  profileView.classList.remove('is-hidden');

  // fill the checkout form with the user's data
  const checkoutName = document.getElementById('checkout-name');
  const checkoutPhone = document.getElementById('checkout-phone');
  if (checkoutName && checkoutName.value === '') {
    checkoutName.value = user.name;
  }
  if (checkoutPhone && checkoutPhone.value === '' && user.phone) {
    checkoutPhone.value = user.phone;
  }

  renderCart();
}

function logout() {
  localStorage.removeItem('muroUser');
  if (useBonusesCheckbox) {
    useBonusesCheckbox.checked = false;
  }
  profileView.classList.add('is-hidden');
  authTabs.classList.remove('is-hidden');
  showTab('login');
  renderCart();
}

if (registerForm) {
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', function () {
      showTab(tabButtons[i].getAttribute('data-tab'));
    });
  }

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // the password is NOT saved: this is only a front-end demo
    const user = {
      name: document.getElementById('register-name').value.trim(),
      email: document.getElementById('register-email').value.trim(),
      phone: document.getElementById('register-phone').value.trim(),
      bonuses: 150
    };

    localStorage.setItem('muroAccount', JSON.stringify(user));
    localStorage.setItem('muroUser', JSON.stringify(user));
    registerForm.reset();
    showProfile(user);
  });

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    let userName = email.split('@')[0];
    let userPhone = '';
    let userBonuses = 150;

    // if this email was registered before, use the saved name and bonuses
    const savedAccount = localStorage.getItem('muroAccount');
    if (savedAccount) {
      const account = JSON.parse(savedAccount);
      if (account.email.toLowerCase() === email.toLowerCase()) {
        userName = account.name;
        userPhone = account.phone;
        if (account.bonuses !== undefined) {
          userBonuses = account.bonuses;
        }
      }
    }

    const user = { name: userName, email: email, phone: userPhone, bonuses: userBonuses };
    localStorage.setItem('muroUser', JSON.stringify(user));
    loginForm.reset();
    showProfile(user);
  });

  logoutBtn.addEventListener('click', function () {
    logout();
  });

  // user is already logged in
  const savedUser = localStorage.getItem('muroUser');
  if (savedUser) {
    showProfile(JSON.parse(savedUser));
  }
}
