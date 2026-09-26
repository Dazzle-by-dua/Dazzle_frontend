# Dazzle by Dua — Fine Jewellery E-Commerce Frontend

A luxury, minimal, multi-page front-end jewellery e-commerce website crafted with an elegant ivory, warm beige, and muted champagne gold aesthetic.

## ✨ Features

- **Multi-Page Architecture**:
  - **Home** (`index.html`): Hero section with call-to-actions, category spotlights, new arrivals, brand story, customer testimonials, and Instagram gallery.
  - **Shop** (`shop.html`): Comprehensive product catalog with category checkboxes, price range slider, availability filters, sort by options (newest, price, rating), grid/list view toggles, pagination, and a customer reviews & ratings section with a 5-star submission form.
  - **Offers & Combos** (`offers.html`): Live real-time countdown timer, one-click copyable coupon codes (`DAZZLE10`), bundle deals with discount badges, and newsletter subscription.
  - **My Orders** (`orders.html`): Interactive status tabs (*All*, *Processing*, *Shipped*, *Delivered*, *Cancelled*), multi-step delivery tracking progression bar, order breakdown, and order action buttons.
  - **Wishlist** (`wishlist.html`): Saved favourites with dynamic badge counter, remove items, clear all, add all to cart, empty state handling, and curated recommendations.
  - **Contact Us** (`contact.html`): Direct contact details (Email, Phone, WhatsApp, Instagram, Business hours), interactive inquiry form, and an animated FAQ accordion.

- **Design System**:
  - **Color Palette**:
    - Primary Background: `#FFFDF8` (Ivory)
    - Secondary Background: `#F7EFE3` (Warm Beige)
    - Primary Accent: `#D4AF7C` (Muted Champagne Gold)
    - Accent Hover: `#B99461`
    - Main Text: `#1A1A1A`
    - Secondary Text: `#77736D`
  - **Typography**: Google Fonts *Playfair Display* (Serif headings) and *Montserrat* (Clean sans-serif body).
  - **UI/UX Details**: Sticky frosted-glass navbar, rounded buttons, floating toast notifications, interactive badge counters for Cart and Wishlist, and responsive mobile navigation drawer.

- **Frontend-Only State Management**:
  - Client-side persistent cart and wishlist state via `localStorage`.
  - Zero backend dependencies, vanilla HTML5, CSS3, and JavaScript.

## 🚀 Getting Started

Clone the repository and open any of the HTML pages directly in your browser:

```bash
git clone https://github.com/Dazzle-by-dua/Dazzle_frontend.git
cd Dazzle_frontend
```

Simply open `index.html` in your favorite web browser, or run a local web server:

```bash
# Using Python
python -m http.server 8080

# Or using npx serve
npx serve
```
