async function apiGetNext(theme) {
  const res = await fetch(`/api/dishes/next?theme=${encodeURIComponent(theme)}`, {
    headers: { "Accept": "application/json" }
  });
  return await res.json();
}

async function apiSaveRating(dishId, score) {
  const res = await fetch("/api/ratings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": window.CSRF_TOKEN,
      "Accept": "application/json"
    },
    body: JSON.stringify({ dish_id: dishId, score })
  });
  return await res.json();
}

function formatMeta(theme, avg, my) {
  return (window.I18N_META || "Theme: %{theme} | Avg: %{avg} | My rating: %{my}")
    .replace("%{theme}", theme)
    .replace("%{avg}", avg)
    .replace("%{my}", my);
}

document.addEventListener("DOMContentLoaded", () => {
  const themeSelect = document.getElementById("themeSelect");
  const nextBtn = document.getElementById("nextBtn");
  const status = document.getElementById("status");

  const dishCard = document.getElementById("dishCard");
  const dishTitle = document.getElementById("dishTitle");
  const dishImage = document.getElementById("dishImage");
  const dishMeta = document.getElementById("dishMeta");
  const ratingInfo = document.getElementById("ratingInfo");

  let currentDishId = null;

  async function loadNext() {
    status.textContent = window.I18N_LOADING || "Loading...";
    ratingInfo.textContent = "";

    const theme = themeSelect ? themeSelect.value : "";
    const data = await apiGetNext(theme);

    if (!data.dish) {
      dishCard.style.display = "none";
      status.textContent = data.message || "No dish";
      return;
    }

    currentDishId = data.dish.id;
    dishTitle.textContent = data.dish.title;
    dishImage.src = data.dish.image_url;

    const avg = data.dish.average_rating ?? "—";
    const my = data.my_rating ?? "—";
    dishMeta.textContent = formatMeta(data.dish.theme, avg, my);

    dishCard.style.display = "block";
    status.textContent = "";
  }

  nextBtn?.addEventListener("click", loadNext);

  document.querySelectorAll(".rate-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!currentDishId) return;
      const score = Number(btn.dataset.score);
      const result = await apiSaveRating(currentDishId, score);

      if (result.ok) {
        ratingInfo.textContent = `${window.I18N_SAVED || "Saved"}: ${result.score}`;
      } else {
        ratingInfo.textContent = window.I18N_ERROR || "Error";
      }
    });
  });
});
