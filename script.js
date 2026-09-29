/* ========================================================
   DAZZLE BY DUA - Centralized Store & Shared JS
   Centralized Data Layer for Store & Admin Panel
   ======================================================== */

const API_BASE_URL = "https://dazzle-backend-69un.onrender.com";
window.API_BASE_URL = API_BASE_URL;

// ---- Default Initial Data ----
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Flower Pendant Necklace",
    price: 4990,
    oldPrice: 6990,
    category: "necklaces",
    rating: 4.8,
    reviews: 24,
    img: "product_flower_necklace.jpg",
    badges: ["bestseller"],
    inStock: true,
    sku: "DBD-NC-001",
    material: "18K Champagne Gold Vermeil & Natural Freshwater Pearl",
    dimensions: "Pendant 18mm x 18mm | Chain length: 42cm + 5cm extension",
    description: "An ode to blooming elegance, this Flower Pendant Necklace features delicately sculpted petals set with shimmering pavé accents, culminating in a radiant freshwater pearl at the center. Hand-crafted and finished in our signature 18K champagne gold vermeil.",
    variants: ["18K Champagne Gold", "Rose Gold Vermeil", "Sterling Silver"],
    images: ["product_flower_necklace.jpg", "hero_necklace.jpg", "featured_collection.jpg"]
  },
  {
    id: 2,
    name: "Pearl Drop Earrings",
    price: 3990,
    oldPrice: 5990,
    category: "earrings",
    rating: 4.9,
    reviews: 18,
    img: "product_pearl_earrings.jpg",
    badges: ["new"],
    inStock: true,
    sku: "DBD-ER-002",
    material: "18K Gold Plated Brass & Grade-AAA Freshwater Pearls",
    dimensions: "Drop length: 32mm | Pearl diameter: 9mm",
    description: "Graceful and captivating, the Pearl Drop Earrings frame your features with luminous freshwater pearls suspended from delicate diamond-accented hoop huggies. Designed to move subtly with your every step.",
    variants: ["18K Champagne Gold", "Classic White Gold"],
    images: ["product_pearl_earrings.jpg", "featured_collection.jpg", "hero_necklace.jpg"]
  },
  {
    id: 3,
    name: "Delicate Chain Bracelet",
    price: 5990,
    oldPrice: 7490,
    category: "bracelets",
    rating: 4.7,
    reviews: 22,
    img: "product_bracelet.jpg",
    badges: [],
    inStock: true,
    sku: "DBD-BR-003",
    material: "18K Champagne Gold Vermeil over Sterling Silver",
    dimensions: "Length: 16cm + 3.5cm extender",
    description: "Subtle luxury for every day. Our Delicate Chain Bracelet features fine interlocking links interwoven with dainty droplet charms that catch the light from every angle. Perfect for wearing solo or layering.",
    variants: ["18K Champagne Gold", "Sterling Silver"],
    images: ["product_bracelet.jpg", "featured_collection.jpg", "product_ring.jpg"]
  },
  {
    id: 4,
    name: "Minimal Diamond Ring",
    price: 4690,
    oldPrice: 6690,
    category: "rings",
    rating: 4.6,
    reviews: 31,
    img: "product_ring.jpg",
    badges: ["sale"],
    inStock: true,
    sku: "DBD-RG-004",
    material: "18K Champagne Gold Vermeil & Solitaire Cubic Zirconia",
    dimensions: "Band width: 1.4mm | Solitaire: 4mm",
    description: "The epitome of refined modern minimalism. This ring showcases a solitary brilliant-cut solitaire set upon an ultra-slim champagne gold band. Designed for seamless stacking or understated everyday luxury.",
    variants: ["Size 6 (16.5mm)", "Size 7 (17.3mm)", "Size 8 (18.1mm)"],
    images: ["product_ring.jpg", "featured_collection.jpg", "product_bracelet.jpg"]
  },
  {
    id: 5,
    name: "Gold Hoop Earrings",
    price: 2990,
    oldPrice: 3990,
    category: "earrings",
    rating: 4.5,
    reviews: 15,
    img: "product_pearl_earrings.jpg",
    badges: [],
    inStock: true,
    sku: "DBD-ER-005",
    material: "18K Champagne Gold Vermeil",
    dimensions: "Diameter: 22mm | Thickness: 3mm",
    description: "Timeless classic hoops reimagined with a modern sculpted silhouette. Lightweight enough for effortless day-to-night styling with a secure hinge clasp.",
    variants: ["Small (18mm)", "Medium (22mm)", "Large (28mm)"],
    images: ["product_pearl_earrings.jpg", "hero_necklace.jpg", "featured_collection.jpg"]
  },
  {
    id: 6,
    name: "Star Pendant Necklace",
    price: 3490,
    oldPrice: 4990,
    category: "necklaces",
    rating: 4.7,
    reviews: 9,
    img: "product_flower_necklace.jpg",
    badges: ["new"],
    inStock: false,
    sku: "DBD-NC-006",
    material: "18K Champagne Gold Vermeil",
    dimensions: "Chain: 40cm + 5cm extension | Pendant: 12mm",
    description: "Dainty celestial motif adorned with fine micropavé stones on a slender cable chain. Adds a celestial glow to your collarbone.",
    variants: ["18K Champagne Gold", "Sterling Silver"],
    images: ["product_flower_necklace.jpg", "hero_necklace.jpg", "featured_collection.jpg"]
  },
  {
    id: 7,
    name: "Pearl Stud Earrings",
    price: 1990,
    oldPrice: 2990,
    category: "earrings",
    rating: 4.8,
    reviews: 42,
    img: "product_pearl_earrings.jpg",
    badges: ["bestseller"],
    inStock: true,
    sku: "DBD-ER-007",
    material: "Grade-AAA Freshwater Pearls & 18K Gold Posts",
    dimensions: "Diameter: 7mm",
    description: "Effortless everyday classic. Handpicked button-shape freshwater pearls mounted on hypo-allergenic titanium posts with secure butterfly backs.",
    variants: ["White Pearl", "Blush Pink Pearl"],
    images: ["product_pearl_earrings.jpg", "featured_collection.jpg", "product_flower_necklace.jpg"]
  },
  {
    id: 8,
    name: "Bangle Bracelet Set",
    price: 6990,
    oldPrice: 8990,
    category: "bracelets",
    rating: 4.4,
    reviews: 7,
    img: "product_bracelet.jpg",
    badges: ["offer"],
    inStock: true,
    sku: "DBD-BR-008",
    material: "18K Champagne Gold Vermeil",
    dimensions: "Inner diameter: 62mm (Medium)",
    description: "A harmonized stack of finely textured bangles, each offering a different facet of hand-carved polish and champagne luster.",
    variants: ["18K Champagne Gold", "Tricolor Gold Stack"],
    images: ["product_bracelet.jpg", "featured_collection.jpg", "product_ring.jpg"]
  }
];

const DEFAULT_CATEGORIES = [
  { id: "necklaces", name: "Necklaces", count: 12, img: "product_flower_necklace.jpg", desc: "Graceful necklaces and pendants" },
  { id: "earrings", name: "Earrings", count: 18, img: "product_pearl_earrings.jpg", desc: "Timeless pearl and gold drop earrings" },
  { id: "bracelets", name: "Bracelets", count: 8, img: "product_bracelet.jpg", desc: "Delicate chain and bangle bracelets" },
  { id: "rings", name: "Rings", count: 6, img: "product_ring.jpg", desc: "Understated luxury solitaire and stacking rings" }
];

const DEFAULT_REVIEWS = [
  { id: 1, name: "Ayesha K.", rating: 5, text: "The Flower Pendant Necklace looks even prettier in person! Very good quality and beautiful packaging.", date: "12 Jan 2025", verified: true, approved: true, product: "Flower Pendant Necklace" },
  { id: 2, name: "Priya M.", rating: 5, text: "Absolutely love my pearl earrings. They are so delicate and elegant. Will definitely order again!", date: "5 Feb 2025", verified: true, approved: true, product: "Pearl Drop Earrings" },
  { id: 3, name: "Nadia R.", rating: 4, text: "Beautiful bracelet, perfect gift for my sister. The champagne gold finish is exactly as shown.", date: "20 Mar 2025", verified: true, approved: true, product: "Delicate Chain Bracelet" },
  { id: 4, name: "Sarah L.", rating: 5, text: "Dazzle by Dua is my go-to for jewellery! The quality is premium and the designs are timeless.", date: "8 Apr 2025", verified: true, approved: true, product: "Flower Pendant Necklace" },
  { id: 5, name: "Fatima Z.", rating: 5, text: "Ordered the ring and it arrived in gorgeous packaging. The detail is exquisite — absolutely stunning!", date: "15 May 2025", verified: true, approved: true, product: "Minimal Diamond Ring" },
  { id: 6, name: "Maha B.", rating: 4, text: "Very happy with my purchase. The earrings are lightweight and comfortable for all-day wear.", date: "2 Jun 2025", verified: true, approved: true, product: "Gold Hoop Earrings" }
];

const DEFAULT_OFFERS = {
  coupons: [
    { id: "c1", code: "DAZZLE10", title: "Welcome Privilege", discount: 10, type: "percent", minOrder: 1500, expiry: "2026-12-31", desc: "Receive 10% off your entire first purchase across all collections.", badge: "First Order", active: true },
    { id: "c2", code: "COMBO20", title: "Selected Combos", discount: 20, type: "percent", minOrder: 5000, expiry: "2026-12-31", desc: "Save 20% when you buy paired jewellery sets and matching duo sets.", badge: "Combo Deal", active: true },
    { id: "c3", code: "FREESHIP", title: "Complimentary Express", discount: 0, type: "free_shipping", minOrder: 2500, expiry: "2026-12-31", desc: "Complimentary express shipping across India with signature luxury box.", badge: "Complimentary", active: true }
  ],
  combos: [
    {
      id: "cb1",
      name: "The Bridal Set",
      discount: "30% OFF",
      price: 10990,
      oldPrice: 14970,
      items: ["Flower Pendant Necklace", "Pearl Drop Earrings", "Delicate Chain Bracelet"],
      images: ["product_flower_necklace.jpg", "product_pearl_earrings.jpg", "product_bracelet.jpg"]
    },
    {
      id: "cb2",
      name: "The Everyday Duo",
      discount: "20% OFF",
      price: 8540,
      oldPrice: 10680,
      items: ["Minimal Diamond Ring", "Delicate Chain Bracelet"],
      images: ["product_ring.jpg", "product_bracelet.jpg"]
    },
    {
      id: "cb3",
      name: "The Gift Set",
      discount: "25% OFF",
      price: 6740,
      oldPrice: 8980,
      items: ["Pearl Drop Earrings", "Minimal Diamond Ring", "Premium Gift Box & Card"],
      images: ["product_pearl_earrings.jpg", "product_ring.jpg"]
    }
  ]
};

const DEFAULT_HOMEPAGE = {
  announcement: {
    enabled: true,
    text: "Free shipping on orders above ₹2500 | Use code DAZZLE10 for 10% off",
    linkText: "View Offers →",
    linkUrl: "offers.html"
  },
  hero: {
    enabled: true,
    tag: "✦ New Collection 2025",
    title: "Jewellery That <em>Tells</em><br>Your Story",
    desc: "Discover pieces made to be remembered. Crafted with love, worn with grace.",
    btn1Text: "Shop Collection →",
    btn1Url: "shop.html",
    btn2Text: "View Offers",
    btn2Url: "offers.html",
    bgImg: "hero_necklace.jpg"
  },
  categories: {
    enabled: true,
    tag: "Shop by Category",
    title: "Find Your Perfect Piece"
  },
  newArrivals: {
    enabled: true,
    tag: "Just Arrived",
    title: "New Arrivals",
    count: 4
  },
  featured: {
    enabled: true,
    tag: "Our Featured Collection",
    title: "Grace in <em>Every</em> Detail",
    desc: "Thoughtfully designed, beautifully crafted — our collection brings elegance to your everyday and special moments. Each piece tells a story of timeless beauty.",
    img: "featured_collection.jpg",
    btnText: "Explore Collection →",
    btnUrl: "shop.html",
    stat1Num: "500+",
    stat1Label: "Happy Customers",
    stat2Num: "50+",
    stat2Label: "Unique Designs",
    stat3Num: "4.8★",
    stat3Label: "Avg. Rating"
  },
  whyChooseUs: {
    enabled: true,
    tag: "Why Choose Us",
    title: "The Dazzle Difference",
    subtitle: "Thoughtfully chosen, beautifully packed, and delivered with care.",
    items: [
      { icon: "fa-gem", title: "Premium Quality", desc: "Each piece crafted with the finest materials and meticulous attention to detail." },
      { icon: "fa-palette", title: "Curated Designs", desc: "Timeless, elegant designs that pair beautifully with any occasion or style." },
      { icon: "fa-gift", title: "Gift-Ready Packaging", desc: "Want to gift it to someone special? Let us know while placing your order, and we'll prepare it in beautiful gift-ready packaging." },
      { icon: "fa-truck-fast", title: "Secure & Careful Delivery", desc: "Every piece is carefully packed and secured to reach you safely and beautifully." }
    ]
  },
  reviewsSection: {
    enabled: true,
    tag: "Customer Love",
    title: "What Our Customers Say"
  },
  instagram: {
    enabled: true,
    tag: "Follow Our Journey",
    handle: "@dazzlebydua",
    subtitle: "Share your Dazzle moments with us",
    images: ["product_flower_necklace.jpg", "product_pearl_earrings.jpg", "product_bracelet.jpg", "product_ring.jpg"]
  },
  footer: {
    enabled: true,
    tagline: "Timeless pieces, crafted with love.<br>For your most beautiful moments.",
    copyright: "© 2025 Dazzle by Dua. All rights reserved."
  }
};

const DEFAULT_ORDERS = [
  {
    id: "DBD-2025-001",
    customer: "Ayesha Khan",
    email: "ayesha.k@example.com",
    phone: "+91 98765 43210",
    date: "10 Jan 2025",
    total: 8980,
    status: "Delivered",
    paymentMethod: "UPI / Online",
    address: "Flat 402, Sea Green Apts, Bandra West, Mumbai, MH 400050",
    items: [
      { id: 1, name: "Flower Pendant Necklace", price: 4990, qty: 1, variant: "Champagne Gold", img: "product_flower_necklace.jpg" },
      { id: 2, name: "Pearl Drop Earrings", price: 3990, qty: 1, variant: "Gold", img: "product_pearl_earrings.jpg" }
    ]
  },
  {
    id: "DBD-2025-002",
    customer: "Priya Sharma",
    email: "priya.s@example.com",
    phone: "+91 98123 45678",
    date: "18 Mar 2025",
    total: 5990,
    status: "Shipped",
    paymentMethod: "Credit Card",
    address: "74 Silver Birch, Indiranagar, Bengaluru, KA 560038",
    items: [
      { id: 3, name: "Delicate Chain Bracelet", price: 5990, qty: 1, variant: "Gold", img: "product_bracelet.jpg" }
    ]
  },
  {
    id: "DBD-2025-003",
    customer: "Fatima Zahra",
    email: "fatima.z@example.com",
    phone: "+91 97654 32109",
    date: "25 Sep 2025",
    total: 4690,
    status: "Processing",
    paymentMethod: "Cash on Delivery",
    address: "12 Gulmohar Lane, Jubilee Hills, Hyderabad, TS 500033",
    items: [
      { id: 4, name: "Minimal Diamond Ring", price: 4690, qty: 1, variant: "Size 7", img: "product_ring.jpg" }
    ]
  }
];

const DEFAULT_SETTINGS = {
  siteName: "Dazzle by Dua",
  tagline: "Fine Jewellery",
  email: "contact@dazzlebydua.com",
  phone: "+91 98765 43210",
  address: "Shop 4, Luxury Arcade, Bandra West, Mumbai, MH 400050",
  currency: "₹",
  freeShippingThreshold: 2500,
  logoText: "Dazzle by Dua",
  social: {
    instagram: "https://instagram.com/dazzlebydua",
    whatsapp: "https://wa.me/919876543210",
    pinterest: "#",
    facebook: "#"
  }
};

const DEFAULT_NAVIGATION = {
  header: [
    { name: "Home", href: "index.html" },
    { name: "Shop", href: "shop.html" },
    { name: "Offers", href: "offers.html" },
    { name: "My Orders", href: "orders.html" },
    { name: "Wishlist", href: "wishlist.html" },
    { name: "Contact", href: "contact.html" }
  ],
  footerQuick: [
    { name: "Home", href: "index.html" },
    { name: "Shop", href: "shop.html" },
    { name: "Offers & Combos", href: "offers.html" },
    { name: "Contact Us", href: "contact.html" },
    { name: "My Orders", href: "orders.html" },
    { name: "Wishlist", href: "wishlist.html" }
  ],
  footerCare: [
    { name: "Shipping Info", href: "contact.html" },
    { name: "Returns & Refunds", href: "contact.html" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "FAQs", href: "contact.html" }
  ]
};

// ---- Centralized Data Store API ----
const DazzleStore = {
  API_BASE_URL: API_BASE_URL,

  _getAuthHeader() {
    try {
      const sessStr = localStorage.getItem("dazzle_admin_session") || sessionStorage.getItem("dazzle_admin_session");
      if (sessStr) {
        const sess = JSON.parse(sessStr);
        if (sess && sess.token) {
          return { "Authorization": `Bearer ${sess.token}` };
        }
      }
    } catch (e) {}
    return {};
  },

  async _api(endpoint, method = "GET", body = null) {
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...this._getAuthHeader()
        }
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn(`API call ${method} ${endpoint} failed:`, e);
      return null;
    }
  },

  async syncFromBackend() {
    try {
      const [prods, cats, revs, offs, hp, sets, nav, pgs] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/products`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE_URL}/api/categories`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE_URL}/api/reviews`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE_URL}/api/offers`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE_URL}/api/homepage`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE_URL}/api/settings`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE_URL}/api/navigation`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE_URL}/api/pages`).then(r => r.ok ? r.json() : null),
      ]);

      if (prods.status === "fulfilled" && Array.isArray(prods.value) && prods.value.length) {
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(prods.value));
      }
      if (cats.status === "fulfilled" && Array.isArray(cats.value) && cats.value.length) {
        localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(cats.value));
      }
      if (revs.status === "fulfilled" && Array.isArray(revs.value) && revs.value.length) {
        localStorage.setItem(this.KEYS.REVIEWS, JSON.stringify(revs.value));
      }
      if (offs.status === "fulfilled" && offs.value) {
        localStorage.setItem(this.KEYS.OFFERS, JSON.stringify(offs.value));
      }
      if (hp.status === "fulfilled" && hp.value) {
        localStorage.setItem(this.KEYS.HOMEPAGE, JSON.stringify(hp.value));
      }
      if (sets.status === "fulfilled" && sets.value) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(sets.value));
      }
      if (nav.status === "fulfilled" && nav.value) {
        localStorage.setItem(this.KEYS.NAVIGATION, JSON.stringify(nav.value));
      }
      if (pgs.status === "fulfilled" && pgs.value) {
        localStorage.setItem(this.KEYS.PAGES, JSON.stringify(pgs.value));
      }

      const authHeader = this._getAuthHeader();
      if (authHeader.Authorization) {
        try {
          const ordRes = await fetch(`${API_BASE_URL}/api/orders`, { headers: authHeader });
          if (ordRes.ok) {
            const ords = await ordRes.json();
            if (Array.isArray(ords)) {
              localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(ords));
            }
          }
        } catch (e) {}
      }
      return true;
    } catch (err) {
      console.warn("DazzleStore background sync error:", err);
      return false;
    }
  },

  KEYS: {
    PRODUCTS: "dazzle_products",
    CATEGORIES: "dazzle_categories",
    REVIEWS: "dazzle_reviews",
    OFFERS: "dazzle_offers",
    HOMEPAGE: "dazzle_homepage",
    ORDERS: "dazzle_orders",
    SETTINGS: "dazzle_settings",
    NAVIGATION: "dazzle_navigation"
  },

  _get(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      if (data === null) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return JSON.parse(JSON.stringify(fallback));
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn("DazzleStore error reading " + key, e);
      return fallback;
    }
  },

  _set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error("DazzleStore error writing " + key, e);
    }
  },

  // Products
  getProducts() {
    return this._get(this.KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  },
  saveProducts(arr) {
    this._set(this.KEYS.PRODUCTS, arr);
  },
  getProductById(id) {
    const prods = this.getProducts();
    return prods.find(p => p.id === parseInt(id, 10) || p.id === String(id));
  },
  addProduct(product) {
    const prods = this.getProducts();
    const maxId = prods.reduce((max, p) => Math.max(max, parseInt(p.id, 10) || 0), 0);
    const newProd = {
      ...product,
      id: maxId + 1,
      rating: product.rating || 5.0,
      reviews: product.reviews || 0,
      badges: product.badges || [],
      variants: product.variants || ["18K Champagne Gold"],
      images: product.images && product.images.length ? product.images : [product.img || "product_flower_necklace.jpg"]
    };
    prods.unshift(newProd);
    this.saveProducts(prods);
    this._api('/api/products', 'POST', newProd).catch(() => {});
    return newProd;
  },
  updateProduct(id, updates) {
    const prods = this.getProducts();
    const idx = prods.findIndex(p => p.id === parseInt(id, 10) || p.id === String(id));
    if (idx >= 0) {
      prods[idx] = { ...prods[idx], ...updates };
      this.saveProducts(prods);
      this._api(`/api/products/${id}`, 'PUT', updates).catch(() => {});
      return prods[idx];
    }
    return null;
  },
  deleteProduct(id) {
    let prods = this.getProducts();
    prods = prods.filter(p => p.id !== parseInt(id, 10) && p.id !== String(id));
    this.saveProducts(prods);
    this._api(`/api/products/${id}`, 'DELETE').catch(() => {});
  },

  // Backwards compatibility for PRODUCT_DETAILS map
  getProductDetails() {
    const prods = this.getProducts();
    const map = {};
    prods.forEach(p => {
      map[p.id] = {
        description: p.description || "An iconic piece from Dazzle by Dua crafted with timeless grace.",
        material: p.material || "18K Champagne Gold Vermeil",
        dimensions: p.dimensions || "Standard Fine Jewellery Sizing",
        sku: p.sku || `DBD-${p.id}`,
        variants: p.variants || ["18K Champagne Gold"],
        images: p.images && p.images.length ? p.images : [p.img, "featured_collection.jpg"]
      };
    });
    return map;
  },
  saveProductDetails(map) {
    // Sync into products
    const prods = this.getProducts();
    let changed = false;
    prods.forEach(p => {
      if (map[p.id]) {
        Object.assign(p, map[p.id]);
        changed = true;
      }
    });
    if (changed) this.saveProducts(prods);
  },

  // Categories
  getCategories() {
    return this._get(this.KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  },
  saveCategories(arr) {
    this._set(this.KEYS.CATEGORIES, arr);
  },
  addCategory(cat) {
    const list = this.getCategories();
    list.push(cat);
    this.saveCategories(list);
    this._api('/api/categories', 'POST', cat).catch(() => {});
    return cat;
  },
  updateCategory(id, updates) {
    const list = this.getCategories();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.saveCategories(list);
      this._api(`/api/categories/${id}`, 'PUT', updates).catch(() => {});
      return list[idx];
    }
    return null;
  },
  deleteCategory(id) {
    let list = this.getCategories();
    list = list.filter(c => c.id !== id);
    this.saveCategories(list);
    this._api(`/api/categories/${id}`, 'DELETE').catch(() => {});
  },

  // Reviews
  getReviews() {
    return this._get(this.KEYS.REVIEWS, DEFAULT_REVIEWS);
  },
  saveReviews(arr) {
    this._set(this.KEYS.REVIEWS, arr);
  },
  addReview(r) {
    const list = this.getReviews();
    const maxId = list.reduce((m, x) => Math.max(m, x.id || 0), 0);
    const newRev = {
      id: maxId + 1,
      name: r.name || "Anonymous",
      rating: parseInt(r.rating, 10) || 5,
      text: r.text || "",
      date: r.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      verified: r.verified !== false,
      approved: r.approved !== false,
      product: r.product || "General"
    };
    list.unshift(newRev);
    this.saveReviews(list);
    this._api('/api/reviews', 'POST', newRev).catch(() => {});
    return newRev;
  },
  updateReview(id, updates) {
    const list = this.getReviews();
    const idx = list.findIndex(r => r.id === parseInt(id, 10));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.saveReviews(list);
      this._api(`/api/reviews/${id}`, 'PUT', updates).catch(() => {});
      return list[idx];
    }
    return null;
  },
  deleteReview(id) {
    let list = this.getReviews();
    list = list.filter(r => r.id !== parseInt(id, 10));
    this.saveReviews(list);
    this._api(`/api/reviews/${id}`, 'DELETE').catch(() => {});
  },

  // Offers & Combos
  getOffers() {
    return this._get(this.KEYS.OFFERS, DEFAULT_OFFERS);
  },
  saveOffers(data) {
    this._set(this.KEYS.OFFERS, data);
    this._api('/api/offers', 'PUT', data).catch(() => {});
  },
  addCoupon(coupon) {
    const data = this.getOffers();
    data.coupons = data.coupons || [];
    data.coupons.push(coupon);
    this.saveOffers(data);
    return coupon;
  },
  updateCoupon(id, updates) {
    const data = this.getOffers();
    const idx = (data.coupons || []).findIndex(c => c.id === id);
    if (idx >= 0) {
      data.coupons[idx] = { ...data.coupons[idx], ...updates };
      this.saveOffers(data);
      return data.coupons[idx];
    }
    return null;
  },
  deleteCoupon(id) {
    const data = this.getOffers();
    data.coupons = (data.coupons || []).filter(c => c.id !== id);
    this.saveOffers(data);
  },
  addCombo(combo) {
    const data = this.getOffers();
    data.combos = data.combos || [];
    data.combos.push(combo);
    this.saveOffers(data);
    return combo;
  },
  updateCombo(id, updates) {
    const data = this.getOffers();
    const idx = (data.combos || []).findIndex(c => c.id === id);
    if (idx >= 0) {
      data.combos[idx] = { ...data.combos[idx], ...updates };
      this.saveOffers(data);
      return data.combos[idx];
    }
    return null;
  },
  deleteCombo(id) {
    const data = this.getOffers();
    data.combos = (data.combos || []).filter(c => c.id !== id);
    this.saveOffers(data);
  },

  // Homepage
  getHomepage() {
    return this._get(this.KEYS.HOMEPAGE, DEFAULT_HOMEPAGE);
  },
  saveHomepage(data) {
    this._set(this.KEYS.HOMEPAGE, data);
    this._api('/api/homepage', 'PUT', data).catch(() => {});
  },

  // Orders
  getOrders() {
    return this._get(this.KEYS.ORDERS, DEFAULT_ORDERS);
  },
  saveOrders(arr) {
    this._set(this.KEYS.ORDERS, arr);
  },
  addOrder(order) {
    const list = this.getOrders();
    const newOrder = {
      id: order.id || `DBD-2025-${Math.floor(100 + Math.random() * 900)}`,
      customer: order.customer || "Valued Customer",
      email: order.email || "customer@example.com",
      phone: order.phone || "+91 98765 00000",
      date: order.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      total: order.total || 0,
      status: order.status || "Processing",
      paymentMethod: order.paymentMethod || "Credit Card",
      address: order.address || "Mumbai, India",
      items: order.items || []
    };
    list.unshift(newOrder);
    this.saveOrders(list);
    this._api('/api/orders', 'POST', newOrder).catch(() => {});
    return newOrder;
  },
  updateOrderStatus(id, status) {
    const list = this.getOrders();
    const order = list.find(o => o.id === id);
    if (order) {
      order.status = status;
      this.saveOrders(list);
      this._api(`/api/orders/${id}/status`, 'PATCH', { status }).catch(() => {});
      return order;
    }
    return null;
  },

  // Settings
  getSettings() {
    return this._get(this.KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(data) {
    this._set(this.KEYS.SETTINGS, data);
    this._api('/api/settings', 'PUT', data).catch(() => {});
  },

  // Navigation
  getNavigation() {
    return this._get(this.KEYS.NAVIGATION, DEFAULT_NAVIGATION);
  },
  saveNavigation(data) {
    this._set(this.KEYS.NAVIGATION, data);
    this._api('/api/navigation', 'PUT', data).catch(() => {});
  },

  // Data Export / Reset
  exportAll() {
    return JSON.stringify({
      products: this.getProducts(),
      categories: this.getCategories(),
      reviews: this.getReviews(),
      offers: this.getOffers(),
      homepage: this.getHomepage(),
      orders: this.getOrders(),
      settings: this.getSettings(),
      navigation: this.getNavigation()
    }, null, 2);
  },
  importAll(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products) this.saveProducts(data.products);
      if (data.categories) this.saveCategories(data.categories);
      if (data.reviews) this.saveReviews(data.reviews);
      if (data.offers) this.saveOffers(data.offers);
      if (data.homepage) this.saveHomepage(data.homepage);
      if (data.orders) this.saveOrders(data.orders);
      if (data.settings) this.saveSettings(data.settings);
      if (data.navigation) this.saveNavigation(data.navigation);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  },
  resetAll() {
    this.saveProducts(DEFAULT_PRODUCTS);
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveReviews(DEFAULT_REVIEWS);
    this.saveOffers(DEFAULT_OFFERS);
    this.saveHomepage(DEFAULT_HOMEPAGE);
    this.saveOrders(DEFAULT_ORDERS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveNavigation(DEFAULT_NAVIGATION);
    this._api('/api/backup/reset', 'POST').catch(() => {});
  }
};

// Expose globally
window.DazzleStore = DazzleStore;

// Define reactive window getters/setters for backward compatibility
Object.defineProperty(window, "PRODUCTS", {
  get() { return DazzleStore.getProducts(); },
  set(val) { DazzleStore.saveProducts(val); },
  configurable: true
});
Object.defineProperty(window, "REVIEWS", {
  get() { return DazzleStore.getReviews(); },
  set(val) { DazzleStore.saveReviews(val); },
  configurable: true
});
Object.defineProperty(window, "PRODUCT_DETAILS", {
  get() { return DazzleStore.getProductDetails(); },
  set(val) { DazzleStore.saveProductDetails(val); },
  configurable: true
});

// ---- Cart & Wishlist State ----
const state = {
  cart: JSON.parse(localStorage.getItem("dazzle_cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("dazzle_wishlist") || "[]")
};

function saveState() {
  localStorage.setItem("dazzle_cart", JSON.stringify(state.cart));
  localStorage.setItem("dazzle_wishlist", JSON.stringify(state.wishlist));
}

// ---- Cart Operations ----
function addToCart(productId, qty = 1) {
  const p = DazzleStore.getProductById(productId) || (window.PRODUCTS || []).find(x => x.id === productId);
  if (!p) return;
  const num = parseInt(qty, 10) || 1;
  const existing = state.cart.find(x => x.id === p.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + num;
  } else {
    state.cart.push({ ...p, qty: num });
  }
  saveState();
  updateNavBadges();
  showToast("✦ Added to cart — " + p.name + (num > 1 ? ` (x${num})` : ""));
}

function buyNow(productId, qty = 1) {
  addToCart(productId, qty);
  window.location.href = "checkout.html";
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(x => x.id === productId);
  if (!item) return;
  const newQty = (item.qty || 1) + delta;
  if (newQty <= 0) {
    removeFromCart(productId);
  } else {
    item.qty = Math.min(99, newQty);
    saveState();
    updateNavBadges();
  }
}

function getCartSubtotal() {
  return state.cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
}

function clearCart() {
  state.cart = [];
  saveState();
  updateNavBadges();
}

function removeFromCart(productId) {
  const p = state.cart.find(x => x.id === productId);
  state.cart = state.cart.filter(x => x.id !== productId);
  saveState();
  updateNavBadges();
  if (p) showToast("Removed " + p.name + " from cart");
}

// ---- Wishlist Operations ----
function toggleWishlist(productId) {
  const p = DazzleStore.getProductById(productId) || (window.PRODUCTS || []).find(x => x.id === productId);
  if (!p) return false;
  const idx = state.wishlist.findIndex(x => x.id === p.id);
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
  const cartCount = state.cart.reduce((s, x) => s + (x.qty || 1), 0);
  const wishCount = state.wishlist.length;
  cartBadges.forEach(b => { b.textContent = cartCount; });
  wishBadges.forEach(b => { b.textContent = wishCount; });
}

// ---- Toast Notifications ----
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

// ---- Stars Helper ----
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
  const detailUrl = `product-details.html?id=${p.id}`;
  return `
  <div class="product-card" data-id="${p.id}" onclick="handleCardClick(event, ${p.id})" style="cursor:pointer">
    <div class="product-img-wrap">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-badges">${badgesHTML}${outOfStock}</div>
      <div class="product-img-actions">
        <button type="button" class="btn-icon wish-toggle${inWish ? " active" : ""}" onclick="event.stopPropagation();handleWishToggle(this, ${p.id})" title="Wishlist">♥</button>
        <a href="${detailUrl}" class="btn-icon" onclick="event.stopPropagation()" title="View Details">👁</a>
      </div>
    </div>
    <div class="product-body">
      <h4 class="product-name"><a href="${detailUrl}" onclick="event.stopPropagation()">${p.name}</a></h4>
      <div class="product-rating">
        <span class="stars">${renderStars(p.rating || 5)}</span>
        <span class="rating-count">(${p.reviews || 0})</span>
      </div>
      <div class="product-price-wrap">
        <span class="product-price">₹${Number(p.price || 0).toLocaleString()}</span>
        <span class="product-price-old">₹${Number(p.oldPrice || 0).toLocaleString()}</span>
      </div>
      <button type="button" class="btn btn-dark btn-sm" onclick="event.stopPropagation();addToCart(${p.id})" ${!p.inStock ? "disabled style='opacity:.5;cursor:not-allowed'" : ""}>${!p.inStock ? "Out of Stock" : "Add to Cart"}</button>
    </div>
  </div>`;
}

function handleCardClick(event, id) {
  if (event.target.closest("button") || event.target.closest(".wish-toggle") || event.target.closest(".btn") || event.target.closest(".btn-icon")) {
    return;
  }
  window.location.href = `product-details.html?id=${id}`;
}

// ---- Review Card HTML ----
function reviewCardHTML(r) {
  const initial = (r.name && r.name[0]) ? r.name[0].toUpperCase() : "D";
  return `
  <div class="review-card">
    <div class="review-header">
      <div class="reviewer-avatar">${initial}</div>
      <div>
        <div class="reviewer-name">${r.name}</div>
        <div class="stars-row">${renderStars(r.rating || 5)}</div>
        <div class="review-date">${r.date || ""}</div>
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

// ---- Orders tab switching & rendering ----
function renderOrdersPage() {
  const container = document.getElementById("panel-all");
  if (!container) return;

  const orders = DazzleStore.getOrders();
  const tabs = document.querySelectorAll(".orders-tab");
  let activeTab = "panel-all";

  tabs.forEach(tab => {
    if (tab.classList.contains("active")) {
      activeTab = tab.dataset.panel || "panel-all";
    }
  });

  const statusFilter = activeTab.replace("panel-", ""); // 'all', 'processing', 'shipped', 'delivered', 'cancelled'

  const filtered = statusFilter === "all"
    ? orders
    : orders.filter(o => (o.status || "").toLowerCase() === statusFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:3rem 1rem">
        <div class="empty-icon">📦</div>
        <h3 class="empty-title">No ${statusFilter === "all" ? "" : statusFilter} orders found</h3>
        <p class="empty-sub">When you place orders, they will appear here with live tracking.</p>
        <a href="shop.html" class="btn btn-gold btn-sm">Explore Collection</a>
      </div>`;
    return;
  }

  function getStatusClass(status) {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return "status-delivered";
    if (s === "shipped" || s === "out for delivery") return "status-shipped";
    if (s === "processing" || s === "packed") return "status-processing";
    return "status-processing";
  }

  function renderTracking(status) {
    const s = (status || "").toLowerCase();
    const steps = ["Confirmed", "Packed", "Shipped", "Delivered"];
    let activeIdx = 0;
    if (s === "packed") activeIdx = 1;
    else if (s === "shipped" || s === "out for delivery") activeIdx = 2;
    else if (s === "delivered") activeIdx = 3;

    return `
      <div class="tracking-steps">
        ${steps.map((st, i) => {
          let cls = "";
          let dotContent = "";
          if (i < activeIdx || (i === activeIdx && activeIdx === 3)) {
            cls = "done";
            dotContent = "&#10003;";
          } else if (i === activeIdx) {
            cls = "current";
            dotContent = i === 2 ? "&#x2708;" : "&#9679;";
          }
          return `
            <div class="tracking-step ${cls}">
              <div class="tracking-dot">${dotContent}</div>
              <div class="tracking-label">${st}</div>
            </div>`;
        }).join("")}
      </div>`;
  }

  container.innerHTML = filtered.map(order => {
    const itemsHTML = (order.items || []).map(item => `
      <div class="order-item">
        <div class="order-item-img"><img src="${item.img || 'product_flower_necklace.jpg'}" alt="${item.name}"></div>
        <div>
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-meta">Qty: ${item.qty || 1} ${item.variant ? '&nbsp;|&nbsp; ' + item.variant : ''}</div>
        </div>
        <div class="order-item-price">₹${Number(item.price * (item.qty || 1)).toLocaleString()}</div>
      </div>
    `).join("");

    return `
      <div class="order-card" style="margin-bottom:1.5rem">
        <div class="order-header">
          <div>
            <div class="order-id">Order #${order.id}</div>
            <div class="order-date">Placed on ${order.date || 'Recent'} &bull; Customer: ${order.customer || 'Customer'}</div>
          </div>
          <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
        </div>
        <div class="order-body">
          ${renderTracking(order.status)}
          <div class="order-items">
            ${itemsHTML}
          </div>
          <div class="order-footer">
            <div>
              <div class="order-total-label">Order Total (${order.paymentMethod || 'Paid'})</div>
              <div class="order-total-value">₹${Number(order.total || 0).toLocaleString()}</div>
            </div>
            <div class="order-actions">
              <button class="btn btn-outline btn-sm" onclick="showToast('✦ Invoice downloaded for Order #${order.id}')">Invoice</button>
              <button class="btn btn-ghost btn-sm" onclick="showToast('✦ Thank you for your feedback!')">Rate & Review</button>
              <button class="btn btn-gold btn-sm" onclick="showToast('✦ Items added to cart!')">Reorder</button>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");
}

function initOrderTabs() {
  const tabs = document.querySelectorAll(".orders-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderOrdersPage();
    });
  });
  renderOrdersPage();
}

// ---- Copy coupon ----
function copyCoupon(code) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => showToast("✦ Coupon code copied: " + code));
  } else {
    showToast("✦ Coupon code: " + code);
  }
}

// ---- Homepage Hydration ----
function hydrateHomePage() {
  const hp = DazzleStore.getHomepage();
  if (!hp) return;

  // 1. Announcement Bar
  const annEl = document.querySelector(".announcement-bar");
  if (annEl && hp.announcement) {
    if (hp.announcement.enabled === false) {
      annEl.style.display = "none";
    } else {
      annEl.style.display = "";
      annEl.innerHTML = `${hp.announcement.text || ''} <a href="${hp.announcement.linkUrl || 'offers.html'}">${hp.announcement.linkText || 'View Offers &rarr;'}</a>`;
    }
  }

  // 2. Hero Section
  const heroEl = document.querySelector(".hero");
  if (heroEl && hp.hero) {
    if (hp.hero.enabled === false) {
      heroEl.style.display = "none";
    } else {
      heroEl.style.display = "";
      const bgImg = heroEl.querySelector(".hero-bg img");
      if (bgImg && hp.hero.bgImg) bgImg.src = hp.hero.bgImg;

      const tagEl = heroEl.querySelector(".hero-tag");
      if (tagEl && hp.hero.tag) tagEl.innerHTML = hp.hero.tag;

      const titleEl = heroEl.querySelector(".hero-title");
      if (titleEl && hp.hero.title) titleEl.innerHTML = hp.hero.title;

      const subEl = heroEl.querySelector(".hero-sub");
      if (subEl && hp.hero.desc) subEl.innerHTML = hp.hero.desc;

      const btns = heroEl.querySelectorAll(".hero-btns a");
      if (btns.length >= 1 && hp.hero.btn1Text) {
        btns[0].innerHTML = hp.hero.btn1Text;
        if (hp.hero.btn1Url) btns[0].href = hp.hero.btn1Url;
      }
      if (btns.length >= 2 && hp.hero.btn2Text) {
        btns[1].innerHTML = hp.hero.btn2Text;
        if (hp.hero.btn2Url) btns[1].href = hp.hero.btn2Url;
      }
    }
  }

  // 3. Categories Strip
  const catSection = document.getElementById("categories");
  if (catSection && hp.categories) {
    if (hp.categories.enabled === false) {
      catSection.style.display = "none";
    } else {
      catSection.style.display = "";
      const catGrid = catSection.querySelector(".cat-grid");
      if (catGrid) {
        const cats = DazzleStore.getCategories();
        catGrid.innerHTML = cats.map(c => `
          <a href="shop.html?category=${encodeURIComponent(c.id)}" class="cat-card">
            <div class="cat-img"><img src="${c.img || 'product_flower_necklace.jpg'}" alt="${c.name}"></div>
            <div class="cat-body">
              <div class="cat-name">${c.name}</div>
              <div class="cat-count">${c.count || 0} Products</div>
            </div>
          </a>
        `).join("");
      }
    }
  }

  // 4. New Arrivals
  const newArrSection = document.querySelector("#new-arrivals-grid")?.closest(".section");
  if (newArrSection && hp.newArrivals) {
    if (hp.newArrivals.enabled === false) {
      newArrSection.style.display = "none";
    } else {
      newArrSection.style.display = "";
      const grid = document.getElementById("new-arrivals-grid");
      if (grid) {
        const count = hp.newArrivals.count || 4;
        const prods = DazzleStore.getProducts();
        grid.innerHTML = prods.slice(0, count).map(productCardHTML).join("");
      }
    }
  }

  // 5. Featured Collection
  const featSection = document.querySelector(".featured-banner");
  if (featSection && hp.featured) {
    if (hp.featured.enabled === false) {
      featSection.style.display = "none";
    } else {
      featSection.style.display = "";
      const imgEl = featSection.querySelector(".featured-img img");
      if (imgEl && hp.featured.img) imgEl.src = hp.featured.img;

      const tagEl = featSection.querySelector(".section-tag");
      if (tagEl && hp.featured.tag) tagEl.innerHTML = hp.featured.tag;

      const titleEl = featSection.querySelector(".featured-title");
      if (titleEl && hp.featured.title) titleEl.innerHTML = hp.featured.title;

      const descEl = featSection.querySelector(".featured-desc");
      if (descEl && hp.featured.desc) descEl.innerHTML = hp.featured.desc;

      const stats = featSection.querySelectorAll(".featured-stats > div");
      if (stats.length >= 3) {
        if (hp.featured.stat1Num) stats[0].querySelector(".stat-num").textContent = hp.featured.stat1Num;
        if (hp.featured.stat1Label) stats[0].querySelector(".stat-label").textContent = hp.featured.stat1Label;
        if (hp.featured.stat2Num) stats[1].querySelector(".stat-num").textContent = hp.featured.stat2Num;
        if (hp.featured.stat2Label) stats[1].querySelector(".stat-label").textContent = hp.featured.stat2Label;
        if (hp.featured.stat3Num) stats[2].querySelector(".stat-num").innerHTML = hp.featured.stat3Num;
        if (hp.featured.stat3Label) stats[2].querySelector(".stat-label").textContent = hp.featured.stat3Label;
      }

      const btnEl = featSection.querySelector(".featured-content a.btn");
      if (btnEl) {
        if (hp.featured.btnText) btnEl.innerHTML = hp.featured.btnText;
        if (hp.featured.btnUrl) btnEl.href = hp.featured.btnUrl;
      }
    }
  }

  // 6. Why Choose Us
  const whySection = document.querySelector(".features-grid")?.closest(".section");
  if (whySection && hp.whyChooseUs) {
    if (hp.whyChooseUs.enabled === false) {
      whySection.style.display = "none";
    } else {
      whySection.style.display = "";
      const grid = whySection.querySelector(".features-grid");
      if (grid && hp.whyChooseUs.items) {
        grid.innerHTML = hp.whyChooseUs.items.map(item => `
          <div class="feature-card">
            <div class="feature-icon"><i class="fa ${item.icon}"></i></div>
            <h4 class="feature-title">${item.title}</h4>
            <p class="feature-text">${item.desc}</p>
          </div>
        `).join("");
      }
    }
  }

  // 7. Customer Reviews
  const reviewsSection = document.querySelector(".reviews-section");
  if (reviewsSection && hp.reviewsSection) {
    if (hp.reviewsSection.enabled === false) {
      reviewsSection.style.display = "none";
    } else {
      reviewsSection.style.display = "";
      const rv = document.getElementById("home-reviews");
      if (rv) {
        const approved = DazzleStore.getReviews().filter(r => r.approved !== false);
        rv.innerHTML = approved.slice(0, 3).map(reviewCardHTML).join("");
      }
    }
  }

  // 8. Instagram Section
  const instaSection = document.querySelector(".instagram-section");
  if (instaSection && hp.instagram) {
    if (hp.instagram.enabled === false) {
      instaSection.style.display = "none";
    } else {
      instaSection.style.display = "";
      const titleEl = instaSection.querySelector(".section-title");
      if (titleEl && hp.instagram.handle) titleEl.textContent = hp.instagram.handle;
      const subEl = instaSection.querySelector(".section-subtitle");
      if (subEl && hp.instagram.subtitle) subEl.textContent = hp.instagram.subtitle;
    }
  }
}

// ---- Hydrate Site Footer ----
function hydrateFooter() {
  const settings = DazzleStore.getSettings();
  if (!settings) return;

  // Update footer brand name/tagline if present
  document.querySelectorAll(".footer-brand-name").forEach(el => {
    el.textContent = settings.siteName || "Dazzle by Dua";
  });
  document.querySelectorAll(".footer-brand-tag").forEach(el => {
    el.textContent = settings.tagline || "Fine Jewellery";
  });
}

// ---- Offers Page Hydration ----
function hydrateOffersPage() {
  const currentOffersGrid = document.querySelector("#current-offers .grid-3");
  const combosGrid = document.querySelector("#combos .grid-3");
  const offersData = DazzleStore.getOffers();

  if (currentOffersGrid && offersData.coupons) {
    currentOffersGrid.innerHTML = offersData.coupons.map((c, idx) => {
      const isFreeShip = c.type === "free_shipping";
      const valDisplay = isFreeShip ? `FREE <span>SHIPPING</span>` : `${c.discount}% <span>OFF</span>`;
      const isFeatured = idx === 1 ? " featured-offer" : "";
      const badgeStyle = idx === 1 ? ' style="background:var(--gold);color:#fff"' : "";

      const actionHTML = isFreeShip
        ? `<span class="offer-auto-badge">&#10003; Auto-Applied</span><a href="shop.html" class="btn btn-outline btn-sm">Shop Now</a>`
        : `<span class="offer-code-box" onclick="copyCoupon('${c.code}')" title="Click to copy code">${c.code}</span>
           <button type="button" class="btn btn-gold btn-sm" onclick="copyCoupon('${c.code}')">Copy Code</button>`;

      return `
      <div class="current-offer-card${isFeatured}">
        <div class="current-offer-top">
          <div class="current-offer-badge"${badgeStyle}>${c.badge || 'Offer'}</div>
          <div class="current-offer-val" ${isFreeShip ? 'style="font-size:2rem"' : ''}>${valDisplay}</div>
        </div>
        <div class="current-offer-body">
          <h3 class="current-offer-title">${c.title || c.code}</h3>
          <p class="current-offer-desc">${c.desc || ''}</p>
          <div class="current-offer-meta">&#10022; Min. order value ₹${Number(c.minOrder || 0).toLocaleString()}</div>
          <div class="current-offer-code-row">
            ${actionHTML}
          </div>
        </div>
      </div>`;
    }).join("");
  }

  if (combosGrid && offersData.combos) {
    combosGrid.innerHTML = offersData.combos.map(cb => {
      const imgsHTML = (cb.images || []).map((img, i) => `
        ${i > 0 ? '<span class="combo-plus">+</span>' : ''}
        <div class="combo-product-img"><img src="${img}" alt="Item"></div>
      `).join("");

      const itemsListHTML = (cb.items || []).map(item => `<li>${item}</li>`).join("");

      return `
      <div class="combo-card">
        <div class="combo-header">
          <div class="combo-name">${cb.name}</div>
          <span class="combo-discount">${cb.discount || 'Special'}</span>
        </div>
        <div class="combo-products">
          ${imgsHTML}
        </div>
        <div class="combo-body">
          <ul class="combo-includes">
            ${itemsListHTML}
          </ul>
          <div class="combo-price-wrap">
            <div>
              <div class="combo-price-new">₹${Number(cb.price).toLocaleString()}</div>
              <div class="combo-price-old">₹${Number(cb.oldPrice).toLocaleString()}</div>
            </div>
            <button class="btn btn-gold btn-sm" onclick="showToast('✦ ${cb.name} added to cart!')">Add to Cart</button>
          </div>
        </div>
      </div>`;
    }).join("");
  }
}

// ---- Auto-Init on DOM Ready ----
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initScrollNav();
  setActiveNavLink();
  initFAQ();
  updateNavBadges();
  hydrateFooter();

  // Background synchronize with Render MongoDB Backend
  if (window.DazzleStore && typeof window.DazzleStore.syncFromBackend === "function") {
    window.DazzleStore.syncFromBackend().then(() => {
      hydrateFooter();
      if (document.querySelector(".hero") || document.getElementById("new-arrivals-grid")) {
        hydrateHomePage();
      }
      if (document.getElementById("current-offers")) {
        hydrateOffersPage();
      }
      if (typeof renderProductsGrid === "function") renderProductsGrid();
      if (typeof renderShop === "function") renderShop();
      if (typeof renderCheckout === "function") renderCheckout();
      if (typeof renderCart === "function") renderCart();
    });
  }

  // If on index.html
  if (document.querySelector(".hero") || document.getElementById("new-arrivals-grid")) {
    hydrateHomePage();
  }

  // If on offers.html
  if (document.getElementById("current-offers")) {
    hydrateOffersPage();
  }
});
