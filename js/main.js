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

  /* === PHOTO GALLERIES ("A closer look" cards) ===
     Each [data-gallery] card cycles its .gallery-slide children every
     ~2s. Hovering/focusing a card pauses the autoplay so a visitor who
     stops to look isn't fighting the timer. Clicking the photo (not an
     arrow) opens the shared fullscreen lightbox, which has no timer;
     closing it hands the current photo back to the card so autoplay
     resumes from wherever the visitor left off. */
  (function () {
    var lightboxEl = document.querySelector("[data-gallery-lightbox]");
    if (!lightboxEl) {
      return;
    }

    var stageEl = lightboxEl.querySelector("[data-gallery-lightbox-stage]");
    var closeBtn = lightboxEl.querySelector("[data-gallery-lightbox-close]");
    var lbPrevBtn = lightboxEl.querySelector("[data-gallery-lightbox-prev]");
    var lbNextBtn = lightboxEl.querySelector("[data-gallery-lightbox-next]");

    function renderStage(slides, index) {
      stageEl.innerHTML = "";
      var inner = slides[index].querySelector(".gallery-slide-inner");
      if (inner) {
        stageEl.appendChild(inner.cloneNode(true));
      }
      var multiple = slides.length > 1;
      lbPrevBtn.hidden = !multiple;
      lbNextBtn.hidden = !multiple;
    }

    function openLightbox(slides, startIndex, onClose) {
      var index = startIndex;
      renderStage(slides, index);
      lightboxEl.hidden = false;
      document.body.classList.add("lightbox-open");

      function next() {
        index = (index + 1) % slides.length;
        renderStage(slides, index);
      }

      function prev() {
        index = (index - 1 + slides.length) % slides.length;
        renderStage(slides, index);
      }

      function onKeydown(event) {
        if (event.key === "Escape") {
          close();
        } else if (event.key === "ArrowRight") {
          next();
        } else if (event.key === "ArrowLeft") {
          prev();
        }
      }

      function close() {
        lightboxEl.hidden = true;
        document.body.classList.remove("lightbox-open");
        lbPrevBtn.removeEventListener("click", prev);
        lbNextBtn.removeEventListener("click", next);
        closeBtn.removeEventListener("click", close);
        document.removeEventListener("keydown", onKeydown);
        if (onClose) {
          onClose(index);
        }
      }

      lbPrevBtn.addEventListener("click", prev);
      lbNextBtn.addEventListener("click", next);
      closeBtn.addEventListener("click", close);
      document.addEventListener("keydown", onKeydown);
      closeBtn.focus();
    }

    /* --- Compact cards on the homepage "A closer look" section --- */
    document.querySelectorAll("[data-gallery]").forEach(function (card) {
      var slides = Array.prototype.slice.call(card.querySelectorAll(".gallery-slide"));
      if (!slides.length) {
        return;
      }

      var viewport = card.querySelector(".gallery-card-viewport");
      var prevBtn = card.querySelector("[data-gallery-prev]");
      var nextBtn = card.querySelector("[data-gallery-next]");
      var interval = parseInt(card.getAttribute("data-autoplay-interval"), 10) || 2000;
      var index = 0;
      var timer = null;

      function show(i) {
        index = (i + slides.length) % slides.length;
        slides.forEach(function (slide, si) {
          slide.classList.toggle("is-active", si === index);
        });
      }

      function nextSlide() {
        show(index + 1);
      }

      function prevSlide() {
        show(index - 1);
      }

      function stopAutoplay() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      function startAutoplay() {
        stopAutoplay();
        if (prefersReducedMotion || slides.length <= 1) {
          return;
        }
        timer = window.setInterval(nextSlide, interval);
      }

      if (slides.length <= 1) {
        if (prevBtn) prevBtn.hidden = true;
        if (nextBtn) nextBtn.hidden = true;
      } else {
        if (prevBtn) {
          prevBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            prevSlide();
            startAutoplay();
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            nextSlide();
            startAutoplay();
          });
        }
      }

      card.addEventListener("mouseenter", stopAutoplay);
      card.addEventListener("mouseleave", startAutoplay);
      card.addEventListener("focusin", stopAutoplay);
      card.addEventListener("focusout", function (event) {
        if (!card.contains(event.relatedTarget)) {
          startAutoplay();
        }
      });

      if (viewport) {
        viewport.addEventListener("click", function (event) {
          if (event.target.closest("[data-gallery-prev],[data-gallery-next],.gallery-more-btn")) {
            return;
          }
          stopAutoplay();
          openLightbox(slides, index, function (closedIndex) {
            show(closedIndex);
            startAutoplay();
          });
        });

        viewport.addEventListener("keydown", function (event) {
          if (event.key === "ArrowRight") {
            nextSlide();
            startAutoplay();
          } else if (event.key === "ArrowLeft") {
            prevSlide();
            startAutoplay();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            viewport.click();
          }
        });
      }

      show(0);
      startAutoplay();
    });
  })();

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
