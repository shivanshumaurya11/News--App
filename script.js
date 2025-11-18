/* ==========================
   Configuration for Vercel
   - PROXY_URL uses Vercel serverless API route
   ========================== */
const PROXY_URL = "/api/news"; // Vercel API function
const DEFAULT_QUERY = "India";

/* ==========================
   DOM References
   ========================== */
const cardsContainer = document.getElementById("cards-container");
const newsCardTemplate = document.getElementById("template-news-card");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle") || document.querySelector(".menu-icon");
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
const backBtn = document.getElementById("btn");
const toggleDark = document.getElementById("toggleDark");

let curSelectedNav = null;

/* ==========================
   Load default news
   ========================== */
window.addEventListener("load", () => fetchNews(DEFAULT_QUERY));

/* ==========================
   Fetch news from Vercel API
   ========================== */
async function fetchNews(query) {
  try {
    const url = `${PROXY_URL}?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.articles || data.articles.length === 0) {
      console.warn("No data received from API.");
      cardsContainer.innerHTML = "<p>No news articles found.</p>";
      return;
    }

    bindData(data.articles);

  } catch (err) {
    console.error("API fetch failed:", err);
    cardsContainer.innerHTML = "<p>Unable to load news. Try again later.</p>";
  }
}

/* ==========================
   Bind news list to DOM
   ========================== */
function bindData(articles = []) {
  cardsContainer.innerHTML = "";

  articles.forEach(article => {
    if (!article.urlToImage) {
      article.urlToImage = "https://via.placeholder.com/600x360?text=No+Image";
    }

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

/* ==========================
   Fill single card
   ========================== */
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.textContent = article.title || "Untitled";
  newsDesc.textContent = article.description || "";

  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  newsSource.textContent = `${article.source?.name || "Unknown"} · ${date}`;

  cardClone.querySelector("article")?.addEventListener("click", () => {
    if (article.url) window.open(article.url, "_blank", "noopener");
  });
}

/* ==========================
   Navigation click handling
   ========================== */
function attachNavEvents() {
  const items = document.querySelectorAll(".nav-item");

  items.forEach(item => {
    item.addEventListener("click", () => {
      const query = item.dataset.query || item.innerText;
      fetchNews(query);

      if (curSelectedNav) curSelectedNav.classList.remove("active");
      item.classList.add("active");
      curSelectedNav = item;

      closeMobileNav();
    });
  });
}
attachNavEvents();

/* ==========================
   Mobile nav menu toggle
   ========================== */
function closeMobileNav() {
  navLinks.classList.remove("open");
  navLinks.setAttribute("aria-hidden", "true");
}

function openMobileNav() {
  navLinks.classList.add("open");
  navLinks.setAttribute("aria-hidden", "false");
}

function toggleMenu() {
  navLinks.classList.contains("open") ? closeMobileNav() : openMobileNav();
}
menuToggle?.addEventListener("click", toggleMenu);
window.toggleMenu = toggleMenu;

/* ==========================
   Search bar
   ========================== */
searchButton?.addEventListener("click", () => {
  const q = searchText.value.trim();
  if (!q) return;

  fetchNews(q);

  if (curSelectedNav) curSelectedNav.classList.remove("active");
  curSelectedNav = null;

  closeMobileNav();
});

searchText?.addEventListener("keydown", e => {
  if (e.key === "Enter") searchButton.click();
});

/* ==========================
   Back to top button
   ========================== */
window.addEventListener("scroll", () => {
  backBtn.style.display = window.scrollY > 250 ? "block" : "none";
});

function topFunction() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.topFunction = topFunction;

/* ==========================
   Dark / Light mode toggle
   ========================== */
toggleDark?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

/* ==========================
   Auto close mobile nav on resize
   ========================== */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove("open");
    navLinks.setAttribute("aria-hidden", "false");
  }
});

/* Reload page */
function reload() {
  window.location.reload();
}
window.reload = reload;
