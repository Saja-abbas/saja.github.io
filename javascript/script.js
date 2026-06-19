/* ── script.js — SAJA P T Portfolio ── */
"use strict";

/* ─── Year ─── */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Theme ─── */
const toggleBtn = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
updateToggleLabel(savedTheme);

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateToggleLabel(next);
  });
}

function updateToggleLabel(theme) {
  if (!toggleBtn) return;
  toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  toggleBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

/* ─── Active nav link ─── */
const currentPath = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-right a.btn").forEach(link => {
  const href = link.getAttribute("href");
  if (href === currentPath || (currentPath === "" && href === "index.html")) {
    link.classList.add("active");
  }
});

/* ─── Scroll reveal (IntersectionObserver) ─── */
const revealEls = document.querySelectorAll(".reveal, .stagger");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("visible"));
}

/* ─── Smooth header shadow on scroll ─── */
const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    header.style.background = window.scrollY > 10
      ? "rgba(8,6,26,.82)"
      : "";
  }, { passive: true });
}

/* ─── Typed greeting on home page ─── */
const kicker = document.querySelector(".kicker");
if (kicker && kicker.dataset.type) {
  const words = kicker.dataset.type.split(",");
  let wi = 0, ci = 0, deleting = false;
  const base = kicker.dataset.base || "";

  function type() {
    const word = words[wi];
    if (!deleting) {
      kicker.textContent = base + word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 1600);
        return;
      }
    } else {
      kicker.textContent = base + word.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();
}

/* ─── Form feedback ─── */
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    const btn = contactForm.querySelector('[type="submit"]');
    if (btn) {
      btn.textContent = "Sent ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "Send message";
        btn.disabled = false;
      }, 3000);
    }
  });
}

/* ─── Ripple on buttons ─── */
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function (e) {
    const r = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,.15);
      border-radius:50%;
      transform:scale(0);
      animation:_ripple .5s linear;
      pointer-events:none;
    `;
    if (!document.getElementById("_ripple-style")) {
      const s = document.createElement("style");
      s.id = "_ripple-style";
      s.textContent = "@keyframes _ripple{to{transform:scale(2.5);opacity:0}}";
      document.head.appendChild(s);
    }
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  });
});
