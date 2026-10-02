/* ========================================================
   DAZZLE BY DUA - Admin CMS Application Logic
   Centralized Control Center for Store Operations
   ======================================================== */

window.API_BASE_URL = window.API_BASE_URL || "https://dazzle-backend-69un.onrender.com";
var API_BASE_URL = window.API_BASE_URL;

// Global Admin State
window.AdminApp = window.AdminApp || {

  // Exposed on window below for inline event handlers
  currentView: "dashboard",
  currentProductGallery: [],
  currentComboGallery: [],
  editingProductId: null,
  editingReviewId: null,
  editingCouponId: null,
  editingComboId: null,
  viewingOrderId: null,
  productFilter: "all",
  productSearch: "",
  orderFilter: "all",
  orderSearch: "",
  reviewFilter: "all",

  init() {
    this.setupNavigation();
    this.handleRouting();
    this.setupEventListeners();
    this.renderCurrentView();
    this.updateSidebarBadges();

    // Live sync with Render MongoDB backend
    if (window.DazzleStore && typeof window.DazzleStore.syncFromBackend === "function") {
      window.DazzleStore.syncFromBackend().then(() => {
        this.renderCurrentView();
        this.updateSidebarBadges();
      });
    }
  },

  // ---- Routing & Navigation ----
  setupNavigation() {
    window.addEventListener("hashchange", () => {
      this.handleRouting();
    });

    document.querySelectorAll(".sidebar-item").forEach(item => {
      item.addEventListener("click", () => {
        const view = item.dataset.view;
        if (view) {
          this.navigateTo(view);
        }
      });
    });

    // Mobile sidebar toggle
    const toggleBtn = document.getElementById("sidebar-toggle");
    const sidebar = document.querySelector(".admin-sidebar");
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
      });
      // Close on clicking outside
      document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove("mobile-open");
        }
      });
    }
  },

    navigateTo(view) {
    if (view) {
      try {
        if (window.location.hash !== "#" + view) {
          window.location.hash = view;
        }
      } catch (e) {}
      this.handleRouting(view);
    }
  },

  handleRouting(explicitView) {
    const rawHash = (window.location.hash || "#dashboard").replace("#", "");
    const hash = explicitView || rawHash;
    const validViews = ["dashboard", "products", "categories", "orders", "reviews", "offers", "homepage", "pages", "navigation", "media", "settings"];
    this.currentView = validViews.includes(hash) ? hash : "dashboard";

    // Update Sidebar Active state
    document.querySelectorAll(".sidebar-item").forEach(item => {
      item.classList.toggle("active", item.dataset.view === this.currentView);
    });

    // Update Views
    document.querySelectorAll(".admin-view").forEach(view => {
      view.classList.toggle("active", view.id === `view-${this.currentView}`);
    });

    // Update Topbar
    const titleMap = {
      dashboard: "Dashboard Overview",
      products: "Product Management",
      categories: "Categories Manager",
      orders: "Orders & Fulfillment",
      reviews: "Customer Reviews",
      offers: "Offers, Coupons & Combos",
      homepage: "Homepage Layout Manager",
      pages: "Pages & Static Content",
      navigation: "Navigation Menus",
      media: "Media Asset Gallery",
      settings: "Store & Brand Settings"
    };

    const topTitle = document.getElementById("topbar-page-title");
    const topCrumb = document.getElementById("topbar-breadcrumb");
    if (topTitle) topTitle.textContent = titleMap[this.currentView] || "Admin Panel";
    if (topCrumb) topCrumb.textContent = `Dazzle CMS / ${titleMap[this.currentView] || ""}`;

    this.renderCurrentView();
    this.updateSidebarBadges();

    // Close mobile sidebar on nav
    const sidebar = document.querySelector(".admin-sidebar");
    if (sidebar) sidebar.classList.remove("mobile-open");
  },

  renderCurrentView() {
    switch (this.currentView) {
      case "dashboard":
        this.renderDashboard();
        break;
      case "products":
        this.renderProducts();
        break;
      case "categories":
        this.renderCategories();
        break;
      case "orders":
        this.renderOrders();
        break;
      case "reviews":
        this.renderReviews();
        break;
      case "offers":
        this.renderOffers();
        break;
      case "homepage":
        this.renderHomepageManager();
        break;
      case "pages":
        this.renderPages();
        break;
      case "navigation":
        this.renderNavigation();
        break;
      case "media":
        this.renderMedia();
        break;
      case "settings":
        this.renderSettings();
        break;
    }
  },

  updateSidebarBadges() {
    const products = DazzleStore.getProducts();
    const orders = DazzleStore.getOrders();
    const reviews = DazzleStore.getReviews();
    const offers = DazzleStore.getOffers();
    const categories = DazzleStore.getCategories();

    const pendingOrders = orders.filter(o => (o.status || "").toLowerCase() === "processing" || (o.status || "").toLowerCase() === "packed").length;
    const pendingReviews = reviews.filter(r => r.approved === false).length;
    const activeCoupons = (offers.coupons || []).filter(c => c.active !== false).length;

    const prodBadge = document.getElementById("badge-products-count");
    const orderBadge = document.getElementById("badge-orders-count");
    const reviewBadge = document.getElementById("badge-reviews-count");
    const offerBadge = document.getElementById("badge-offers-count");
    const catBadge = document.getElementById("badge-categories-count");

    if (prodBadge) prodBadge.textContent = products.length;
    if (orderBadge) orderBadge.textContent = pendingOrders || orders.length;
    if (reviewBadge) reviewBadge.textContent = pendingReviews || reviews.length;
    if (offerBadge) offerBadge.textContent = activeCoupons;
    if (catBadge) catBadge.textContent = categories.length;
  },

  formatImgUrl(url, fallback = 'product_flower_necklace.jpg') {
    if (!url) return fallback.startsWith('http') ? fallback : `../${fallback}`;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('/uploads/')) {
      return url;
    }
    return `../${url}`;
  },

  async uploadToCloudinary(file, folder = "dazzle_by_dua") {
    const token = (typeof AdminAuth !== 'undefined' && AdminAuth.getToken) ? AdminAuth.getToken() : null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: "POST",
      headers: headers,
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Cloudinary upload failed. Check backend credentials.");
    }

    return await res.json();
  },

  async handleImageUpload(e, inputId, previewId, statusId, folder = "dazzle_by_dua") {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById(statusId);
    const previewEl = document.getElementById(previewId);
    const inputEl = document.getElementById(inputId);

    if (statusEl) {
      statusEl.className = "upload-status loading";
      statusEl.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Uploading "${file.name}" to Cloudinary...`;
    }

    // Instant local preview while uploading
    try {
      const objectUrl = URL.createObjectURL(file);
      if (previewEl) previewEl.src = objectUrl;
    } catch (e) {}

    try {
      const data = await this.uploadToCloudinary(file, folder);
      if (inputEl) inputEl.value = data.secure_url;
      if (previewEl) previewEl.src = data.secure_url;

      if (statusEl) {
        statusEl.className = "upload-status success";
        statusEl.innerHTML = `<i class="fa fa-check-circle"></i> Uploaded to Cloudinary (${data.format || 'img'}, ${(data.size / 1024).toFixed(1)} KB)`;
      }
      this.showToast(`✦ "${file.name}" uploaded to Cloudinary successfully!`);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      if (statusEl) {
        statusEl.className = "upload-status error";
        statusEl.innerHTML = `<i class="fa fa-exclamation-circle"></i> ${err.message || 'Upload failed'}`;
      }
      this.showToast(err.message || "Failed to upload image to Cloudinary", "error");
    } finally {
      e.target.value = "";
    }
  },

  removeImage(inputId, previewId, fallback = "product_flower_necklace.jpg") {
    const inputEl = document.getElementById(inputId);
    const previewEl = document.getElementById(previewId);
    if (inputEl) inputEl.value = fallback;
    if (previewEl) previewEl.src = this.formatImgUrl(fallback);
    this.showToast("Image reset to default placeholder.");
  },

  renderProductGallery() {
    const listEl = document.getElementById("prod-gallery-list");
    if (!listEl) return;

    if (!this.currentProductGallery || !this.currentProductGallery.length) {
      listEl.innerHTML = `<span style="font-size:0.75rem;color:var(--text-muted);font-style:italic">No gallery photography added yet. Click below to add multiple images.</span>`;
      return;
    }

    listEl.innerHTML = this.currentProductGallery.map((imgUrl, idx) => `
      <div class="gallery-thumb-item">
        <img src="${this.formatImgUrl(imgUrl)}" alt="Gallery ${idx + 1}">
        <button type="button" class="gallery-thumb-remove" onclick="AdminApp.removeProductGalleryImage(${idx})" title="Remove this photo">&times;</button>
      </div>
    `).join("");
  },

  async handleGalleryUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const statusEl = document.getElementById("prod-gallery-status");
    if (statusEl) {
      statusEl.className = "upload-status loading";
      statusEl.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Uploading ${files.length} image(s) to Cloudinary...`;
    }

    let successCount = 0;
    for (const file of files) {
      try {
        const data = await this.uploadToCloudinary(file, "dazzle_by_dua/products");
        this.currentProductGallery.push(data.secure_url);
        successCount++;
        this.renderProductGallery();
      } catch (err) {
        console.error("Gallery upload error:", err);
        this.showToast(`Failed to upload ${file.name}: ${err.message}`, "error");
      }
    }

    if (statusEl) {
      statusEl.className = "upload-status success";
      statusEl.innerHTML = `<i class="fa fa-check-circle"></i> Added ${successCount} image(s) to gallery.`;
    }
    this.showToast(`✦ Added ${successCount} gallery image(s).`);
    e.target.value = "";
  },

  removeProductGalleryImage(idx) {
    if (idx >= 0 && idx < this.currentProductGallery.length) {
      this.currentProductGallery.splice(idx, 1);
      this.renderProductGallery();
      this.showToast("Gallery image removed.");
    }
  },

  renderComboGallery() {
    const listEl = document.getElementById("combo-gallery-list");
    if (!listEl) return;

    if (!this.currentComboGallery || !this.currentComboGallery.length) {
      listEl.innerHTML = `<span style="font-size:0.75rem;color:var(--text-muted);font-style:italic">No combo images added yet. Click below to upload.</span>`;
      return;
    }

    listEl.innerHTML = this.currentComboGallery.map((imgUrl, idx) => `
      <div class="gallery-thumb-item">
        <img src="${this.formatImgUrl(imgUrl)}" alt="Combo ${idx + 1}">
        <button type="button" class="gallery-thumb-remove" onclick="AdminApp.removeComboGalleryImage(${idx})" title="Remove image">&times;</button>
      </div>
    `).join("");
  },

  async handleComboGalleryUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const statusEl = document.getElementById("combo-gallery-status");
    if (statusEl) {
      statusEl.className = "upload-status loading";
      statusEl.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Uploading ${files.length} image(s) to Cloudinary...`;
    }

    let successCount = 0;
    for (const file of files) {
      try {
        const data = await this.uploadToCloudinary(file, "dazzle_by_dua/combos");
        this.currentComboGallery.push(data.secure_url);
        successCount++;
        this.renderComboGallery();
      } catch (err) {
        console.error("Combo upload error:", err);
        this.showToast(`Failed to upload ${file.name}: ${err.message}`, "error");
      }
    }

    if (statusEl) {
      statusEl.className = "upload-status success";
      statusEl.innerHTML = `<i class="fa fa-check-circle"></i> Added ${successCount} image(s).`;
    }
    this.showToast(`✦ Added ${successCount} combo image(s).`);
    e.target.value = "";
  },

  removeComboGalleryImage(idx) {
    if (idx >= 0 && idx < this.currentComboGallery.length) {
      this.currentComboGallery.splice(idx, 1);
      this.renderComboGallery();
      this.showToast("Combo image removed.");
    }
  },

  showToast(msg, type = "success") {
    let container = document.querySelector(".admin-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "admin-toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "admin-toast";
    const isError = type === "error";
    if (isError) {
      toast.style.borderColor = "#E53935";
      toast.style.background = "#FFF5F5";
    }
    const icon = isError ? "fa-exclamation-triangle" : "fa-gem";
    const iconColor = isError ? "#E53935" : "var(--gold)";
    toast.innerHTML = `<i class="fa ${icon}" style="color:${iconColor}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(30px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  },

  // ========================================================
  // 1. DASHBOARD VIEW
  // ========================================================
  renderDashboard() {
    const products = DazzleStore.getProducts();
    const orders = DazzleStore.getOrders();
    const reviews = DazzleStore.getReviews();
    const offers = DazzleStore.getOffers();

    // Metrics Calculations
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const inStockCount = products.filter(p => p.inStock).length;
    const outOfStockCount = products.length - inStockCount;
    const pendingOrders = orders.filter(o => ["processing", "packed"].includes((o.status || "").toLowerCase())).length;
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1) : "5.0";

    // Update Stats Widgets
    const revEl = document.getElementById("dash-revenue");
    const ordersEl = document.getElementById("dash-orders");
    const prodEl = document.getElementById("dash-products");
    const ratingEl = document.getElementById("dash-rating");

    if (revEl) revEl.textContent = `₹${totalRevenue.toLocaleString()}`;
    if (ordersEl) ordersEl.textContent = `${orders.length} Orders (${pendingOrders} Pending)`;
    if (prodEl) prodEl.textContent = `${products.length} Items (${outOfStockCount} Out of Stock)`;
    if (ratingEl) ratingEl.textContent = `${avgRating} ★ (${reviews.length} Reviews)`;

    // Recent Orders Table
    const recentOrdersTable = document.getElementById("dash-recent-orders");
    if (recentOrdersTable) {
      if (orders.length === 0) {
        recentOrdersTable.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:2rem;color:var(--text-muted)">No orders yet.</td></tr>`;
      } else {
        recentOrdersTable.innerHTML = orders.slice(0, 5).map(o => `
          <tr>
            <td><strong>#${o.id}</strong></td>
            <td>
              <div style="font-weight:600">${o.customer || 'Customer'}</div>
              <div style="font-size:0.72rem;color:var(--text-muted)">${o.email || ''}</div>
            </td>
            <td>${o.date || ''}</td>
            <td><strong>₹${Number(o.total || 0).toLocaleString()}</strong></td>
            <td><span class="badge-status ${this.getOrderStatusClass(o.status)}">${o.status}</span></td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="AdminApp.openOrderDrawer('${o.id}')">View</button>
            </td>
          </tr>
        `).join("");
      }
    }

    // Low Stock Alert Table
    const lowStockTable = document.getElementById("dash-low-stock");
    if (lowStockTable) {
      const oos = products.filter(p => !p.inStock);
      if (oos.length === 0) {
        lowStockTable.innerHTML = `<tr><td colspan="4" class="text-center" style="padding:1.5rem;color:#2E7D32"><i class="fa fa-check-circle"></i> All products are currently in stock!</td></tr>`;
      } else {
        lowStockTable.innerHTML = oos.map(p => `
          <tr>
            <td>
              <div class="prod-thumb-row">
                <img src="${this.formatImgUrl(p.img)}" class="prod-thumb" alt="${p.name}">
                <div>
                  <div class="prod-title">${p.name}</div>
                  <div class="prod-meta">${p.sku || ''}</div>
                </div>
              </div>
            </td>
            <td><strong>₹${Number(p.price).toLocaleString()}</strong></td>
            <td><span class="badge-status status-outofstock">Out of Stock</span></td>
            <td>
              <button class="btn btn-gold btn-sm" onclick="AdminApp.toggleProductStock(${p.id})">Restock</button>
            </td>
          </tr>
        `).join("");
      }
    }

    // Recent Reviews Widget
    const recentReviewsContainer = document.getElementById("dash-recent-reviews");
    if (recentReviewsContainer) {
      recentReviewsContainer.innerHTML = reviews.slice(0, 3).map(r => `
        <div style="padding:0.85rem 0;border-bottom:1px solid var(--border-color);display:flex;gap:0.75rem;align-items:flex-start">
          <div style="width:34px;height:34px;border-radius:50%;background:var(--gold-light);color:var(--gold-hover);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem">
            ${(r.name && r.name[0]) || 'D'}
          </div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <strong style="font-size:0.85rem">${r.name}</strong>
              <span style="color:var(--gold);font-size:0.8rem">${renderStars(r.rating || 5)}</span>
            </div>
            <div style="font-size:0.74rem;color:var(--text-muted);margin:2px 0">${r.product || 'General'} &bull; ${r.date || ''}</div>
            <p style="font-size:0.8rem;color:#444;margin-top:4px">&ldquo;${r.text}&rdquo;</p>
          </div>
        </div>
      `).join("");
    }
  },

  getOrderStatusClass(status) {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return "status-delivered";
    if (s === "shipped" || s === "out for delivery") return "status-shipped";
    if (s === "processing" || s === "packed") return "status-processing";
    if (s === "cancelled") return "status-cancelled";
    return "status-processing";
  },

  // ========================================================
  // 2. PRODUCTS MANAGEMENT
  // ========================================================
  renderProducts() {
    let prods = DazzleStore.getProducts();

    // Apply Filter
    if (this.productFilter === "instock") {
      prods = prods.filter(p => p.inStock);
    } else if (this.productFilter === "outofstock") {
      prods = prods.filter(p => !p.inStock);
    } else if (["necklaces", "earrings", "bracelets", "rings"].includes(this.productFilter)) {
      prods = prods.filter(p => (p.category || "").toLowerCase() === this.productFilter);
    }

    // Apply Search
    if (this.productSearch.trim()) {
      const q = this.productSearch.toLowerCase().trim();
      prods = prods.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    const tbody = document.getElementById("products-table-body");
    const countEl = document.getElementById("products-count-label");
    if (countEl) countEl.textContent = `Showing ${prods.length} products`;

    if (!tbody) return;

    if (prods.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:3rem;color:var(--text-muted)">No matching products found.</td></tr>`;
      return;
    }

    tbody.innerHTML = prods.map(p => {
      const badgesHTML = (p.badges || []).map(b => `<span class="badge badge-${b}" style="font-size:0.68rem;padding:0.15rem 0.4rem;border-radius:3px">${b}</span>`).join(" ");
      const stockBadge = p.inStock
        ? `<span class="badge-status status-instock">&#10003; In Stock</span>`
        : `<span class="badge-status status-outofstock">&#10007; Out of Stock</span>`;

      return `
        <tr data-product-id="${p.id}">
          <td>
            <div class="prod-thumb-row">
              <img src="${this.formatImgUrl(p.img)}" class="prod-thumb" alt="${p.name}" onerror="this.src='../product_flower_necklace.jpg'">
              <div>
                <div class="prod-title">${p.name}</div>
                <div class="prod-meta">SKU: ${p.sku || ('DBD-' + p.id)}</div>
              </div>
            </div>
          </td>
          <td><span style="text-transform:capitalize;font-weight:500">${p.category || 'General'}</span></td>
          <td>
            <div><strong>₹${Number(p.price).toLocaleString()}</strong></div>
            ${p.oldPrice ? `<div style="font-size:0.72rem;color:var(--text-muted);text-decoration:line-through">₹${Number(p.oldPrice).toLocaleString()}</div>` : ''}
          </td>
          <td>${stockBadge}</td>
          <td>${badgesHTML || '<span style="color:var(--text-light)">&mdash;</span>'}</td>
          <td><span style="color:var(--gold)">★</span> ${p.rating || 5} <span style="color:var(--text-muted);font-size:0.72rem">(${p.reviews || 0})</span></td>
          <td>
            <div style="display:flex;gap:0.4rem;align-items:center">
              <button class="btn btn-outline btn-sm" onclick="AdminApp.openEditProductModal(${p.id})" title="Edit Product"><i class="fa fa-pen"></i></button>
              <button class="btn btn-outline btn-sm" onclick="AdminApp.toggleProductStock(${p.id})" title="${p.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}">
                <i class="fa ${p.inStock ? 'fa-toggle-on' : 'fa-toggle-off'}" style="color:${p.inStock ? 'var(--gold)' : '#999'}"></i>
              </button>
              <a href="../product-details.html?id=${p.id}" target="_blank" class="btn btn-outline btn-sm" title="View in Store"><i class="fa fa-external-link-alt"></i></a>
              <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteProductPrompt(${p.id})" title="Delete Product"><i class="fa fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  setProductFilter(filter, el) {
    this.productFilter = filter;
    document.querySelectorAll("#product-filter-pills .filter-pill").forEach(p => p.classList.remove("active"));
    if (el) el.classList.add("active");
    this.renderProducts();
  },

  handleProductSearch(val) {
    this.productSearch = val;
    this.renderProducts();
  },

  async toggleProductStock(id) {
    const p = DazzleStore.getProductById(id);
    if (!p) return;
    const newStock = !p.inStock;
    try {
      await DazzleStore.toggleStock(id, newStock);
      this.showToast(`✦ "${p.name}" marked as ${newStock ? 'In Stock' : 'Out of Stock'} in MongoDB`);
      this.renderProducts();
      this.renderDashboard();
      this.updateSidebarBadges();
    } catch (err) {
      console.error("Toggle stock error:", err);
      this.showToast(`Failed to update stock: ${err.message || err}`, "error");
    }
  },

  openAddProductModal() {
    this.editingProductId = null;
    document.getElementById("modal-product-title").textContent = "Add New Product";
    document.getElementById("prod-form").reset();
    document.getElementById("prod-stock-check").checked = true;

    // Default image preview
    const preview = document.getElementById("prod-img-preview");
    if (preview) preview.src = this.formatImgUrl("product_flower_necklace.jpg");
    document.getElementById("prod-img").value = "product_flower_necklace.jpg";

    // Initialize gallery list
    this.currentProductGallery = ["product_flower_necklace.jpg", "featured_collection.jpg"];
    this.renderProductGallery();

    const statusEl = document.getElementById("prod-upload-status");
    if (statusEl) {
      statusEl.className = "upload-status";
      statusEl.innerHTML = `<span class="status-hint"><i class="fa fa-info-circle"></i> Ready to upload to Cloudinary</span>`;
    }

    document.getElementById("modal-product").classList.add("open");
  },

  openEditProductModal(id) {
    const p = DazzleStore.getProductById(id);
    if (!p) return;
    this.editingProductId = id;

    document.getElementById("modal-product-title").textContent = `Edit Product: ${p.name}`;
    document.getElementById("prod-name").value = p.name || "";
    document.getElementById("prod-price").value = p.price || "";
    document.getElementById("prod-old-price").value = p.oldPrice || "";
    document.getElementById("prod-category").value = (p.category || "necklaces").toLowerCase();
    document.getElementById("prod-sku").value = p.sku || `DBD-${p.id}`;
    document.getElementById("prod-stock-check").checked = !!p.inStock;
    document.getElementById("prod-img").value = p.img || "product_flower_necklace.jpg";

    // Badges
    const badges = p.badges || [];
    document.getElementById("badge-bestseller").checked = badges.includes("bestseller");
    document.getElementById("badge-new").checked = badges.includes("new");
    document.getElementById("badge-sale").checked = badges.includes("sale");
    document.getElementById("badge-offer").checked = badges.includes("offer");

    // Details
    document.getElementById("prod-material").value = p.material || "";
    document.getElementById("prod-dimensions").value = p.dimensions || "";
    document.getElementById("prod-variants").value = (p.variants || []).join(", ");
    document.getElementById("prod-desc").value = p.description || "";

    const preview = document.getElementById("prod-img-preview");
    if (preview) preview.src = this.formatImgUrl(p.img || 'product_flower_necklace.jpg');

    // Populate gallery list
    this.currentProductGallery = Array.isArray(p.images) && p.images.length ? [...p.images] : (p.img ? [p.img] : []);
    this.renderProductGallery();

    const statusEl = document.getElementById("prod-upload-status");
    if (statusEl) {
      const isCloudinary = (p.img || '').startsWith('http');
      statusEl.className = "upload-status" + (isCloudinary ? " success" : "");
      statusEl.innerHTML = isCloudinary ? `<i class="fa fa-cloud"></i> Hosted on Cloudinary` : `<span class="status-hint"><i class="fa fa-info-circle"></i> Upload to replace with Cloudinary image</span>`;
    }

    document.getElementById("modal-product").classList.add("open");
  },

  async saveProductForm(e) {
    e.preventDefault();
    const name = document.getElementById("prod-name").value.trim();
    const price = parseInt(document.getElementById("prod-price").value, 10) || 0;
    const oldPrice = parseInt(document.getElementById("prod-old-price").value, 10) || 0;
    const category = document.getElementById("prod-category").value;
    const sku = document.getElementById("prod-sku").value.trim() || `DBD-${Date.now().toString().slice(-4)}`;
    const inStock = document.getElementById("prod-stock-check").checked;
    const img = document.getElementById("prod-img").value.trim() || "product_flower_necklace.jpg";

    const badges = [];
    if (document.getElementById("badge-bestseller").checked) badges.push("bestseller");
    if (document.getElementById("badge-new").checked) badges.push("new");
    if (document.getElementById("badge-sale").checked) badges.push("sale");
    if (document.getElementById("badge-offer").checked) badges.push("offer");

    const material = document.getElementById("prod-material").value.trim();
    const dimensions = document.getElementById("prod-dimensions").value.trim();
    const variantsRaw = document.getElementById("prod-variants").value.trim();
    const variants = variantsRaw ? variantsRaw.split(",").map(v => v.trim()).filter(Boolean) : ["18K Champagne Gold"];
    const desc = document.getElementById("prod-desc").value.trim();

    const productPayload = {
      name,
      price,
      oldPrice,
      category,
      sku,
      inStock,
      img,
      badges,
      material,
      dimensions,
      variants,
      description: desc,
      images: (this.currentProductGallery && this.currentProductGallery.length) ? this.currentProductGallery : [img]
    };

    const submitBtn = e.target.querySelector('button[type="submit"]') || document.querySelector('#modal-product .btn-gold');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Saving to MongoDB...";
    }

    try {
      if (this.editingProductId) {
        await DazzleStore.updateProduct(this.editingProductId, productPayload);
        this.showToast(`✦ Product "${name}" updated successfully in MongoDB!`);
      } else {
        await DazzleStore.addProduct(productPayload);
        this.showToast(`✦ New product "${name}" added to collection and saved to MongoDB!`);
      }
      this.closeModal("modal-product");
      this.renderProducts();
      this.renderDashboard();
      this.updateSidebarBadges();
    } catch (err) {
      console.error("Save product error:", err);
      this.showToast(`Error saving product: ${err.message || err}`, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Save Product";
      }
    }
  },

  async deleteProductPrompt(id) {
    const p = DazzleStore.getProductById(id);
    if (!p) return;
    if (confirm(`Are you sure you want to delete "${p.name}"? This action removes it from MongoDB.`)) {
      try {
        await DazzleStore.deleteProduct(id);
        this.showToast(`✦ Product "${p.name}" deleted from MongoDB.`);
        this.renderProducts();
        this.renderDashboard();
        this.updateSidebarBadges();
      } catch (err) {
        console.error("Delete product error:", err);
        this.showToast(`Failed to delete product: ${err.message || err}`, "error");
      }
    }
  },

  // ========================================================
  // 3. CATEGORIES MANAGEMENT
  // ========================================================
  renderCategories() {
    const cats = DazzleStore.getCategories();
    const grid = document.getElementById("categories-grid");
    if (!grid) return;

    grid.innerHTML = cats.map(c => `
      <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
        <div>
          <div style="width:100%;height:140px;border-radius:var(--radius-sm);overflow:hidden;background:#F0EAE1;margin-bottom:1rem">
            <img src="${this.formatImgUrl(c.img)}" style="width:100%;height:140px;object-fit:cover" alt="${c.name}">
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem">
            <h3 style="font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700">${c.name}</h3>
            <span class="sidebar-badge">${c.count || 0} Products</span>
          </div>
          <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.75rem">${c.desc || 'Curated luxury collection'}</p>
          <div style="font-size:0.72rem;color:var(--text-light);font-family:monospace">Slug: ${c.id}</div>
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:1.25rem;border-top:1px solid var(--border-color);padding-top:0.85rem">
          <button class="btn btn-outline btn-sm" style="flex:1" onclick="AdminApp.openEditCategoryModal('${c.id}')"><i class="fa fa-pen"></i> Edit</button>
          <a href="../shop.html?category=${c.id}" target="_blank" class="btn btn-outline btn-sm" title="View on Shop"><i class="fa fa-external-link-alt"></i></a>
          <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteCategoryPrompt('${c.id}')" title="Delete"><i class="fa fa-trash"></i></button>
        </div>
      </div>
    `).join("");
  },

  openAddCategoryModal() {
    this.editingCategoryId = null;
    document.getElementById("modal-cat-title").textContent = "Add Category";
    document.getElementById("cat-form").reset();
    document.getElementById("cat-id").readOnly = false;
    document.getElementById("modal-category").classList.add("open");
  },

  openEditCategoryModal(id) {
    const cats = DazzleStore.getCategories();
    const c = cats.find(x => x.id === id);
    if (!c) return;
    this.editingCategoryId = id;
    document.getElementById("modal-cat-title").textContent = `Edit Category: ${c.name}`;
    document.getElementById("cat-name").value = c.name;
    document.getElementById("cat-id").value = c.id;
    document.getElementById("cat-id").readOnly = true;
    document.getElementById("cat-count").value = c.count || 0;
    document.getElementById("cat-img").value = c.img || "product_flower_necklace.jpg";
    document.getElementById("cat-desc").value = c.desc || "";
    document.getElementById("modal-category").classList.add("open");
  },

  async saveCategoryForm(e) {
    e.preventDefault();
    const id = document.getElementById("cat-id").value.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
    const name = document.getElementById("cat-name").value.trim();
    const count = parseInt(document.getElementById("cat-count").value, 10) || 0;
    const img = document.getElementById("cat-img").value.trim() || "product_flower_necklace.jpg";
    const desc = document.getElementById("cat-desc").value.trim();

    try {
      if (this.editingCategoryId) {
        await DazzleStore.updateCategory(this.editingCategoryId, { name, count, img, desc });
        this.showToast(`✦ Category "${name}" updated in MongoDB.`);
      } else {
        await DazzleStore.addCategory({ id, name, count, img, desc });
        this.showToast(`✦ Category "${name}" added to MongoDB.`);
      }
      this.closeModal("modal-category");
      this.renderCategories();
      this.updateSidebarBadges();
    } catch (err) {
      console.error("Save category error:", err);
      this.showToast(`Failed to save category: ${err.message || err}`, "error");
    }
  },

  async deleteCategoryPrompt(id) {
    if (confirm(`Are you sure you want to delete category "${id}"?`)) {
      try {
        await DazzleStore.deleteCategory(id);
        this.showToast(`✦ Category "${id}" removed from MongoDB.`);
        this.renderCategories();
        this.updateSidebarBadges();
      } catch (err) {
        console.error("Delete category error:", err);
        this.showToast(`Failed to delete category: ${err.message || err}`, "error");
      }
    }
  },

  // ========================================================
  // 4. ORDERS & FULFILLMENT
  // ========================================================
  renderOrders() {
    let orders = DazzleStore.getOrders();

    // Filter
    if (this.orderFilter !== "all") {
      orders = orders.filter(o => (o.status || "").toLowerCase() === this.orderFilter);
    }

    // Search
    if (this.orderSearch.trim()) {
      const q = this.orderSearch.toLowerCase().trim();
      orders = orders.filter(o =>
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.customer && o.customer.toLowerCase().includes(q)) ||
        (o.email && o.email.toLowerCase().includes(q)) ||
        (o.phone && o.phone.toLowerCase().includes(q))
      );
    }

    const tbody = document.getElementById("orders-table-body");
    const countEl = document.getElementById("orders-count-label");
    if (countEl) countEl.textContent = `Showing ${orders.length} orders`;

    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:3rem;color:var(--text-muted)">No orders matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => {
      const itemsCount = (o.items || []).reduce((s, it) => s + (it.qty || 1), 0);
      return `
        <tr>
          <td><strong>#${o.id}</strong></td>
          <td>
            <div style="font-weight:600">${o.customer || 'Customer'}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">${o.email || ''} &bull; ${o.phone || ''}</div>
          </td>
          <td>${o.date || 'Recent'}</td>
          <td>${itemsCount} item${itemsCount > 1 ? 's' : ''}</td>
          <td>
            <strong>₹${Number(o.total || 0).toLocaleString()}</strong>
            <div style="display:flex;align-items:center;gap:4px;margin-top:3px;flex-wrap:wrap">
              <span class="badge" style="font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700;background:${(o.paymentStatus || '').toLowerCase() === 'paid' ? '#e6f4ea' : ((o.paymentStatus || '').toLowerCase() === 'failed' ? '#fde8e8' : '#fef7e0')};color:${(o.paymentStatus || '').toLowerCase() === 'paid' ? '#137333' : ((o.paymentStatus || '').toLowerCase() === 'failed' ? '#9b1c1c' : '#b06000')}">
                ${(o.paymentStatus || 'Pending').toUpperCase()}
              </span>
              <span style="font-size:0.7rem;color:var(--text-muted)">${o.paymentMethod || 'Online'}</span>
            </div>
            ${o.razorpay_payment_id ? `<div style="font-size:0.68rem;color:var(--text-muted);font-family:monospace;margin-top:2px" title="Razorpay Payment ID">Ref: ${o.razorpay_payment_id}</div>` : (o.razorpay_order_id ? `<div style="font-size:0.68rem;color:var(--text-muted);font-family:monospace;margin-top:2px" title="Razorpay Order ID">RZP: ${o.razorpay_order_id}</div>` : '')}
          </td>
          <td>
            <select class="form-select" style="font-size:0.75rem;padding:0.35rem 0.65rem;border-radius:var(--radius-pill)" onchange="AdminApp.changeOrderStatus('${o.id}', this.value)">
              <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Packed" ${o.status === 'Packed' ? 'selected' : ''}>Packed</option>
              <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
              <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="AdminApp.openOrderDrawer('${o.id}')"><i class="fa fa-eye"></i> Details</button>
          </td>
        </tr>
      `;
    }).join("");
  },

  setOrderFilter(filter, el) {
    this.orderFilter = filter;
    document.querySelectorAll("#order-filter-pills .filter-pill").forEach(p => p.classList.remove("active"));
    if (el) el.classList.add("active");
    this.renderOrders();
  },

  handleOrderSearch(val) {
    this.orderSearch = val;
    this.renderOrders();
  },

  async changeOrderStatus(id, newStatus) {
    try {
      const updated = await DazzleStore.updateOrderStatus(id, newStatus);
      if (updated) {
        this.showToast(`✦ Order #${id} status updated to ${newStatus} in MongoDB`);
        this.renderOrders();
        this.renderDashboard();
        this.updateSidebarBadges();
        if (this.viewingOrderId === id) {
          this.openOrderDrawer(id);
        }
      }
    } catch (err) {
      console.error("Update order status error:", err);
      this.showToast(`Failed to update order status: ${err.message || err}`, "error");
    }
  },

  openOrderDrawer(id) {
    const orders = DazzleStore.getOrders();
    const o = orders.find(x => x.id === id);
    if (!o) return;
    this.viewingOrderId = id;

    document.getElementById("drawer-order-id").textContent = `#${o.id}`;
    document.getElementById("drawer-order-date").textContent = `Placed on ${o.date || 'Recent'}`;
    document.getElementById("drawer-customer-name").textContent = o.customer || "Customer";
    document.getElementById("drawer-customer-contact").textContent = `${o.email || ''} | ${o.phone || ''}`;
    document.getElementById("drawer-shipping-address").textContent = o.address || "Mumbai, India";
    const payStatus = o.paymentStatus || 'Pending';
    const payMethod = o.paymentMethod || 'Online';
    const payMethodEl = document.getElementById("drawer-payment-method");
    if (payMethodEl) {
      payMethodEl.innerHTML = `
        ${payMethod}
        <span class="badge" style="margin-left:6px;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700;background:${payStatus.toLowerCase() === 'paid' ? '#e6f4ea' : (payStatus.toLowerCase() === 'failed' ? '#fde8e8' : '#fef7e0')};color:${payStatus.toLowerCase() === 'paid' ? '#137333' : (payStatus.toLowerCase() === 'failed' ? '#9b1c1c' : '#b06000')}">
          ${payStatus.toUpperCase()}
        </span>
        ${o.razorpay_payment_id ? `<div style="font-size:0.72rem;color:var(--text-muted);font-family:monospace;margin-top:4px"><strong>Razorpay Payment ID:</strong> ${o.razorpay_payment_id}</div>` : ''}
        ${o.razorpay_order_id ? `<div style="font-size:0.72rem;color:var(--text-muted);font-family:monospace"><strong>Razorpay Order ID:</strong> ${o.razorpay_order_id}</div>` : ''}
        ${o.paid_at ? `<div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px"><strong>Paid At:</strong> ${new Date(o.paid_at).toLocaleString()}</div>` : ''}
      `;
    }

    // Status Timeline
    const steps = ["Processing", "Packed", "Shipped", "Delivered"];
    const curIdx = steps.findIndex(s => s.toLowerCase() === (o.status || "").toLowerCase());
    const timelineEl = document.getElementById("drawer-timeline");
    if (timelineEl) {
      timelineEl.innerHTML = steps.map((st, i) => {
        let cls = "";
        if (i < curIdx || (curIdx === 3 && i <= 3)) cls = "done";
        else if (i === curIdx) cls = "active";
        return `
          <div class="timeline-step ${cls}">
            <div class="timeline-dot">${i < curIdx ? '✓' : (i + 1)}</div>
            <div class="timeline-label">${st}</div>
          </div>
        `;
      }).join("");
    }

    // Items List
    const itemsList = document.getElementById("drawer-items-list");
    if (itemsList) {
      itemsList.innerHTML = (o.items || []).map(it => `
        <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid var(--border-color)">
          <img src="../${it.img || 'product_flower_necklace.jpg'}" style="width:42px;height:42px;border-radius:4px;object-fit:cover" alt="${it.name}">
          <div style="flex:1">
            <div style="font-weight:600;font-size:0.85rem">${it.name}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Qty: ${it.qty || 1} ${it.variant ? '&bull; ' + it.variant : ''}</div>
          </div>
          <div style="font-weight:700;font-size:0.85rem">₹${Number(it.price * (it.qty || 1)).toLocaleString()}</div>
        </div>
      `).join("");
    }

    document.getElementById("drawer-subtotal").textContent = `₹${Number(o.total || 0).toLocaleString()}`;
    document.getElementById("drawer-total").textContent = `₹${Number(o.total || 0).toLocaleString()}`;

    // Status button action triggers
    const statusBtns = document.getElementById("drawer-status-actions");
    if (statusBtns) {
      statusBtns.innerHTML = `
        <button class="btn btn-outline btn-sm" onclick="AdminApp.changeOrderStatus('${o.id}', 'Processing')">Processing</button>
        <button class="btn btn-outline btn-sm" onclick="AdminApp.changeOrderStatus('${o.id}', 'Packed')">Packed</button>
        <button class="btn btn-outline btn-sm" onclick="AdminApp.changeOrderStatus('${o.id}', 'Shipped')">Shipped</button>
        <button class="btn btn-gold btn-sm" onclick="AdminApp.changeOrderStatus('${o.id}', 'Delivered')">Delivered</button>
      `;
    }

    document.getElementById("drawer-order").classList.add("open");
  },

  closeOrderDrawer() {
    document.getElementById("drawer-order").classList.remove("open");
  },

  // ========================================================
  // 5. REVIEWS MANAGEMENT
  // ========================================================
  renderReviews() {
    let reviews = DazzleStore.getReviews();

    if (this.reviewFilter === "approved") {
      reviews = reviews.filter(r => r.approved !== false);
    } else if (this.reviewFilter === "pending") {
      reviews = reviews.filter(r => r.approved === false);
    }

    const tbody = document.getElementById("reviews-table-body");
    if (!tbody) return;

    if (reviews.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:3rem;color:var(--text-muted)">No reviews found.</td></tr>`;
      return;
    }

    tbody.innerHTML = reviews.map(r => `
      <tr>
        <td>
          <div style="font-weight:600">${r.name}</div>
          <div style="font-size:0.72rem;color:var(--text-muted)">${r.date || ''}</div>
        </td>
        <td><strong>${r.product || 'General'}</strong></td>
        <td><span style="color:var(--gold)">${renderStars(r.rating || 5)}</span> (${r.rating || 5})</td>
        <td style="max-width:300px"><p style="font-size:0.8rem;color:#444">&ldquo;${r.text}&rdquo;</p></td>
        <td>
          ${r.verified ? '<span style="color:#2E7D32;font-size:0.75rem;font-weight:600">&#10003; Verified</span>' : '<span style="color:var(--text-muted);font-size:0.75rem">Unverified</span>'}
        </td>
        <td>
          <span class="badge-status ${r.approved !== false ? 'status-approved' : 'status-pending'}">
            ${r.approved !== false ? 'Approved' : 'Pending'}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:0.4rem">
            <button class="btn btn-outline btn-sm" onclick="AdminApp.toggleReviewApproval(${r.id})" title="${r.approved !== false ? 'Hide Review' : 'Approve Review'}">
              <i class="fa ${r.approved !== false ? 'fa-eye-slash' : 'fa-check'}"></i>
            </button>
            <button class="btn btn-outline btn-sm" onclick="AdminApp.openEditReviewModal(${r.id})" title="Edit Review"><i class="fa fa-pen"></i></button>
            <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteReviewPrompt(${r.id})" title="Delete Review"><i class="fa fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  setReviewFilter(filter, el) {
    this.reviewFilter = filter;
    document.querySelectorAll("#review-filter-pills .filter-pill").forEach(p => p.classList.remove("active"));
    if (el) el.classList.add("active");
    this.renderReviews();
  },

  async toggleReviewApproval(id) {
    const reviews = DazzleStore.getReviews();
    const r = reviews.find(x => x.id === parseInt(id, 10));
    if (!r) return;
    const newStatus = r.approved === false ? true : false;
    await DazzleStore.updateReview(id, { approved: newStatus });
    this.showToast(`✦ Review from "${r.name}" marked as ${newStatus ? 'Approved' : 'Hidden'} in MongoDB`);
    this.renderReviews();
    this.updateSidebarBadges();
  },

  openAddReviewModal() {
    this.editingReviewId = null;
    document.getElementById("modal-review-title").textContent = "Add Customer Review";
    document.getElementById("review-form").reset();
    document.getElementById("rev-verified").checked = true;
    document.getElementById("rev-approved").checked = true;

    // Populate products select
    const prodSelect = document.getElementById("rev-product");
    if (prodSelect) {
      const prods = DazzleStore.getProducts();
      prodSelect.innerHTML = `<option value="General">General Store Review</option>` +
        prods.map(p => `<option value="${p.name}">${p.name}</option>`).join("");
    }

    document.getElementById("modal-review").classList.add("open");
  },

  openEditReviewModal(id) {
    const reviews = DazzleStore.getReviews();
    const r = reviews.find(x => x.id === parseInt(id, 10));
    if (!r) return;
    this.editingReviewId = id;

    document.getElementById("modal-review-title").textContent = `Edit Review: ${r.name}`;
    document.getElementById("rev-name").value = r.name || "";
    document.getElementById("rev-rating").value = r.rating || 5;
    document.getElementById("rev-text").value = r.text || "";
    document.getElementById("rev-verified").checked = !!r.verified;
    document.getElementById("rev-approved").checked = r.approved !== false;

    const prodSelect = document.getElementById("rev-product");
    if (prodSelect) {
      const prods = DazzleStore.getProducts();
      prodSelect.innerHTML = `<option value="General">General Store Review</option>` +
        prods.map(p => `<option value="${p.name}" ${p.name === r.product ? 'selected' : ''}>${p.name}</option>`).join("");
    }

    document.getElementById("modal-review").classList.add("open");
  },

  async saveReviewForm(e) {
    e.preventDefault();
    const name = document.getElementById("rev-name").value.trim();
    const product = document.getElementById("rev-product").value;
    const rating = parseInt(document.getElementById("rev-rating").value, 10) || 5;
    const text = document.getElementById("rev-text").value.trim();
    const verified = document.getElementById("rev-verified").checked;
    const approved = document.getElementById("rev-approved").checked;

    try {
      if (this.editingReviewId) {
        await DazzleStore.updateReview(this.editingReviewId, { name, product, rating, text, verified, approved });
        this.showToast(`✦ Review from "${name}" updated.`);
      } else {
        await DazzleStore.addReview({ name, product, rating, text, verified, approved });
        this.showToast(`✦ Review from "${name}" added.`);
      }
      this.closeModal("modal-review");
      this.renderReviews();
      this.renderDashboard();
      this.updateSidebarBadges();
    } catch (err) {
      console.error("Save review error:", err);
      this.showToast(`Failed to save review: ${err.message || err}`, "error");
    }
  },

  async deleteReviewPrompt(id) {
    if (confirm("Are you sure you want to delete this customer review?")) {
      try {
        await DazzleStore.deleteReview(id);
        this.showToast("✦ Review removed.");
        this.renderReviews();
        this.updateSidebarBadges();
      } catch (err) {
        console.error("Delete review error:", err);
        this.showToast(`Failed to delete review: ${err.message || err}`, "error");
      }
    }
  },

  // ========================================================
  // 6. OFFERS, COUPONS & COMBOS
  // ========================================================
  renderOffers() {
    const offers = DazzleStore.getOffers();

    // Coupons Table
    const couponTbody = document.getElementById("coupons-table-body");
    if (couponTbody) {
      couponTbody.innerHTML = (offers.coupons || []).map(c => `
        <tr>
          <td><strong style="color:var(--gold);letter-spacing:0.04em">${c.code}</strong></td>
          <td>${c.title || c.code}</td>
          <td>${c.type === 'free_shipping' ? 'Free Express Shipping' : c.discount + '% OFF'}</td>
          <td>₹${Number(c.minOrder || 0).toLocaleString()}</td>
          <td>${c.expiry || 'No Expiry'}</td>
          <td>
            <span class="badge-status ${c.active !== false ? 'status-approved' : 'status-outofstock'}">
              ${c.active !== false ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td>
            <div style="display:flex;gap:0.4rem">
              <button class="btn btn-outline btn-sm" onclick="AdminApp.openEditCouponModal('${c.id}')"><i class="fa fa-pen"></i></button>
              <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteCouponPrompt('${c.id}')"><i class="fa fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join("");
    }

    // Combos Grid
    const combosGrid = document.getElementById("combos-admin-grid");
    if (combosGrid) {
      combosGrid.innerHTML = (offers.combos || []).map(cb => `
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
              <h3 style="font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700">${cb.name}</h3>
              <span class="sidebar-badge">${cb.discount || 'Special'}</span>
            </div>
            <div style="display:flex;gap:0.4rem;margin-bottom:1rem">
              ${(cb.images || []).map(img => `<img src="../${img}" style="width:48px;height:48px;border-radius:4px;object-fit:cover;border:1px solid var(--border-color)" alt="item">`).join("")}
            </div>
            <ul style="font-size:0.78rem;color:var(--text-muted);padding-left:1.2rem;margin-bottom:1rem">
              ${(cb.items || []).map(it => `<li>${it}</li>`).join("")}
            </ul>
            <div style="display:flex;align-items:baseline;gap:0.5rem">
              <span style="font-size:1.1rem;font-weight:700">₹${Number(cb.price).toLocaleString()}</span>
              <span style="font-size:0.8rem;color:var(--text-muted);text-decoration:line-through">₹${Number(cb.oldPrice).toLocaleString()}</span>
            </div>
          </div>
          <div style="display:flex;gap:0.5rem;margin-top:1.25rem;border-top:1px solid var(--border-color);padding-top:0.85rem">
            <button class="btn btn-outline btn-sm" style="flex:1" onclick="AdminApp.openEditComboModal('${cb.id}')"><i class="fa fa-pen"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteComboPrompt('${cb.id}')"><i class="fa fa-trash"></i></button>
          </div>
        </div>
      `).join("");
    }
  },

  openAddCouponModal() {
    this.editingCouponId = null;
    document.getElementById("modal-coupon-title").textContent = "Add Coupon Code";
    document.getElementById("coupon-form").reset();
    document.getElementById("cp-active").checked = true;
    document.getElementById("modal-coupon").classList.add("open");
  },

  openEditCouponModal(id) {
    const offers = DazzleStore.getOffers();
    const c = (offers.coupons || []).find(x => x.id === id);
    if (!c) return;
    this.editingCouponId = id;
    document.getElementById("modal-coupon-title").textContent = `Edit Coupon: ${c.code}`;
    document.getElementById("cp-code").value = c.code;
    document.getElementById("cp-title").value = c.title || "";
    document.getElementById("cp-type").value = c.type || "percent";
    document.getElementById("cp-discount").value = c.discount || 0;
    document.getElementById("cp-minorder").value = c.minOrder || 0;
    document.getElementById("cp-expiry").value = c.expiry || "";
    document.getElementById("cp-desc").value = c.desc || "";
    document.getElementById("cp-badge").value = c.badge || "Special Offer";
    document.getElementById("cp-active").checked = c.active !== false;
    document.getElementById("modal-coupon").classList.add("open");
  },

  async saveCouponForm(e) {
    e.preventDefault();
    const code = document.getElementById("cp-code").value.trim().toUpperCase();
    const title = document.getElementById("cp-title").value.trim();
    const type = document.getElementById("cp-type").value;
    const discount = parseInt(document.getElementById("cp-discount").value, 10) || 0;
    const minOrder = parseInt(document.getElementById("cp-minorder").value, 10) || 0;
    const expiry = document.getElementById("cp-expiry").value.trim();
    const desc = document.getElementById("cp-desc").value.trim();
    const badge = document.getElementById("cp-badge").value.trim() || "Offer";
    const active = document.getElementById("cp-active").checked;

    const payload = { code, title, type, discount, minOrder, expiry, desc, badge, active };

    try {
      if (this.editingCouponId) {
        await DazzleStore.updateCoupon(this.editingCouponId, payload);
        this.showToast(`✦ Coupon "${code}" updated in MongoDB.`);
      } else {
        payload.id = `cp-${Date.now().toString().slice(-4)}`;
        await DazzleStore.addCoupon(payload);
        this.showToast(`✦ Coupon "${code}" created in MongoDB.`);
      }
      this.closeModal("modal-coupon");
      this.renderOffers();
      this.updateSidebarBadges();
    } catch (err) {
      console.error("Save coupon error:", err);
      this.showToast(`Failed to save coupon: ${err.message || err}`, "error");
    }
  },

  async deleteCouponPrompt(id) {
    if (confirm("Delete this coupon code?")) {
      await DazzleStore.deleteCoupon(id);
      this.showToast("✦ Coupon deleted from MongoDB.");
      this.renderOffers();
      this.updateSidebarBadges();
    }
  },

  openAddComboModal() {
    this.editingComboId = null;
    document.getElementById("modal-combo-title").textContent = "Add Jewellery Combo";
    document.getElementById("combo-form").reset();
    this.currentComboGallery = ["product_flower_necklace.jpg", "product_pearl_earrings.jpg"];
    this.renderComboGallery();
    document.getElementById("modal-combo").classList.add("open");
  },

  openEditComboModal(id) {
    const offers = DazzleStore.getOffers();
    const cb = (offers.combos || []).find(x => x.id === id);
    if (!cb) return;
    this.editingComboId = id;
    document.getElementById("modal-combo-title").textContent = `Edit Combo: ${cb.name}`;
    document.getElementById("combo-name").value = cb.name;
    document.getElementById("combo-discount").value = cb.discount || "";
    document.getElementById("combo-price").value = cb.price || 0;
    document.getElementById("combo-oldprice").value = cb.oldPrice || 0;
    document.getElementById("combo-items").value = (cb.items || []).join(", ");
    this.currentComboGallery = Array.isArray(cb.images) ? [...cb.images] : [];
    this.renderComboGallery();
    document.getElementById("modal-combo").classList.add("open");
  },

  async saveComboForm(e) {
    e.preventDefault();
    const name = document.getElementById("combo-name").value.trim();
    const discount = document.getElementById("combo-discount").value.trim();
    const price = parseInt(document.getElementById("combo-price").value, 10) || 0;
    const oldPrice = parseInt(document.getElementById("combo-oldprice").value, 10) || 0;
    const itemsRaw = document.getElementById("combo-items").value.trim();
    const items = itemsRaw ? itemsRaw.split(",").map(i => i.trim()).filter(Boolean) : [];
    const images = (this.currentComboGallery && this.currentComboGallery.length) ? this.currentComboGallery : ["product_flower_necklace.jpg"];

    const payload = { name, discount, price, oldPrice, items, images };

    try {
      if (this.editingComboId) {
        await DazzleStore.updateCombo(this.editingComboId, payload);
        this.showToast(`✦ Combo "${name}" updated in MongoDB.`);
      } else {
        payload.id = `cb-${Date.now().toString().slice(-4)}`;
        await DazzleStore.addCombo(payload);
        this.showToast(`✦ Combo "${name}" created in MongoDB.`);
      }
      this.closeModal("modal-combo");
      this.renderOffers();
    } catch (err) {
      console.error("Save combo error:", err);
      this.showToast(`Failed to save combo: ${err.message || err}`, "error");
    }
  },

  async deleteComboPrompt(id) {
    if (confirm("Delete this jewellery combo set?")) {
      await DazzleStore.deleteCombo(id);
      this.showToast("✦ Combo deleted from MongoDB.");
      this.renderOffers();
    }
  },

  // ========================================================
  // 7. HOMEPAGE MANAGER
  // ========================================================
  renderHomepageManager() {
    const hp = DazzleStore.getHomepage();

    // 1. Announcement
    document.getElementById("hp-ann-enabled").checked = hp.announcement?.enabled !== false;
    document.getElementById("hp-ann-text").value = hp.announcement?.text || "";
    document.getElementById("hp-ann-link-text").value = hp.announcement?.linkText || "";
    document.getElementById("hp-ann-link-url").value = hp.announcement?.linkUrl || "";

    // 2. Hero
    document.getElementById("hp-hero-enabled").checked = hp.hero?.enabled !== false;
    document.getElementById("hp-hero-tag").value = hp.hero?.tag || "";
    document.getElementById("hp-hero-title").value = hp.hero?.title || "";
    document.getElementById("hp-hero-desc").value = hp.hero?.desc || "";
    document.getElementById("hp-hero-bg").value = hp.hero?.bgImg || "hero_necklace.jpg";
    document.getElementById("hp-hero-btn1-text").value = hp.hero?.btn1Text || "";
    document.getElementById("hp-hero-btn1-url").value = hp.hero?.btn1Url || "";
    document.getElementById("hp-hero-btn2-text").value = hp.hero?.btn2Text || "";
    document.getElementById("hp-hero-btn2-url").value = hp.hero?.btn2Url || "";

    // 3. Categories Strip
    document.getElementById("hp-cat-enabled").checked = hp.categories?.enabled !== false;
    document.getElementById("hp-cat-tag").value = hp.categories?.tag || "";
    document.getElementById("hp-cat-title").value = hp.categories?.title || "";

    // 4. New Arrivals
    document.getElementById("hp-new-enabled").checked = hp.newArrivals?.enabled !== false;
    document.getElementById("hp-new-tag").value = hp.newArrivals?.tag || "";
    document.getElementById("hp-new-title").value = hp.newArrivals?.title || "";
    document.getElementById("hp-new-count").value = hp.newArrivals?.count || 4;

    // 5. Featured Collection
    document.getElementById("hp-feat-enabled").checked = hp.featured?.enabled !== false;
    document.getElementById("hp-feat-tag").value = hp.featured?.tag || "";
    document.getElementById("hp-feat-title").value = hp.featured?.title || "";
    document.getElementById("hp-feat-desc").value = hp.featured?.desc || "";
    document.getElementById("hp-feat-img").value = hp.featured?.img || "featured_collection.jpg";
    document.getElementById("hp-feat-btn-text").value = hp.featured?.btnText || "";
    document.getElementById("hp-feat-btn-url").value = hp.featured?.btnUrl || "";
    document.getElementById("hp-feat-stat1-num").value = hp.featured?.stat1Num || "500+";
    document.getElementById("hp-feat-stat1-lbl").value = hp.featured?.stat1Label || "Happy Customers";
    document.getElementById("hp-feat-stat2-num").value = hp.featured?.stat2Num || "50+";
    document.getElementById("hp-feat-stat2-lbl").value = hp.featured?.stat2Label || "Unique Designs";
    document.getElementById("hp-feat-stat3-num").value = hp.featured?.stat3Num || "4.8★";
    document.getElementById("hp-feat-stat3-lbl").value = hp.featured?.stat3Label || "Avg. Rating";

    // 6. Why Choose Us
    document.getElementById("hp-why-enabled").checked = hp.whyChooseUs?.enabled !== false;
    document.getElementById("hp-why-tag").value = hp.whyChooseUs?.tag || "";
    document.getElementById("hp-why-title").value = hp.whyChooseUs?.title || "";
    document.getElementById("hp-why-sub").value = hp.whyChooseUs?.subtitle || "";

    // 7. Reviews Section
    document.getElementById("hp-rev-enabled").checked = hp.reviewsSection?.enabled !== false;
    document.getElementById("hp-rev-tag").value = hp.reviewsSection?.tag || "";
    document.getElementById("hp-rev-title").value = hp.reviewsSection?.title || "";

    // 8. Instagram Section
    document.getElementById("hp-insta-enabled").checked = hp.instagram?.enabled !== false;
    document.getElementById("hp-insta-tag").value = hp.instagram?.tag || "";
    document.getElementById("hp-insta-handle").value = hp.instagram?.handle || "";
    document.getElementById("hp-insta-sub").value = hp.instagram?.subtitle || "";

    // 9. Footer
    document.getElementById("hp-foot-tagline").value = hp.footer?.tagline || "";
    document.getElementById("hp-foot-copy").value = hp.footer?.copyright || "";
  },

  async saveHomepageManager(e) {
    if (e) e.preventDefault();
    const existing = DazzleStore.getHomepage();

    const updated = {
      announcement: {
        enabled: document.getElementById("hp-ann-enabled").checked,
        text: document.getElementById("hp-ann-text").value,
        linkText: document.getElementById("hp-ann-link-text").value,
        linkUrl: document.getElementById("hp-ann-link-url").value
      },
      hero: {
        enabled: document.getElementById("hp-hero-enabled").checked,
        tag: document.getElementById("hp-hero-tag").value,
        title: document.getElementById("hp-hero-title").value,
        desc: document.getElementById("hp-hero-desc").value,
        bgImg: document.getElementById("hp-hero-bg").value,
        btn1Text: document.getElementById("hp-hero-btn1-text").value,
        btn1Url: document.getElementById("hp-hero-btn1-url").value,
        btn2Text: document.getElementById("hp-hero-btn2-text").value,
        btn2Url: document.getElementById("hp-hero-btn2-url").value
      },
      categories: {
        enabled: document.getElementById("hp-cat-enabled").checked,
        tag: document.getElementById("hp-cat-tag").value,
        title: document.getElementById("hp-cat-title").value
      },
      newArrivals: {
        enabled: document.getElementById("hp-new-enabled").checked,
        tag: document.getElementById("hp-new-tag").value,
        title: document.getElementById("hp-new-title").value,
        count: parseInt(document.getElementById("hp-new-count").value, 10) || 4
      },
      featured: {
        enabled: document.getElementById("hp-feat-enabled").checked,
        tag: document.getElementById("hp-feat-tag").value,
        title: document.getElementById("hp-feat-title").value,
        desc: document.getElementById("hp-feat-desc").value,
        img: document.getElementById("hp-feat-img").value,
        btnText: document.getElementById("hp-feat-btn-text").value,
        btnUrl: document.getElementById("hp-feat-btn-url").value,
        stat1Num: document.getElementById("hp-feat-stat1-num").value,
        stat1Label: document.getElementById("hp-feat-stat1-lbl").value,
        stat2Num: document.getElementById("hp-feat-stat2-num").value,
        stat2Label: document.getElementById("hp-feat-stat2-lbl").value,
        stat3Num: document.getElementById("hp-feat-stat3-num").value,
        stat3Label: document.getElementById("hp-feat-stat3-lbl").value
      },
      whyChooseUs: {
        ...existing.whyChooseUs,
        enabled: document.getElementById("hp-why-enabled").checked,
        tag: document.getElementById("hp-why-tag").value,
        title: document.getElementById("hp-why-title").value,
        subtitle: document.getElementById("hp-why-sub").value
      },
      reviewsSection: {
        enabled: document.getElementById("hp-rev-enabled").checked,
        tag: document.getElementById("hp-rev-tag").value,
        title: document.getElementById("hp-rev-title").value
      },
      instagram: {
        ...existing.instagram,
        enabled: document.getElementById("hp-insta-enabled").checked,
        tag: document.getElementById("hp-insta-tag").value,
        handle: document.getElementById("hp-insta-handle").value,
        subtitle: document.getElementById("hp-insta-sub").value
      },
      footer: {
        enabled: true,
        tagline: document.getElementById("hp-foot-tagline").value,
        copyright: document.getElementById("hp-foot-copy").value
      }
    };

    await DazzleStore.saveHomepage(updated);
    this.showToast("✦ Homepage content saved to MongoDB! Live on index.html");
  },

  // ========================================================
  // 8. PAGES & CONTENT
  // ========================================================
  renderPages() {
    // Basic static pages manager
  },

  // ========================================================
  // 9. NAVIGATION
  // ========================================================
  renderNavigation() {
    const nav = DazzleStore.getNavigation();
    const list = document.getElementById("nav-header-list");
    if (!list) return;

    list.innerHTML = (nav.header || []).map((item, i) => `
      <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:#FFF;border:1px solid var(--border-color);border-radius:var(--radius-sm);margin-bottom:0.5rem">
        <i class="fa fa-bars" style="color:var(--text-light);cursor:grab"></i>
        <div style="flex:1">
          <input type="text" class="form-control" value="${item.name}" onchange="AdminApp.updateNavItem(${i}, 'name', this.value)" style="font-weight:600">
        </div>
        <div style="flex:1">
          <input type="text" class="form-control" value="${item.href}" onchange="AdminApp.updateNavItem(${i}, 'href', this.value)">
        </div>
        <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteNavItem(${i})" title="Remove"><i class="fa fa-trash"></i></button>
      </div>
    `).join("");
  },

  async updateNavItem(idx, field, val) {
    const nav = DazzleStore.getNavigation();
    if (nav.header && nav.header[idx]) {
      nav.header[idx][field] = val;
      await DazzleStore.saveNavigation(nav);
      this.showToast("✦ Navigation link updated.");
    }
  },

  async addNavItem() {
    const name = prompt("Enter Link Name (e.g. Lookbook):");
    if (!name) return;
    const href = prompt("Enter Link URL (e.g. shop.html):", "shop.html");
    if (!href) return;
    const nav = DazzleStore.getNavigation();
    nav.header = nav.header || [];
    nav.header.push({ name, href });
    await DazzleStore.saveNavigation(nav);
    this.renderNavigation();
    this.showToast("✦ Navigation link added.");
  },

  async deleteNavItem(idx) {
    const nav = DazzleStore.getNavigation();
    if (nav.header) {
      nav.header.splice(idx, 1);
      await DazzleStore.saveNavigation(nav);
      this.renderNavigation();
      this.showToast("✦ Navigation link removed.");
    }
  },

  // ========================================================
  // 10. MEDIA ASSET GALLERY
  // ========================================================
  async renderMedia() {
    const grid = document.getElementById("media-gallery-grid");
    if (!grid) return;

    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted)"><i class="fa fa-spinner fa-spin fa-2x"></i><p style="margin-top:0.5rem">Loading media library...</p></div>`;

    let items = [];
    try {
      const res = await fetch(`${API_BASE_URL}/api/media`);
      if (res.ok) {
        items = await res.json();
      }
    } catch (e) {
      console.warn("Could not fetch media list from API:", e);
    }

    const defaultMedia = [
      { filename: "product_flower_necklace.jpg", title: "Flower Pendant Necklace", type: "Store Photography", url: "product_flower_necklace.jpg" },
      { filename: "product_pearl_earrings.jpg", title: "Pearl Drop Earrings", type: "Store Photography", url: "product_pearl_earrings.jpg" },
      { filename: "product_bracelet.jpg", title: "Delicate Chain Bracelet", type: "Store Photography", url: "product_bracelet.jpg" },
      { filename: "product_ring.jpg", title: "Minimal Diamond Ring", type: "Store Photography", url: "product_ring.jpg" },
      { filename: "hero_necklace.jpg", title: "Luxury Model Hero", type: "Hero Banner", url: "hero_necklace.jpg" },
      { filename: "featured_collection.jpg", title: "Grace Collection Banner", type: "Collection Banner", url: "featured_collection.jpg" },
      { filename: "marble_bg.jpg", title: "Luxury Marble Texture", type: "Background", url: "marble_bg.jpg" }
    ];

    const combined = [...items];
    const seen = new Set(items.map(x => x.filename || x.url));
    for (const d of defaultMedia) {
      if (!seen.has(d.filename) && !seen.has(d.url)) {
        combined.push(d);
      }
    }

    grid.innerHTML = combined.map(m => {
      const displayUrl = m.secure_url || m.url || m.filename;
      const fullImgSrc = this.formatImgUrl(displayUrl);
      const isCloudinary = displayUrl.startsWith("http://") || displayUrl.startsWith("https://");
      const pubId = m.public_id || m.filename;

      return `
        <div class="media-card">
          <div class="media-thumb-wrap" style="position:relative;height:160px;background:#F0EAE1;overflow:hidden">
            <img src="${fullImgSrc}" alt="${m.title || m.filename}" style="width:100%;height:100%;object-fit:cover" loading="lazy">
            ${isCloudinary ? `<span style="position:absolute;top:6px;left:6px;background:rgba(26,26,26,0.8);color:var(--gold);font-size:0.68rem;padding:2px 6px;border-radius:3px;font-weight:600"><i class="fa fa-cloud"></i> Cloudinary</span>` : ''}
          </div>
          <div class="media-details" style="padding:0.85rem">
            <div class="media-filename" style="font-weight:600;font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${m.filename || displayUrl}">${m.filename || 'Cloudinary Image'}</div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin:0.2rem 0">${m.title || (isCloudinary ? 'Cloudinary Photography' : 'Store Asset')}</div>
            <div class="media-actions" style="display:flex;gap:0.4rem;margin-top:0.65rem">
              <button type="button" class="btn btn-outline btn-xs" style="flex:1" onclick="AdminApp.copyMediaUrl('${displayUrl}')" title="Copy URL">
                <i class="fa fa-copy"></i> Copy URL
              </button>
              <a href="${fullImgSrc}" target="_blank" class="btn btn-outline btn-xs" title="View Full Image">
                <i class="fa fa-external-link-alt"></i>
              </a>
              ${m.id && isCloudinary ? `
              <button type="button" class="btn btn-danger btn-xs" onclick="AdminApp.deleteMediaPrompt('${pubId}')" title="Delete from Cloudinary">
                <i class="fa fa-trash"></i>
              </button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  async handleMediaLibraryUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    this.showToast(`✦ Uploading ${files.length} file(s) to Cloudinary...`);
    let count = 0;
    for (const file of files) {
      try {
        await this.uploadToCloudinary(file, "dazzle_by_dua/media");
        count++;
      } catch (err) {
        console.error("Media upload error:", err);
        this.showToast(`Upload failed for ${file.name}: ${err.message}`, "error");
      }
    }

    this.showToast(`✦ Successfully uploaded ${count} file(s) to Cloudinary!`);
    e.target.value = "";
    this.renderMedia();
  },

  async deleteMediaPrompt(identifier) {
    if (confirm("Are you sure you want to delete this media asset from Cloudinary and MongoDB?")) {
      try {
        const token = (typeof AdminAuth !== 'undefined' && AdminAuth.getToken) ? AdminAuth.getToken() : null;
        const res = await fetch(`${API_BASE_URL}/api/media/${encodeURIComponent(identifier)}`, {
          method: "DELETE",
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error("Deletion failed on server.");
        this.showToast("Media asset deleted from Cloudinary & database.");
        this.renderMedia();
      } catch (err) {
        console.error("Delete media error:", err);
        this.showToast(err.message || "Failed to delete media", "error");
      }
    }
  },

  copyMediaUrl(name) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(name).then(() => {
        this.showToast(`✦ Image path copied: "${name}"`);
      });
    } else {
      prompt("Copy image filename:", name);
    }
  },

  // ========================================================
  // 11. SETTINGS & DATA BACKUP / RESET
  // ========================================================
  renderSettings() {
    const s = DazzleStore.getSettings();
    document.getElementById("set-name").value = s.siteName || "Dazzle by Dua";
    document.getElementById("set-tagline").value = s.tagline || "Fine Jewellery";
    document.getElementById("set-email").value = s.email || "contact@dazzlebydua.com";
    document.getElementById("set-phone").value = s.phone || "+91 98765 43210";
    document.getElementById("set-address").value = s.address || "Mumbai, India";
    document.getElementById("set-currency").value = s.currency || "₹";
    document.getElementById("set-freeship").value = s.freeShippingThreshold || 2500;
    document.getElementById("set-instagram").value = s.social?.instagram || "";
    document.getElementById("set-whatsapp").value = s.social?.whatsapp || "";
  },

  async saveSettingsForm(e) {
    e.preventDefault();
    const updated = {
      siteName: document.getElementById("set-name").value.trim(),
      tagline: document.getElementById("set-tagline").value.trim(),
      email: document.getElementById("set-email").value.trim(),
      phone: document.getElementById("set-phone").value.trim(),
      address: document.getElementById("set-address").value.trim(),
      currency: document.getElementById("set-currency").value.trim(),
      freeShippingThreshold: parseInt(document.getElementById("set-freeship").value, 10) || 2500,
      social: {
        instagram: document.getElementById("set-instagram").value.trim(),
        whatsapp: document.getElementById("set-whatsapp").value.trim()
      }
    };
    await DazzleStore.saveSettings(updated);
    this.showToast("✦ Store settings saved to MongoDB successfully!");
  },

  exportStoreData() {
    const json = DazzleStore.exportAll();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dazzle_store_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("✦ Store backup JSON downloaded!");
  },

  openImportModal() {
    document.getElementById("import-json-area").value = "";
    document.getElementById("modal-import").classList.add("open");
  },

  confirmImportData() {
    const text = document.getElementById("import-json-area").value.trim();
    if (!text) {
      alert("Please paste valid JSON data to import.");
      return;
    }
    const success = DazzleStore.importAll(text);
    if (success) {
      this.closeModal("modal-import");
      this.showToast("✦ Store data successfully restored from backup!");
      this.renderCurrentView();
      this.updateSidebarBadges();
    } else {
      alert("Invalid JSON data format. Import aborted.");
    }
  },

  async resetStoreDataPrompt() {
    if (confirm("Reset the entire Dazzle by Dua store to initial factory defaults in MongoDB? This will restore original products, categories, reviews, and orders.")) {
      await DazzleStore.resetAll();
      this.showToast("✦ Store reset to factory defaults in MongoDB.");
      this.renderCurrentView();
      this.updateSidebarBadges();
    }
  },

  // ---- Modal Helpers ----
  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("open");
  },

  setupEventListeners() {
    // Backdrop clicks to close modals
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("open");
        }
      });
    });

    const drawerBackdrop = document.getElementById("drawer-order");
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener("click", (e) => {
        if (e.target === drawerBackdrop) {
          drawerBackdrop.classList.remove("open");
        }
      });
    }

    // Image URL live preview in product form
    const prodImgInput = document.getElementById("prod-img");
    const prodImgPreview = document.getElementById("prod-img-preview");
    if (prodImgInput && prodImgPreview) {
      prodImgInput.addEventListener("input", () => {
        const val = prodImgInput.value.trim();
        prodImgPreview.src = val.startsWith("http") ? val : `../${val}`;
      });
    }
  }
};

// Expose globally to window so that all inline onclick and onsubmit handlers can access AdminApp
var AdminApp = window.AdminApp;
window.AdminApp = AdminApp;

// Initialize on DOM Ready or immediately if DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    AdminApp.init();
  });
} else {
  AdminApp.init();
}
