/**
 * Forzan Search Logic
 * Handles URL processing and Proxy navigation
 */

const statusMsg = document.getElementById("m");
const searchFrame = document.getElementById("ifr");

// Supported Search Engines
const engines = {
    google: "https://www.google.com/search?q=",
    ddg: "https://duckduckgo.com/?q=",
    brave: "https://search.brave.com/search?q=",
    yahoo: "https://search.yahoo.com/search?p="
};

/**
 * Main entry point for a search/URL query
 */
function launch(query) {
    if (isValidUrl(query)) {
        // Ensure protocol exists
        const url = (query.startsWith("http://") || query.startsWith("https://")) 
            ? query 
            : "https://" + query;
        navigate(url);
    } else {
        // Fallback to preferred search engine
        const preferred = localStorage.getItem("forzan||engine") || "google";
        const searchUrl = (engines[preferred] || engines.google) + encodeURIComponent(query);
        navigate(searchUrl);
    }
}

/**
 * Checks if a string looks like a website address
 */
function isValidUrl(str) {
    // Regex checks for http(s) or a dot indicating a domain (e.g., site.com)
    return /^https?:\/\//.test(str) || (str.includes(".") && str.trim().length > 3);
}

/**
 * Encodes the URL and triggers the Service Worker
 */
async function navigate(url) {
    if (!navigator.serviceWorker) {
        statusMsg.textContent = "Service Workers are disabled or unsupported.";
        return;
    }

    try {
        // Register UV Service Worker
        await navigator.serviceWorker.register("../sw.js", {
            scope: __uv$config.prefix
        });

        // Encode via UV and redirect
        const encoded = __uv$config.prefix + __uv$config.encodeUrl(url);
        window.location.href = encoded;
    } catch (err) {
        statusMsg.textContent = "Failed to launch proxy: " + err.message;
    }
}

// Event listener for the form
const searchForm = document.getElementById("proxy-form");
const urlInput = document.getElementById("url-input");

if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        launch(urlInput.value);
    });
}
