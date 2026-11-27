/* RAYNIX GAMING HUB - homepage library renderer */
(function () {
  "use strict";

  function showProblem(message) {
    var grid = document.getElementById("game-grid");
    if (grid) {
      grid.innerHTML = '<div class="empty">' + message + '</div>';
    }
  }

  function initHub() {
    var grid = document.getElementById("game-grid");
    var search = document.getElementById("search");
    var filters = document.getElementById("filters");
    var count = document.getElementById("game-count");

    if (!grid || !filters || !search) {
      console.error("RAYNIX HUB: Required homepage elements are missing. Check index.html IDs: game-grid, search, filters.");
      return;
    }

    if (!Array.isArray(window.GAMES) || window.GAMES.length === 0) {
      showProblem("Games could not load. Check that games.js is uploaded beside index.html and loaded before script.js.");
      console.error("RAYNIX HUB: window.GAMES is missing. Check the games.js filename and script order.");
      return;
    }

    var activeCategory = "All";
    var categories = ["All"];
    window.GAMES.forEach(function (game) {
      if (game.category && categories.indexOf(game.category) === -1) {
        categories.push(game.category);
      }
    });

    filters.innerHTML = "";
    categories.forEach(function (category) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "filter-btn" + (category === "All" ? " active" : "");
      button.textContent = category;
      button.setAttribute("data-category", category);
      filters.appendChild(button);
    });

    function makeCard(game) {
      var article = document.createElement("article");
      article.className = "game-card";

      var visual = document.createElement("div");
      visual.className = "game-visual";
      visual.textContent = game.icon || "🎮";

      var info = document.createElement("div");
      info.className = "game-info";

      var title = document.createElement("h3");
      title.textContent = game.title || "Untitled game";

      var description = document.createElement("p");
      description.textContent = game.description || "Play this game.";

      var meta = document.createElement("div");
      meta.className = "game-meta";

      var tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = game.category || "Game";

      var play = document.createElement("button");
      play.type = "button";
      play.className = "play-btn";
      play.textContent = "PLAY ↗";
      play.setAttribute("data-play", game.id || "");

      meta.appendChild(tag);
      meta.appendChild(play);
      info.appendChild(title);
      info.appendChild(description);
      info.appendChild(meta);
      article.appendChild(visual);
      article.appendChild(info);
      return article;
    }

    function render() {
      var query = (search.value || "").trim().toLowerCase();
      var filtered = window.GAMES.filter(function (game) {
        var categoryMatch = activeCategory === "All" || game.category === activeCategory;
        var searchable = [game.title, game.description, game.category].join(" ").toLowerCase();
        return categoryMatch && searchable.indexOf(query) !== -1;
      });

      grid.innerHTML = "";
      if (count) count.textContent = filtered.length + " GAMES";

      if (filtered.length === 0) {
        var empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "No games found. Try another search.";
        grid.appendChild(empty);
        return;
      }

      filtered.forEach(function (game) {
        grid.appendChild(makeCard(game));
      });
    }

    filters.addEventListener("click", function (event) {
      var button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.getAttribute("data-category");
      filters.querySelectorAll("[data-category]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      render();
    });

    search.addEventListener("input", render);

    grid.addEventListener("click", function (event) {
      var button = event.target.closest("[data-play]");
      if (!button) return;
      var gameId = button.getAttribute("data-play");
      if (!gameId) return;
      window.location.href = "player.html?game=" + encodeURIComponent(gameId);
    });

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    render();
    console.log("RAYNIX HUB: " + window.GAMES.length + " games loaded.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHub);
  } else {
    initHub();
  }
})();
