/**
 * Dazzle by Dua - Google Analytics 4 (GA4) Helper
 * Measurement ID: G-6KV8W32JNV
 * Safe, robust e-commerce event tracking adhering to GA4 specs.
 * Never collects or transmits PII.
 */

(function () {
  'use strict';

  // Ensure window.gtag exists safely
  function getGtag() {
    if (typeof window.gtag === 'function') {
      return window.gtag;
    }
    return null;
  }

  // Format an item for GA4 e-commerce payloads
  function formatGA4Item(product, quantity, index) {
    if (!product) return null;
    const item = {
      item_id: String(product.id || product.sku || ''),
      item_name: String(product.name || 'Jewellery Piece'),
      item_category: String(product.category || 'Jewellery'),
      price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
      currency: 'INR'
    };
    if (quantity != null) {
      item.quantity = parseInt(quantity, 10) || 1;
    }
    if (index != null) {
      item.index = index;
    }
    if (product.variant) {
      item.item_variant = String(product.variant);
    }
    return item;
  }

  // 1. View Item (Product Detail Page)
  function ga4ViewItem(product) {
    try {
      const gtag = getGtag();
      if (!gtag || !product) return;
      const formatted = formatGA4Item(product, 1);
      if (!formatted) return;

      gtag('event', 'view_item', {
        currency: 'INR',
        value: formatted.price,
        items: [formatted]
      });
    } catch (e) {
      console.warn('GA4 view_item error:', e);
    }
  }

  // 2. View Item List (Category, Shop, Collection)
  function ga4ViewItemList(products, listName) {
    try {
      const gtag = getGtag();
      if (!gtag || !Array.isArray(products) || products.length === 0) return;
      const title = listName || 'Shop Collection';
      const items = products.slice(0, 20).map((p, idx) => formatGA4Item(p, 1, idx + 1)).filter(Boolean);
      if (items.length === 0) return;

      gtag('event', 'view_item_list', {
        item_list_id: title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''),
        item_list_name: title,
        items: items
      });
    } catch (e) {
      console.warn('GA4 view_item_list error:', e);
    }
  }

  // 3. Search Products
  function ga4Search(searchTerm) {
    try {
      const gtag = getGtag();
      if (!gtag || !searchTerm) return;
      const cleaned = String(searchTerm).trim();
      if (!cleaned) return;

      gtag('event', 'search', {
        search_term: cleaned
      });
    } catch (e) {
      console.warn('GA4 search error:', e);
    }
  }

  // 4. Add to Cart
  function ga4AddToCart(product, quantity) {
    try {
      const gtag = getGtag();
      if (!gtag || !product) return;
      const qty = parseInt(quantity, 10) || 1;
      const formatted = formatGA4Item(product, qty);
      if (!formatted) return;

      gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: formatted.price * qty,
        items: [formatted]
      });
    } catch (e) {
      console.warn('GA4 add_to_cart error:', e);
    }
  }

  // 5. Remove from Cart
  function ga4RemoveFromCart(product, quantity) {
    try {
      const gtag = getGtag();
      if (!gtag || !product) return;
      const qty = parseInt(quantity, 10) || 1;
      const formatted = formatGA4Item(product, qty);
      if (!formatted) return;

      gtag('event', 'remove_from_cart', {
        currency: 'INR',
        value: formatted.price * qty,
        items: [formatted]
      });
    } catch (e) {
      console.warn('GA4 remove_from_cart error:', e);
    }
  }

  // 6. Add to Wishlist
  function ga4AddToWishlist(product) {
    try {
      const gtag = getGtag();
      if (!gtag || !product) return;
      const formatted = formatGA4Item(product, 1);
      if (!formatted) return;

      gtag('event', 'add_to_wishlist', {
        currency: 'INR',
        value: formatted.price,
        items: [formatted]
      });
    } catch (e) {
      console.warn('GA4 add_to_wishlist error:', e);
    }
  }

  // 7. Begin Checkout
  function ga4BeginCheckout(cartItems, totalValue, couponCode) {
    try {
      const gtag = getGtag();
      if (!gtag || !Array.isArray(cartItems) || cartItems.length === 0) return;
      const items = cartItems.map((item, idx) => formatGA4Item(item, item.qty || 1, idx + 1)).filter(Boolean);
      const val = typeof totalValue === 'number' ? totalValue : parseFloat(totalValue) || 0;

      const payload = {
        currency: 'INR',
        value: val,
        items: items
      };
      if (couponCode) {
        payload.coupon = String(couponCode).trim();
      }

      gtag('event', 'begin_checkout', payload);
    } catch (e) {
      console.warn('GA4 begin_checkout error:', e);
    }
  }

  // 8. Add Payment Info
  function ga4AddPaymentInfo(paymentType, cartItems, totalValue) {
    try {
      const gtag = getGtag();
      if (!gtag) return;
      const payload = {
        currency: 'INR',
        payment_type: String(paymentType || 'Not specified')
      };
      if (typeof totalValue === 'number' && !isNaN(totalValue)) {
        payload.value = totalValue;
      }
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        payload.items = cartItems.map((item, idx) => formatGA4Item(item, item.qty || 1, idx + 1)).filter(Boolean);
      }

      gtag('event', 'add_payment_info', payload);
    } catch (e) {
      console.warn('GA4 add_payment_info error:', e);
    }
  }

  // 9. Purchase (Deduplicated with sessionStorage guard)
  function ga4Purchase(orderId, totalValue, cartItems, shippingFee, couponCode) {
    try {
      const gtag = getGtag();
      if (!gtag) return;
      const cleanOrderId = String(orderId || '').trim();
      if (!cleanOrderId) return;

      // Strict Deduplication Check
      const dedupeKey = 'ga4_purchase_' + cleanOrderId;
      try {
        if (sessionStorage.getItem(dedupeKey)) {
          console.info('GA4 purchase event already recorded for order #' + cleanOrderId);
          return;
        }
        sessionStorage.setItem(dedupeKey, '1');
      } catch (storageErr) {
        // Continue safely even if sessionStorage is blocked
      }

      const val = typeof totalValue === 'number' ? totalValue : parseFloat(totalValue) || 0;
      const ship = typeof shippingFee === 'number' ? shippingFee : parseFloat(shippingFee) || 0;
      const items = Array.isArray(cartItems) && cartItems.length > 0
        ? cartItems.map((item, idx) => formatGA4Item(item, item.qty || 1, idx + 1)).filter(Boolean)
        : [];

      const payload = {
        transaction_id: cleanOrderId,
        value: val,
        currency: 'INR',
        shipping: ship,
        items: items
      };
      if (couponCode) {
        payload.coupon = String(couponCode).trim();
      }

      gtag('event', 'purchase', payload);
    } catch (e) {
      console.warn('GA4 purchase error:', e);
    }
  }

  // 10. Login
  function ga4Login(method) {
    try {
      const gtag = getGtag();
      if (!gtag) return;
      gtag('event', 'login', {
        method: method || 'email'
      });
    } catch (e) {
      console.warn('GA4 login error:', e);
    }
  }

  // 11. Sign Up
  function ga4SignUp(method) {
    try {
      const gtag = getGtag();
      if (!gtag) return;
      gtag('event', 'sign_up', {
        method: method || 'email'
      });
    } catch (e) {
      console.warn('GA4 sign_up error:', e);
    }
  }

  // Expose methods to global scope
  window.ga4ViewItem = ga4ViewItem;
  window.ga4ViewItemList = ga4ViewItemList;
  window.ga4Search = ga4Search;
  window.ga4AddToCart = ga4AddToCart;
  window.ga4RemoveFromCart = ga4RemoveFromCart;
  window.ga4AddToWishlist = ga4AddToWishlist;
  window.ga4BeginCheckout = ga4BeginCheckout;
  window.ga4AddPaymentInfo = ga4AddPaymentInfo;
  window.ga4Purchase = ga4Purchase;
  window.ga4Login = ga4Login;
  window.ga4SignUp = ga4SignUp;

})();

