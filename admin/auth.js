/* ========================================================
   DAZZLE BY DUA - Admin Authentication Layer
   Connects to Render Deployed REST API with JWT Auth
   ======================================================== */

const API_BASE_URL = "https://dazzle-backend-69un.onrender.com";
window.API_BASE_URL = API_BASE_URL;

const AdminAuth = {
  STORAGE_KEY: "dazzle_admin_session",
  API_BASE_URL: API_BASE_URL,



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

  getToken() {
    const sess = this.getSession();
    return sess && sess.token ? sess.token : null;
  },

  isAuthenticated() {
    return !!this.getSession();
  },

  // Perform login against Render FastAPI Backend
  async login(identifier, password, rememberMe = false) {
    const cleanId = (identifier || "").trim();
    const cleanPass = (password || "").trim();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanId,
          password: cleanPass,
          rememberMe: !!rememberMe
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.token) {
        const sessionData = {
          user: (data.user && data.user.user) || "Dua",
          email: (data.user && data.user.email) || cleanId,
          role: (data.user && data.user.role) || "Master Administrator",
          token: data.token,
          loginTime: data.loginTime || new Date().toISOString()
        };

        // Clear any prior auth
        localStorage.removeItem(this.STORAGE_KEY);
        sessionStorage.removeItem(this.STORAGE_KEY);

        // Always persist to localStorage and sessionStorage for seamless multi-tab administration
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));

        return {
          success: true,
          user: sessionData
        };
      } else {
        return {
          success: false,
          message: data.detail || data.message || "Invalid admin credentials. Please check your username/email and password."
        };
      }
    } catch (netErr) {
      console.warn("Backend authentication connection error:", netErr);
      return {
        success: false,
        message: "Failed to connect to authentication server at " + API_BASE_URL + ". Please check your network connection and verify backend is running."
      };
    }
  },

  // Clear session and notify backend
  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }).catch(() => {});
      } catch (e) {
        console.warn("Logout notification error:", e);
      }
    }

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
      const currentUrl = window.location.pathname + window.location.search + window.location.hash;
      const redirectTarget = encodeURIComponent(currentUrl);

      if (document.documentElement) {
        document.documentElement.style.visibility = "hidden";
      }

      const idx = window.location.pathname.indexOf("/admin");
      const prefix = idx >= 0 ? window.location.pathname.slice(0, idx) : "";
      window.location.replace(prefix + "/admin/login.html?redirect=" + redirectTarget);
      return false;
    }

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
