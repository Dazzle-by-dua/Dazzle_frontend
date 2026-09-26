/* ===========================
   DAZZLE BY DUA — Shared JS
   =========================== */

// ---- Data ----
const PRODUCTS = [
  { id:1, name:"Flower Pendant Necklace", price:4990, oldPrice:6990, category:"necklaces", rating:4.8, reviews:24, img:"product_flower_necklace.jpg", badges:["bestseller"], inStock:true },
  { id:2, name:"Pearl Drop Earrings", price:3990, oldPrice:5990, category:"earrings", rating:4.9, reviews:18, img:"product_pearl_earrings.jpg", badges:["new"], inStock:true },
  { id:3, name:"Delicate Chain Bracelet", price:5990, oldPrice:7490, category:"bracelets", rating:4.7, reviews:22, img:"product_bracelet.jpg", badges:[], inStock:true },
  { id:4, name:"Minimal Diamond Ring", price:4690, oldPrice:6690, category:"rings", rating:4.6, reviews:31, img:"product_ring.jpg", badges:["sale"], inStock:true },
  { id:5, name:"Gold Hoop Earrings", price:2990, oldPrice:3990, category:"earrings", rating:4.5, reviews:15, img:"product_pearl_earrings.jpg", badges:[], inStock:true },
  { id:6, name:"Star Pendant Necklace", price:3490, oldPrice:4990, category:"necklaces", rating:4.7, reviews:9, img:"product_flower_necklace.jpg", badges:["new"], inStock:false },
  { id:7, name:"Pearl Stud Earrings", price:1990, oldPrice:2990, category:"earrings", rating:4.8, reviews:42, img:"product_pearl_earrings.jpg", badges:["bestseller"], inStock:true },
  { id:8, name:"Bangle Bracelet Set", price:6990, oldPrice:8990, category:"bracelets", rating:4.4, reviews:7, img:"product_bracelet.jpg", badges:["offer"], inStock:true },
];

const REVIEWS = [
  { name:"Ayesha K.", rating:5, text:"The Flower Pendant Necklace looks even prettier in person! Very good quality and beautiful packaging.", date:"12 Jan 2025", verified:true },
  { name:"Priya M.", rating:5, text:"Absolutely love my pearl earrings. They are so delicate and elegant. Will definitely order again!", date:"5 Feb 2025", verified:true },
  { name:"Nadia R.", rating:4, text:"Beautiful bracelet, perfect gift for my sister. The champagne gold finish is exactly as shown.", date:"20 Mar 2025", verified:true },
  { name:"Sarah L.", rating:5, text:"Dazzle by Dua is my go-to for jewellery! The quality is premium and the designs are timeless.", date:"8 Apr 2025", verified:true },
  { name:"Fatima Z.", rating:5, text:"Ordered the ring and it arrived in gorgeous packaging. The detail is exquisite — absolutely stunning!", date:"15 May 2025", verified:true },
  { name:"Maha B.", rating:4, text:"Very happy with my purchase. The earrings are lightweight and comfortable for all-day wear.", date:"2 Jun 2025", verified:true },
];

// ---- State ----
const state = {
  cart: JSON.parse(localStorage.getItem("dazzle_cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("dazzle_wishlist") || "[]"),
};

function saveState() {
  localStorage.setItem("dazzle_cart", JSON.stringify(state.cart));
  localStorage.setItem("dazzle_wishlist", JSON.stringify(state.wishlist));
}

// ---- Cart ----
function addToCart(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const existing = state.cart.find(x => x.id === productId);
  if (existing) { existing.qty = (existing.qty || 1) + 1; }
  else { state.cart.push({ ...p, qty: 1 }); }
  saveState();
  updateNavBadges();
  showToast("✦ Added to cart — " + p.name);
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(x => x.id !== productId);
  saveState();
  updateNavBadges();
}

// ---- Wishlist ----
function toggleWishlist(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const idx = state.wishlist.findIndex(x => x.id === productId);
  if (idx >= 0) {
    state.wishlist.splice(idx, 1);
    showToast("♡ Removed from wishlist");
  } else {
    state.wishlist.push(p);
    showToast("♥ Added to wishlist — " + p.name);
  }
  saveState();
  updateNavBadges();
  return idx < 0;
}

function isInWishlist(productId) {
  return state.wishlist.some(x => x.id === productId);
}

// ---- Nav Badges ----
function updateNavBadges() {
  const cartBadges = document.querySelectorAll(".cart-badge");
  const wishBadges = document.querySelectorAll(".wish-badge");
  cartBadges.forEach(b => { b.textContent = state.cart.reduce((s, x) => s + (x.qty || 1), 0); });
  wishBadges.forEach(b => { b.textContent = state.wishlist.length; });
}

// ---- Toast ----
function showToast(msg, duration = 3000) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = '<span class="toast-icon">✦</span><span>' + msg + '</span>';
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- Stars ----
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) s += "★";
    else if (i === full && half) s += "☆";
    else s += "☆";
  }
  return s;
}

// ---- Product Card HTML ----
function productCardHTML(p) {
  const inWish = isInWishlist(p.id);
  const badgesHTML = (p.badges || []).map(b => `<span class="badge badge-${b}">${b}</span>`).join("");
  const outOfStock = !p.inStock ? '<span class="badge badge-oos">Out of Stock</span>' : "";
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-img-wrap">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-badges">${badgesHTML}${outOfStock}</div>
      <div class="product-img-actions">
        <button class="btn-icon wish-toggle${inWish ? " active" : ""}" onclick="handleWishToggle(this, ${p.id})" title="Wishlist">♥</button>
        <a href="shop.html" class="btn-icon" title="Quick View">👁</a>
      </div>
    </div>
    <div class="product-body">
      <h4 class="product-name">${p.name}</h4>
      <div class="product-rating">
        <span class="stars">${renderStars(p.rating)}</span>
        <span class="rating-count">(${p.reviews})</span>
      </div>
      <div class="product-price-wrap">
        <span class="product-price">₹${p.price.toLocaleString()}</span>
        <span class="product-price-old">₹${p.oldPrice.toLocaleString()}</span>
      </div>
      <button class="btn btn-dark btn-sm" onclick="addToCart(${p.id})" ${!p.inStock ? "disabled style='opacity:.5;cursor:not-allowed'" : ""}>${!p.inStock ? "Out of Stock" : "Add to Cart"}</button>
    </div>
  </div>`;
}

// ---- Review Card HTML ----
function reviewCardHTML(r) {
  return `
  <div class="review-card">
    <div class="review-header">
      <div class="reviewer-avatar">${r.name[0]}</div>
      <div>
        <div class="reviewer-name">${r.name}</div>
        <div class="stars-row">${renderStars(r.rating)}</div>
        <div class="review-date">${r.date}</div>
      </div>
    </div>
    <p class="review-text">&ldquo;${r.text}&rdquo;</p>
    ${r.verified ? '<div class="review-verified">✓ Verified Purchase</div>' : ''}
  </div>`;
}

// ---- Wishlist toggle handler ----
function handleWishToggle(btn, id) {
  const added = toggleWishlist(id);
  btn.classList.toggle("active", added);
}

// ---- Mobile menu ----
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".mobile-menu");
  const close = document.querySelector(".mobile-menu-close");
  if (!hamburger || !menu) return;
  hamburger.addEventListener("click", () => menu.classList.add("open"));
  if (close) close.addEventListener("click", () => menu.classList.remove("open"));
  menu.addEventListener("click", e => { if (e.target === menu) menu.classList.remove("open"); });
}

// ---- Scroll navbar ----
function initScrollNav() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// ---- Active nav link ----
function setActiveNavLink() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === page) link.classList.add("active");
  });
}

// ---- FAQ accordion ----
function initFAQ() {
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    if (q) q.addEventListener("click", () => item.classList.toggle("open"));
  });
}

// ---- Countdown timer ----
function initCountdown(endTimeMs) {
  function tick() {
    const diff = endTimeMs - Date.now();
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, "0");
    const els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      mins: document.getElementById("cd-mins"),
      secs: document.getElementById("cd-secs"),
    };
    if (els.days) els.days.textContent = pad(d);
    if (els.hours) els.hours.textContent = pad(h);
    if (els.mins) els.mins.textContent = pad(m);
    if (els.secs) els.secs.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

// ---- Orders tab switching ----
function initOrderTabs() {
  const tabs = document.querySelectorAll(".orders-tab");
  const panels = document.querySelectorAll(".orders-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.style.display = "none");
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.style.display = "block";
    });
  });
}

// ---- Copy coupon ----
function copyCoupon(code) {
  navigator.clipboard.writeText(code).then(() => showToast("✦ Coupon code copied: " + code));
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initScrollNav();
  setActiveNavLink();
  initFAQ();
  updateNavBadges();
});
