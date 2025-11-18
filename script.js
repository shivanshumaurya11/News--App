/* ==========================
   Configuration
   - PROXY_URL should point to your Netlify function
   - If proxy fails we show sample fallback news
   ========================== */
const PROXY_URL = "/.netlify/functions/news"; // keep as-is for Netlify
const DEFAULT_QUERY = "India";

/* ---------------------
   Sample fallback news
   (used when fetch fails or returns nothing)
   --------------------- */
const SAMPLE_NEWS = [
  {
    title: "Local startup raises seed round to scale AI tools",
    description: "A promising team announced funding to build developer tools for small businesses.",
    urlToImage: "https://images.unsplash.com/photo-1526378722482-5f6f8f3efb9a",
    url: "#",
    publishedAt: new Date().toISOString(),
    source: { name: "LocalTech" }
  },
  {
    title: "Sports: thrilling comeback seals championship",
    description: "An incredible last-minute winner sparked celebrations across the city.",
    urlToImage: "https://images.unsplash.com/photo-1509228627153-1a7a1838b6f7",
    url: "#",
    publishedAt: new Date().toISOString(),
    source: { name: "Sports Daily" }
  },
  {
    title: "Science: New discovery hints at cleaner batteries",
    description: "Researchers publish promising lab results toward longer-lasting batteries.",
    urlToImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    url: "#",
    publishedAt: new Date().toISOString(),
    source: { name: "ScienceWire" }
  }
];

/* ==========================
   Helpers & DOM refs
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
   Start: load default news
   ========================== */
window.addEventListener("load", () => fetchNews(DEFAULT_QUERY));

/* ==========================
   Fetch news from proxy (Netlify)
   Falls back to SAMPLE_NEWS on error
   ========================== */
async function fetchNews(query) {
  try {
    const url = `${PROXY_URL}?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.status === "error" || !data.articles || data.articles.length === 0) {
      console.warn("API returned no data — using fallback sample news.");
      bindData(SAMPLE_NEWS);
      return;
    }
    bindData(data.articles);
  } catch (err) {
    console.error("Fetch failed — using fallback sample news.", err);
    bindData(SAMPLE_NEWS);
  }
}

/* ==========================
   Bind articles to the DOM
   ========================== */
function bindData(articles = []) {
  cardsContainer.innerHTML = "";
  articles.forEach(article => {
    if (!article.urlToImage) {
      // allow articles without image by using placeholder
      article.urlToImage = "https://via.placeholder.com/600x360?text=No+Image";
    }

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

/* ==========================
   Fill single card node
   ========================== */
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage || "";
  newsTitle.textContent = article.title || "Untitled";
  newsDesc.textContent = article.description || "";

  // Format date for Asia/Kolkata
  const date = article.publishedAt ? new Date(article.publishedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) : "";

  newsSource.textContent = `${article.source?.name || "Unknown"} · ${date}`;

  // Open original article on click
  const openUrl = article.url || "#";
  cardClone.querySelector("article")?.addEventListener("click", () => {
    if (openUrl && openUrl !== "#") window.open(openUrl, "_blank", "noopener");
  });
}

/* ==========================
   Navigation item clicks
   ========================== */
function closeMobileNav() {
  navLinks.classList.remove("open");
  navLinks.setAttribute("aria-hidden", "true");
}

function openMobileNav() {
  navLinks.classList.add("open");
  navLinks.setAttribute("aria-hidden", "false");
}

function attachNavEvents() {
  const items = document.querySelectorAll(".nav-item");
  items.forEach(item => {
    item.addEventListener("click", () => {
      const query = item.dataset.query || item.innerText;
      fetchNews(query);

      // update active
      if (curSelectedNav) curSelectedNav.classList.remove("active");
      item.classList.add("active");
      curSelectedNav = item;

      // close mobile nav if open
      closeMobileNav();
    });
  });
}
attachNavEvents();

/* ==========================
   Hamburger menu toggle
   ========================== */
function toggleMenu() {
  if (navLinks.classList.contains("open")) closeMobileNav();
  else openMobileNav();
}
menuToggle?.addEventListener("click", toggleMenu);

/* expose toggleMenu for inline onclick compatibility */
window.toggleMenu = toggleMenu;

/* ==========================
   Search functionality
   ========================== */
searchButton?.addEventListener("click", () => {
  const q = (searchText.value || "").trim();
  if (!q) return;
  fetchNews(q);

  // reset active nav
  if (curSelectedNav) curSelectedNav.classList.remove("active");
  curSelectedNav = null;

  closeMobileNav();
});

// allow Enter key to trigger search
searchText?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchButton.click();
});

/* ==========================
   Scroll -> show back to top
   ========================== */
window.addEventListener("scroll", () => {
  backBtn.style.display = window.scrollY > 250 ? "block" : "none";
});
function topFunction() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.topFunction = topFunction; // expose for inline onclick

/* ==========================
   Reload helper
   ========================== */
function reload() { window.location.reload(); }
window.reload = reload;

/* ==========================
   Dark / Light mode toggle
   - toggles .light-mode on body
   ========================== */
toggleDark?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

/* ==========================
   Close mobile nav on resize > desktop breakpoint
   ========================== */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove("open");
    navLinks.setAttribute("aria-hidden", "false");
  }
});
