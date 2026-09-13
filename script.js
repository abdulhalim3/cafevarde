// =========================================================
// Café Verde — script.js
// Mobile nav, menu filtering, contact form validation,
// scroll reveal animation, active nav state.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initScrollReveal();
  initMenuFilter();
  initContactForm();
});

/* ---------- Mobile hamburger menu ---------- */
function initMobileNav() {
  var toggle = document.querySelector(".nav-toggle");
  var navbar = document.querySelector(".navbar");

  if (!toggle || !navbar) return;

  toggle.addEventListener("click", function () {
    var isOpen = navbar.classList.toggle("menu-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the panel when a link inside it is clicked
  var panelLinks = document.querySelectorAll(".mobile-panel a");
  panelLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navbar.classList.remove("menu-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
}

/* ---------- Menu category filter (fade/scale transition) ---------- */
function initMenuFilter() {
  var tabs = document.querySelectorAll(".menu-tab");
  var items = document.querySelectorAll(".menu-item");

  if (!tabs.length || !items.length) return;

  var TRANSITION_MS = 260;

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      if (tab.classList.contains("is-active")) return;

      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      var target = tab.getAttribute("data-category");

      // Fade/scale out everything first
      items.forEach(function (item) {
        item.classList.add("is-hiding");
      });

      setTimeout(function () {
        items.forEach(function (item) {
          var matches = target === "all" || item.getAttribute("data-category") === target;
          item.classList.toggle("is-hidden", !matches);
        });

        // Force reflow so the fade-in transition plays
        void document.body.offsetHeight;

        items.forEach(function (item) {
          item.classList.remove("is-hiding");
        });
      }, TRANSITION_MS);
    });
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = true;

    var name = form.querySelector("#name");
    var email = form.querySelector("#email");
    var subject = form.querySelector("#subject");
    var message = form.querySelector("#message");

    isValid = validateRequired(name, "Please enter your full name.") && isValid;
    isValid = validateEmail(email) && isValid;
    isValid = validateRequired(subject, "Please add a subject.") && isValid;
    isValid = validateMessage(message) && isValid;

    if (isValid) {
      status.textContent =
        "Thanks, " + name.value.trim().split(" ")[0] + " — your message is on its way. We'll get back to you soon.";
      status.classList.add("is-visible");
      form.reset();
      clearAllErrors(form);
    } else {
      status.classList.remove("is-visible");
    }
  });

  // Clear an error as soon as the person starts fixing it
  ["name", "email", "subject", "message"].forEach(function (id) {
    var field = form.querySelector("#" + id);
    if (field) {
      field.addEventListener("input", function () {
        field.closest(".form-field").classList.remove("has-error");
      });
    }
  });
}

function validateRequired(field, message) {
  var wrapper = field.closest(".form-field");
  var errorEl = wrapper.querySelector(".field-error");

  if (!field.value.trim()) {
    wrapper.classList.add("has-error");
    errorEl.textContent = message;
    return false;
  }

  wrapper.classList.remove("has-error");
  return true;
}

function validateEmail(field) {
  var wrapper = field.closest(".form-field");
  var errorEl = wrapper.querySelector(".field-error");
  var value = field.value.trim();
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    wrapper.classList.add("has-error");
    errorEl.textContent = "Please enter your email address.";
    return false;
  }

  if (!pattern.test(value)) {
    wrapper.classList.add("has-error");
    errorEl.textContent = "Please enter a valid email address.";
    return false;
  }

  wrapper.classList.remove("has-error");
  return true;
}

function validateMessage(field) {
  var wrapper = field.closest(".form-field");
  var errorEl = wrapper.querySelector(".field-error");
  var value = field.value.trim();

  if (!value) {
    wrapper.classList.add("has-error");
    errorEl.textContent = "Please write a short message.";
    return false;
  }

  if (value.length < 15) {
    wrapper.classList.add("has-error");
    errorEl.textContent = "Your message looks a little short — tell us a bit more.";
    return false;
  }

  wrapper.classList.remove("has-error");
  return true;
}

function clearAllErrors(form) {
  form.querySelectorAll(".form-field").forEach(function (field) {
    field.classList.remove("has-error");
  });
}
