// Dummy Products (Bad mein ye data Supabase se aayega)
const products = [
    { id: 1, name: "Cloud Automation Script", price: 49.99, description: "Python based automated data scraper script." },
    { id: 2, name: "AI Workflow Template", price: 29.99, description: "Ready-to-use n8n integration template." },
    { id: 3, name: "Secure API Boilerplate", price: 99.99, description: "Production-ready backend API structure." }
];

let cart = [];

// Load Products on Page
function renderProducts() {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            </div>
            <div>
                <div class="price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Cart Drawer Toggle
function toggleCart() {
    const drawer = document.getElementById("cart-drawer");
    drawer.classList.toggle("open");
}

// Add Item to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

// Update Cart Display
function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.innerText = totalCount;
    cartTotal.innerText = totalPrice.toFixed(2);

    cartItems.innerHTML = cart.length === 0 ? "<p>Your cart is empty.</p>" : cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
        </div>
    `).join('');
}

// Checkout placeholder
function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Checkout successful! (Supabase order saving will be added next).");
    cart = [];
    updateCartUI();
    toggleCart();
}

// Initialize
renderProducts();
