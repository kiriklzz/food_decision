function nextUrl() {
  return window.API_NEXT_URL || "/api/dishes/next";
}

function ratingsUrl() {
  return window.API_RATINGS_URL || "/api/ratings";
}

async function apiGetNext(theme) {
  const res = await fetch(`${nextUrl()}?theme=${encodeURIComponent(theme)}`, {
    headers: { "Accept": "application/json" }
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GET next failed: ${res.status} ${txt}`);
  }

  return await res.json();
}

async function apiSaveRating(dishId, score) {
  const res = await fetch(ratingsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": window.CSRF_TOKEN,
      "Accept": "application/json"
    },
    body: JSON.stringify({ dish_id: dishId, score })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST rating failed: ${res.status} ${txt}`);
  }

  return await res.json();
}

function formatMeta(theme, avg, my) {
  const label = (window.I18N_META || "Theme: %{theme} | Avg: %{avg} | My rating: %{my}");
  const th = themeTitle(theme);

  return label
    .replace("%{theme}", th)
    .replace("%{avg}", avg)
    .replace("%{my}", my);
}


function themeTitle(theme) {
  const dict = window.I18N_THEMES || {};
  return dict[theme] || theme;
}


document.addEventListener("DOMContentLoaded", () => {
  const themeSelect = document.getElementById("themeSelect");
  const nextBtn = document.getElementById("nextBtn");
  const skipBtn = document.getElementById("skipBtn");
  const status = document.getElementById("status");
  const themeChips = document.getElementById("themeChips");

  function setActiveChip() {
    if (!themeChips || !themeSelect) return;
    const current = themeSelect.value || "random";
    themeChips.querySelectorAll(".chip").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.theme === current);
    });
  }

  themeChips?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn || !themeSelect) return;

    const th = btn.dataset.theme || "random";
    themeSelect.value = th;
    setActiveChip();
  });

  setActiveChip();

  const dishCard = document.getElementById("dishCard");
  const dishTitle = document.getElementById("dishTitle");
  const dishImage = document.getElementById("dishImage");
  const dishMeta = document.getElementById("dishMeta");
  const ratingInfo = document.getElementById("ratingInfo");

  const themeBadge = document.getElementById("themeBadge");
  const avgKpi = document.getElementById("avgKpi");
  const myKpi = document.getElementById("myKpi");

  let currentDishId = null;

  async function loadNext() {
    status.textContent = window.I18N_LOADING || "Loading...";
    ratingInfo.textContent = "";

    try {
      const theme = themeSelect ? themeSelect.value : "";
      const data = await apiGetNext(theme);

      if (!data.dish) {
        dishCard.style.display = "none";
        status.textContent = data.message || (window.I18N_NO_DISH || "No dish");
        return;
      }

      currentDishId = data.dish.id;
      dishTitle.textContent = data.dish.title;
      dishImage.src = data.dish.image_url;

      const avg = data.dish.average_rating ?? "—";
      const my = data.my_rating ?? "—";

      
      const th = themeTitle(data.dish.theme);

    dishMeta.textContent = formatMeta(data.dish.theme, avg, my);
    if (themeBadge) themeBadge.textContent = `#${th}`;

    if (avgKpi) avgKpi.textContent = `${window.I18N_AVG_LABEL || "Avg"}: ${avg}`;
    if (myKpi) myKpi.textContent = `${window.I18N_MY_LABEL || "My rating"}: ${my}`;


      dishCard.style.display = "block";
      status.textContent = "";
    } catch (e) {
      console.error(e);
      status.textContent = (window.I18N_API_JS_ERROR || "API/JS error (see console)");
      dishCard.style.display = "none";
    }
  }

  nextBtn?.addEventListener("click", loadNext);
  skipBtn?.addEventListener("click", loadNext);

  document.querySelectorAll(".rate-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!currentDishId) return;

      try {
        const score = Number(btn.dataset.score);
        const result = await apiSaveRating(currentDishId, score);

        if (result.ok) {
          ratingInfo.textContent = `${window.I18N_SAVED || "Saved"}: ${result.score}`;
          setTimeout(loadNext, 250);
        } else {
          ratingInfo.textContent = (window.I18N_ERROR || "Error");
        }
      } catch (e) {
        console.error(e);
        ratingInfo.textContent = (window.I18N_ERROR || "Error");
      }
    });
  });
});
