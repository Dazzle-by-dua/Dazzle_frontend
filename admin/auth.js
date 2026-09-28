/* ========================================================
   DAZZLE BY DUA — Admin Authentication Layer (Prototype)
   Protects all Admin CMS pages and manages session state.
   ======================================================== */

const AdminAuth = {
  STORAGE_KEY: "dazzle_admin_session",

  // Accepted demo credentials for this prototype
  // In production, this authentication logic connects to a secure backend API with bcrypt/JWT.
  CREDENTIALS: [
    {
      username: "admin",
      email: "admin@dazzlebydua.com",
      password: "admin123",
      name: "Dua",
      role: "Master Administrator"
    },
    {
      username: "dua",
      email: "dua@dazzlebydua.com",
      password: "dazzleadmin",
      name: "Dua",
      role: "Store Owner"
    }
  ],

  // Check if an authenticated session exists in localStorage or sessionStorage
  getSession() {
    try {
      const local = localStorage.getItem(this.STORAGE_KEY);
      if (local) return JSON.parse(local);
      const session = sessionStorage.getItem(this.STORAGE_KEY);
      if (session) return JSON.parse(session);
    } catch (e) {
      console.warn("Error reading session:", e);
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getSession();
  },

  // Perform login with simulated latency for realistic loading experience
  async login(identifier, password, rememberMe = false) {
    // Artificial 400ms delay to simulate secure authentication check
    await new Promise(resolve => setTimeout(resolve, 400));

    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const matchedUser = this.CREDENTIALS.find(u =>
      (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
      u.password === cleanPass
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid admin credentials. Please check your username/email and password."
      };
    }

    const sessionData = {
      user: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      token: "proto_jwt_" + Math.random().toString(36).substr(2) + Date.now().toString(36),
      loginTime: new Date().toISOString()
    };

    try {
      // Clear any prior auth
      localStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem(this.STORAGE_KEY);

      if (rememberMe) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      }
    } catch (e) {
      console.error("Failed to store session:", e);
    }

    return {
      success: true,
      user: sessionData
    };
  },

  // Clear session and redirect to login
  logout() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error("Logout error:", e);
    }

    // Determine path back to login.html
    const idx = window.location.pathname.indexOf("/admin");
    const prefix = idx >= 0 ? window.location.pathname.slice(0, idx) : "";
    window.location.replace(prefix + "/admin/login.html");
  },

  // Protect Admin pages: redirects unauthenticated users to login.html
  protectPage() {
    if (!this.isAuthenticated()) {
      // Record current page to return after login
      const currentUrl = window.location.pathname + window.location.search + window.location.hash;
      const redirectTarget = encodeURIComponent(currentUrl);

      // Hide content immediately to prevent Flash of Unauthenticated Content
      if (document.documentElement) {
        document.documentElement.style.visibility = "hidden";
      }

      const idx = window.location.pathname.indexOf("/admin");
      const prefix = idx >= 0 ? window.location.pathname.slice(0, idx) : "";
      window.location.replace(prefix + "/admin/login.html?redirect=" + redirectTarget);
      return false;
    }

    // Authenticated: make document visible
    if (document.documentElement) {
      document.documentElement.style.visibility = "";
    }
    return true;
  }
};

// Immediate protection check when auth.js is loaded on any admin page except login.html
(function() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("/admin") && !path.endsWith("login.html") && !path.endsWith("login")) {
    AdminAuth.protectPage();
  }
})();

// Expose globally
window.AdminAuth = AdminAuth;
