// api_social.js for API Calling and SocMed Calling
console.log("✅ api_social.js is loaded and running");
function loadHomePageProducts() {
  fetch("https://fakestoreapi.com/products?limit=4")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("api-products");
      if (!container) return;
      data.forEach(product => {
        const card = document.createElement("div");
        card.innerHTML = `
          <h3>${product.title}</h3>
          <img src="${product.image}" width="100">
          <p>${product.price} USD</p>
        `;
        container.appendChild(card);
      });
    });
}

function handleCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("https://fakestoreapi.com/carts", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString(),
        products: [{ productId: 1, quantity: 2 }]
      }),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("order-status").textContent = "Order placed!";
    });
  });
}

function handleContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
      }),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("contact-status").textContent = "Message sent!";
    });
  });
}

function loadSocialMediaPlugins() {
  // Facebook
  const fbRoot = document.createElement("div");
  fbRoot.id = "fb-root";
  document.body.appendChild(fbRoot);
  const fbScript = document.createElement("script");
  fbScript.async = true;
  fbScript.defer = true;
  fbScript.crossOrigin = "anonymous";
  fbScript.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
  document.body.appendChild(fbScript);

  // Twitter
  const twitterScript = document.createElement("script");
  twitterScript.async = true;
  twitterScript.src = "https://platform.twitter.com/widgets.js";
  twitterScript.charset = "utf-8";
  document.body.appendChild(twitterScript);

  // Instagram
  const instaScript = document.createElement("script");
  instaScript.async = true;
  instaScript.src = "//www.instagram.com/embed.js";
  document.body.appendChild(instaScript);
}
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(fbShare, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("Check out this awesome site!");
  const twitterShare = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  window.open(twitterShare, '_blank', 'width=600,height=400');
}

function loadAllProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      products.forEach(product => {
        const col = document.createElement("div");
        col.innerHTML = `
          <div>
            <a href="product-detail.html?id=${product.id}">
              <img src="${product.image}" alt="${product.name}" width="200">
            </a>
            <h5>${product.name}</h5>
            <p>$${product.price}</p>
            <a href="product-detail.html?id=${product.id}">View Details</a>
          </div>
        `;
        container.appendChild(col);
      });
    })
    .catch(error => console.error("Error loading products:", error));
}
function loadProductDetailFromJSON() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const container = document.getElementById("product-detail");
  if (!container || !productId) return;

  fetch("products-detail.json")
    .then(res => res.json())
    .then(products => {
      const product = products[productId];
      if (!product) {
        container.innerHTML = "<h3>Product not found.</h3>";
        return;
      }

      container.innerHTML = `
        <div>
          <img id="product-image" src="${product.image}" alt="Product Image" width="250">
        </div>
        <div>
          <h2 id="product-name">${product.name}</h2>
          <p id="product-price">$${product.price}</p>
          <div style="margin:10px 0;">
            <label for="currencySelect">Show price in:</label>
            <select id="currencySelect">
              <option value="USD">USD</option>
              <option value="MYR">MYR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <strong id="convertedPrice" style="margin-left:8px;"></strong>
          </div>
          <p id="product-description">${product.description}</p>
          <h5>Specifications:</h5>
          <ul id="product-specs"></ul>
          <button id="add-to-cart-btn" class="btn btn-primary">Add to Cart</button>
          <br>
          <a href="product.html">⬅ Back to Collections</a>
        </div>
      `;

      // Populate specs
      const specsList = document.getElementById("product-specs");
      product.specs.forEach(spec => {
        const li = document.createElement("li");
        li.textContent = spec;
        specsList.appendChild(li);
      });

      // Currency conversion
      let fxRates = { USD: 1 };
      const usdPrice = parseFloat(product.price);

      async function loadFxRates() {
        try {
          const res = await fetch("https://api.frankfurter.app/latest?from=USD");
          const data = await res.json();
          fxRates = { USD: 1, ...data.rates };
        } catch (e) {
          console.warn("FX fetch failed, defaulting to USD only");
        }
      }

      function updateConvertedPrice() {
        const cur = document.getElementById("currencySelect").value;
        const rate = fxRates[cur] || 1;
        document.getElementById("convertedPrice").textContent =
          `${cur} ${(usdPrice * rate).toFixed(2)}`;
      }

      loadFxRates().then(() => updateConvertedPrice());
      document.getElementById("currencySelect").addEventListener("change", updateConvertedPrice);

      // Add to cart
      document.getElementById("add-to-cart-btn").addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let existingIndex = cart.findIndex(item => item.name === product.name);
        if (existingIndex > -1) {
          cart[existingIndex].quantity += 1;
        } else {
          cart.push({ name: product.name, price: usdPrice, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
        window.location.href = 'cart.html';
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<h3>Error loading product details.</h3>";
    });
}

function getSelectedRate() {
  const cur = document.getElementById("cartCurrency").value;
  return cartFx[cur] || 1;
}

// Initialize based on current page
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("index.html")) loadHomePageProducts();
  if (path.includes("product.html")) loadAllProducts();
  if (path.includes("checkout.html")) handleCheckoutForm();
  if (path.includes("contact.html")) handleContactForm();
  if (path.includes("product-detail.html")) loadProductDetailFromJSON();

  loadSocialMediaPlugins();
});



