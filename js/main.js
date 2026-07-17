/*
  Here and Now — shared site behavior.
  Vanilla JS only: mobile nav toggle, scroll-reveal via IntersectionObserver,
  footer year, and a placeholder newsletter form handler.
*/

(function () {
  "use strict";

  /* === MOBILE NAV TOGGLE === */
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* === SCROLL-REVEAL ANIMATIONS ===
     Gentle fade/slide-up on entry. Respects prefers-reduced-motion by
     revealing everything immediately without observing. */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* === FOOTER YEAR === */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* === NEWSLETTER FORMS (placeholder) ===
     TODO: connect to actual email platform once chosen (Mailchimp/ConvertKit/etc.).
     For now this just confirms receipt locally so the form is demoable. */
  document.querySelectorAll("[data-newsletter-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-newsletter-status]");
      var input = form.querySelector("input[type='email']");
      if (status && input && input.value) {
        status.textContent = "Thanks — you're on the list.";
        form.reset();
      }
    });
  });
})();
