document.addEventListener("DOMContentLoaded", function () {
  highlightCurrentPage();
  setupScrollReveal();
  revealOnScroll();
  updateCartCount();
  loadCart();
});

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active-link");
    }
  });
}

function setupScrollReveal() {
  const selectors = [
    ".hero-box",
    ".feature-card",
    ".content-box",
    ".team-card",
    ".product-card",
    ".form-box",
    ".contact-box",
    ".cart-page-box",
    ".checkout-box"
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.classList.add("reveal"));
  });
}

function revealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length === 0) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(item => observer.observe(item));
}

function getCartItems() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(cart) {
  localStorage.setItem("cartItems", JSON.stringify(cart));
}

function getProductPrice(name) {
  const prices = {
    "Gallon of Gas": 18.99,
    "Bucket of Tadpoles": 49.99,
    "Piece of the Artimis II": 29.99,
    "Coffee beans of some sort": 22.00,
    "Diamond Pickaxe": 79.99,
    "Farmers Almanac": 14.99
  };

  return prices[name] || 0;
}

function updateCartCount() {
  const cart = getCartItems();
  const cartCountElement = document.getElementById("cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = "Cart: " + cart.length;
  }
}

function addToCart(name) {
  const cart = getCartItems();
  cart.push(name);
  saveCartItems(cart);

  updateCartCount();

  const message = document.getElementById("cart-message");
  if (!message) return;

  message.textContent = name + " has been added to your cart!";
  message.style.display = "block";

  setTimeout(() => {
    message.style.display = "none";
  }, 2200);
}

function removeCartItem(index) {
  const cart = getCartItems();
  cart.splice(index, 1);
  saveCartItems(cart);
  updateCartCount();
  loadCart();
}

function clearCart() {
  localStorage.removeItem("cartItems");
  updateCartCount();
  loadCart();
}

function loadCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const itemCountDiv = document.getElementById("cart-item-count");
  const subtotalDiv = document.getElementById("cart-subtotal");
  const taxDiv = document.getElementById("cart-tax");
  const totalDiv = document.getElementById("cart-total");

  if (!cartItemsDiv || !itemCountDiv || !subtotalDiv || !taxDiv || !totalDiv) return;

  const cart = getCartItems();
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p class='text-center mb-0'>Your cart is empty.</p>";
    itemCountDiv.textContent = "0";
    subtotalDiv.textContent = "$0.00";
    taxDiv.textContent = "$0.00";
    totalDiv.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const price = getProductPrice(item);
    subtotal += price;

    cartItemsDiv.innerHTML += `
      <div class="cart-item-row">
        <div>
          <h5 class="mb-1">${item}</h5>
          <p class="mb-0 text-muted">Standard item</p>
        </div>
        <div class="cart-item-right">
          <div class="cart-price">$${price.toFixed(2)}</div>
          <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  itemCountDiv.textContent = cart.length;
  subtotalDiv.textContent = "$" + subtotal.toFixed(2);
  taxDiv.textContent = "$" + tax.toFixed(2);
  totalDiv.textContent = "$" + total.toFixed(2);
}

function sendMessage() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const successBox = document.getElementById("success");

  if (!nameInput || !emailInput || !subjectInput || !messageInput || !successBox) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value;
  const message = messageInput.value.trim();

  if (name === "" || email === "" || subject === "" || message === "") {
    alert("Please fill in all fields.");
    return;
  }

  successBox.style.display = "block";

  nameInput.value = "";
  emailInput.value = "";
  subjectInput.value = "";
  messageInput.value = "";
}