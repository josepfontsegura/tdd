var SEARCH_DATA = {"en": [{"url": "exercises1.html", "title": "Exercises: 1. Detection", "keywords": "Detection exercises", "section": "Exercises"}, {"url": "index.html", "title": "Course overview", "keywords": "Course overview", "section": "General"}, {"url": "modality-a-final.html", "title": "Modality A: Final", "keywords": "Modality A final", "section": "Modality A"}, {"url": "modality-a-midterm.html", "title": "Modality A: Midterm", "keywords": "Modality A midterm", "section": "Modality A"}, {"url": "seminar1.html", "title": "Seminar 1. Detectors and their errors", "keywords": "Seminar 1", "section": "Seminars"}, {"url": "test1.html", "title": "Test 1. Detection", "keywords": "Test 1", "section": "Tests"}, {"url": "topic1.html", "title": "Topic 1. Detection", "keywords": "1. Detection", "section": "Lecture notes"}]};
function detectLang() {
  var path = window.location.pathname;
  if (path.indexOf("/ca/") !== -1) return "ca";
  if (path.indexOf("/es/") !== -1) return "es";
  return "en";
}

document.addEventListener("DOMContentLoaded", function () {
  // ---- Dark mode toggle ----
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("tdd-theme", next);
    });
  }

  // ---- Sidebar toggle with backdrop ----
  var toggle = document.querySelector(".menu-toggle");
  var sidebar = document.querySelector(".sidebar");

  // Create backdrop element
  var backdrop = document.createElement("div");
  backdrop.className = "sidebar-backdrop";
  document.body.appendChild(backdrop);

  // On mobile, start with sidebar hidden
  if (sidebar && window.innerWidth <= 768 && !sidebar.classList.contains("hidden")) {
    sidebar.classList.add("hidden");
  }

  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.add("hidden");
      backdrop.classList.remove("visible");
    }
  }

  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("hidden");
      if (!sidebar.classList.contains("hidden") && window.innerWidth <= 768) {
        backdrop.classList.add("visible");
      } else {
        backdrop.classList.remove("visible");
      }
    });
  }

  backdrop.addEventListener("click", closeSidebar);

  // ---- Search ----
  var lang = detectLang();
  var placeholders = { en: "Search lectures, exercises\u2026", ca: "Cerca apunts, exercicis\u2026", es: "Buscar apuntes, ejercicios\u2026" };
  var navHints = { en: "navigate", ca: "navegar", es: "navegar" };
  var noResults = { en: "No results found", ca: "Cap resultat trobat", es: "Sin resultados" };

  // Create search overlay
  var searchOverlay = document.createElement("div");
  searchOverlay.className = "search-overlay";
  searchOverlay.innerHTML =
    '<div class="search-box">' +
      '<div class="search-input-wrap">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input type="text" class="search-input" id="search-input" placeholder="' + (placeholders[lang] || placeholders.en) + '" autocomplete="off">' +
      '</div>' +
      '<div class="search-results" id="search-results"></div>' +
      '<div class="search-footer"><kbd>\u2191\u2193</kbd> ' + (navHints[lang] || navHints.en) + ' \u00b7 <kbd>\u21b5</kbd> open \u00b7 <kbd>esc</kbd> close</div>' +
    '</div>';
  document.body.appendChild(searchOverlay);

  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var selectedIdx = -1;

  var searchBtn = document.querySelector(".search-toggle");
  if (searchBtn) {
    searchBtn.addEventListener("click", openSearch);
  }

  function openSearch() {
    searchOverlay.classList.add("open");
    searchInput.value = "";
    searchInput.focus();
    renderSearchResults("");
  }

  function closeSearch() {
    searchOverlay.classList.remove("open");
  }

  searchOverlay.addEventListener("click", function (e) {
    if (e.target === searchOverlay) closeSearch();
  });

  searchInput.addEventListener("input", function () {
    renderSearchResults(this.value);
  });

  searchInput.addEventListener("keydown", function (e) {
    var items = searchResults.querySelectorAll(".search-result");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
      updateSelection(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, 0);
      updateSelection(items);
    } else if (e.key === "Enter" && selectedIdx >= 0 && items[selectedIdx]) {
      e.preventDefault();
      window.location.href = items[selectedIdx].getAttribute("href");
    }
  });

  function updateSelection(items) {
    items.forEach(function (item, i) {
      item.classList.toggle("selected", i === selectedIdx);
    });
    if (items[selectedIdx]) {
      items[selectedIdx].scrollIntoView({ block: "nearest" });
    }
  }

  function renderSearchResults(query) {
    selectedIdx = -1;
    var data = SEARCH_DATA[lang] || SEARCH_DATA.en;

    if (!query.trim()) {
      searchResults.innerHTML = data.map(function (item) {
        return '<a class="search-result" href="' + item.url + '">' +
          '<span class="search-result-title">' + item.title + '</span>' +
          '<span class="search-result-section">' + item.section + '</span></a>';
      }).join("");
      return;
    }

    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    var results = data.filter(function (item) {
      var text = (item.title + " " + item.keywords + " " + item.section).toLowerCase();
      return terms.every(function (t) { return text.indexOf(t) !== -1; });
    });

    if (results.length) {
      searchResults.innerHTML = results.map(function (item) {
        return '<a class="search-result" href="' + item.url + '">' +
          '<span class="search-result-title">' + item.title + '</span>' +
          '<span class="search-result-section">' + item.section + '</span></a>';
      }).join("");
    } else {
      searchResults.innerHTML = '<div class="search-empty">' + (noResults[lang] || noResults.en) + '</div>';
    }
  }

  // Global keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (searchOverlay.classList.contains("open")) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === "Escape") {
      if (searchOverlay.classList.contains("open")) {
        closeSearch();
      } else {
        closeSidebar();
      }
    }
  });

  // ---- Expand/collapse all solutions ----
  var expandBtn = document.getElementById("expand-all");
  if (expandBtn) {
    expandBtn.addEventListener("click", function () {
      var details = document.querySelectorAll("details.solution");
      var allOpen = Array.from(details).every(function (d) {
        return d.open;
      });
      details.forEach(function (d) {
        d.open = !allOpen;
      });
      expandBtn.textContent = allOpen
        ? expandBtn.dataset.expand
        : expandBtn.dataset.collapse;
    });
  }
});
