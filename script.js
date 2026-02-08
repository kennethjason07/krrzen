// krrrZen - Interactive Features

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileNav = document.getElementById("mobile-nav");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileNav.classList.toggle("hidden");
      mobileNav.classList.toggle("active");

      // Toggle icon between menu and close
      const icon = this.querySelector(".material-icons");
      if (icon) {
        icon.textContent = mobileNav.classList.contains("hidden")
          ? "menu"
          : "close";
      }
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileNav.classList.add("hidden");
        mobileNav.classList.remove("active");
        const icon = mobileMenuBtn.querySelector(".material-icons");
        if (icon) {
          icon.textContent = "menu";
        }
      });
    });
  }
});

// Newsletter Form Handling
document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("email-input");
  const formMessage = document.getElementById("form-message");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }

      // Show loading state
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Subscribing...";
      submitBtn.disabled = true;
      newsletterForm.classList.add("loading");

      // Simulate API call (replace with actual API endpoint)
      setTimeout(() => {
        // Success
        showMessage(
          "Thank you for subscribing! Check your email for confirmation.",
          "success",
        );
        emailInput.value = "";

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        newsletterForm.classList.remove("loading");

        // Track subscription (Google Analytics example)
        if (typeof gtag !== "undefined") {
          gtag("event", "newsletter_signup", {
            event_category: "engagement",
            event_label: "Newsletter Subscription",
          });
        }
      }, 1500);
    });
  }

  function showMessage(message, type) {
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.classList.remove(
        "hidden",
        "success-message",
        "error-message",
      );
      formMessage.classList.add(
        type === "success" ? "success-message" : "error-message",
      );

      // Auto-hide after 5 seconds
      setTimeout(() => {
        formMessage.classList.add("hidden");
      }, 5000);
    }
  }
});

// Smooth Scroll Enhancement
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if it's just "#"
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});

// Lazy Loading Images
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach((img) => img.classList.add("loaded"));
  }
});

// Product Card Interactions
document.addEventListener("DOMContentLoaded", function () {
  const productCards = document.querySelectorAll(".bg-ivory.rounded-lg");

  productCards.forEach((card) => {
    card.classList.add("product-card");

    // Add click tracking
    card.addEventListener("click", function () {
      const productName =
        this.querySelector("h3")?.textContent || "Unknown Product";
      const productPrice =
        this.querySelector("p")?.textContent || "Unknown Price";

      console.log(`Product clicked: ${productName} - ${productPrice}`);

      // Track with Google Analytics if available
      if (typeof gtag !== "undefined") {
        gtag("event", "product_click", {
          event_category: "ecommerce",
          event_label: productName,
          value: productPrice,
        });
      }
    });
  });
});

// Header Scroll Effect
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add("shadow-lg");
    } else {
      header.classList.remove("shadow-lg");
    }

    lastScroll = currentScroll;
  });
});

// Shopping Cart Functionality (Basic)
document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("krrrzen_cart")) || [];

  // Update cart count in header
  function updateCartCount() {
    const cartIcon = document.querySelector('a[href="#cart"]');
    if (cartIcon) {
      const count = cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0,
      );

      // Remove existing badge if any
      const existingBadge = cartIcon.querySelector(".cart-badge");
      if (existingBadge) {
        existingBadge.remove();
      }

      // Add badge if cart has items
      if (count > 0) {
        const badge = document.createElement("span");
        badge.className =
          "cart-badge absolute -top-2 -right-2 bg-coral-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center";
        badge.textContent = count;
        cartIcon.style.position = "relative";
        cartIcon.appendChild(badge);
      }
    }
  }

  updateCartCount();

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("krrrzen_cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Expose cart functions globally for potential use
  window.krrrzenCart = {
    add: function (product) {
      cart.push(product);
      saveCart();
      console.log("Product added to cart:", product);
    },
    get: function () {
      return cart;
    },
    clear: function () {
      cart = [];
      saveCart();
    },
  };
});

// Accessibility: Keyboard Navigation Enhancement
document.addEventListener("DOMContentLoaded", function () {
  // Add keyboard navigation for product cards
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
});

// Performance: Debounce Function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Console Welcome Message
console.log(
  "%c🐝 Welcome to krrrZen! 🌻",
  "color: #EF5350; font-size: 20px; font-weight: bold;",
);
console.log("%cHandcrafted with love ❤️", "color: #C5E1A5; font-size: 14px;");
