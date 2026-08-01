/* main.js — mobile menu and panel expansion. No dependencies. */

(function () {
  "use strict";

  /* ── Mobile menu ───────────────────────────────────────── */

  function initMenu(toggle, menu) {
    if (!toggle || !menu) {
      return;
    }

    var wide = window.matchMedia("(min-width: 768px)");
    var background = document.querySelectorAll("body > *:not(.mobile-menu)");
    var lastFocused = null;

    function onKeydown(event) {
      if (event.key === "Escape") {
        close(true);
      }
    }

    function setBackgroundInert(state) {
      Array.prototype.forEach.call(background, function (element) {
        element.inert = state;
      });
    }

    function open() {
      lastFocused = document.activeElement;
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("has-menu-open");
      setBackgroundInert(true);

      var first = menu.querySelector("a");
      if (first) {
        first.focus();
      }
      document.addEventListener("keydown", onKeydown);
    }

    function close(restoreFocus) {
      if (menu.hidden) {
        return;
      }
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("has-menu-open");
      setBackgroundInert(false);
      document.removeEventListener("keydown", onKeydown);

      if (restoreFocus && lastFocused) {
        lastFocused.focus();
      }
    }

    toggle.addEventListener("click", function () {
      if (menu.hidden) {
        open();
      } else {
        close(true);
      }
    });

    /* Delegated: a link inside the menu, or the backdrop around it. */
    menu.addEventListener("click", function (event) {
      if (event.target === menu || event.target.closest("a")) {
        close(false);
      }
    });

    wide.addEventListener("change", function (event) {
      if (event.matches) {
        close(false);
      }
    });
  }

  /* ── Panels ────────────────────────────────────────────── */

  function initPanels(container) {
    if (!container) {
      return;
    }

    var panels = Array.prototype.slice.call(container.querySelectorAll(".panel"));
    if (!panels.length) {
      return;
    }

    var wide = window.matchMedia("(min-width: 1024px)");
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    var pinned = null;

    function setOpen(target) {
      panels.forEach(function (panel) {
        var isOpen = panel === target;
        var toggle = panel.querySelector(".panel__toggle");

        panel.classList.toggle("is-open", isOpen);
        if (toggle) {
          toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      });
    }

    panels.forEach(function (panel) {
      var toggle = panel.querySelector(".panel__toggle");

      panel.addEventListener("pointerenter", function (event) {
        if (event.pointerType !== "mouse" || !wide.matches || !fine.matches) {
          return;
        }
        pinned = null;
        setOpen(panel);
      });

      if (toggle) {
        toggle.addEventListener("click", function () {
          if (pinned === panel) {
            pinned = null;
            setOpen(null);
          } else {
            pinned = panel;
            setOpen(panel);
          }
        });
      }
    });

    container.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse" && !pinned) {
        setOpen(null);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !document.body.classList.contains("has-menu-open")) {
        pinned = null;
        setOpen(null);
      }
    });

    /* Below 1024px every panel shows its text already: drop any open state. */
    wide.addEventListener("change", function () {
      pinned = null;
      setOpen(null);
    });
  }

  initMenu(
    document.querySelector(".menu-toggle"),
    document.querySelector(".mobile-menu")
  );
  initPanels(document.querySelector(".panels"));
})();
