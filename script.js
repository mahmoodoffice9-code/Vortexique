let products = [];
let cart = [];

// Fetch products from JSON and merge with LocalStorage (Admin added products)
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        const defaultProducts = await response.json();
        
        // Check if user has added custom products in localStorage
        const customProducts = JSON.parse(localStorage.getItem('custom_products')) || [];
        
        products = [...defaultProducts, ...customProducts];
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to localStorage only if fetch fails
        products = JSON.parse(localStorage.getItem('custom_products')) || [];
        renderProducts();
    }
}

// Render Products with Image Slider Support & Unique Fallback
function renderProducts() {
    const grid = document.getElementById("product-grid");
    if (products.length === 0) {
        grid.innerHTML = "<p>No products available.</p>";
        return;
    }
    
    grid.innerHTML = products.map((product, pIndex) => {
        let images = product.images;
        
        // Handle images array safely
        if (!images || (Array.isArray(images) && images.length === 0)) {
            images = [`https://picsum.photos/seed/${product.id}/500/300`];
        } else if (typeof images === 'string') {
            images = images.split(',').map(img => img.trim()).filter(img => img.length > 0);
            if (images.length === 0) {
                images = [`https://picsum.photos/seed/${product.id}/500/300`];
            }
        }

        const imageHTML = images.map((img, i) => `
            <img src="${img}" class="${i === 0 ? 'active' : ''}" alt="${product.name}" onerror="this.src='https://picsum.photos/seed/${product.id}/500/300'">
        `).join('');

        return `
            <div class="product-card">
                <div>
                    <div class="product-image-container" id="slider-${pIndex}">
                        ${imageHTML}
                        ${images.length > 1 ? `
                            <div class="slider-btns">
                                <button onclick="changeSlide(${pIndex}, -1)">◀</button>
                                <button onclick="changeSlide(${pIndex}, 1)">▶</button>
                            </div>
                        ` : ''}
                    </div>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>
                <div>
                    <div class="price">$${Number(product.price).toFixed(2)}</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
    }).join('');
}

// Image Slider Functionality
window.slideIndices = {};
function changeSlide(productIndex, direction) {
    const slider = document.getElementById(`slider-${productIndex}`);
    if (!slider) return;
    const images = slider.querySelectorAll('img');
    
    if(!window.slideIndices[productIndex]) {
        window.slideIndices[productIndex] = 0;
    }
    
    images[window.slideIndices[productIndex]].classList.remove('active');
    
    window.slideIndices[productIndex] = (window.slideIndices[productIndex] + direction + images.length) % images.length;
    
    images[window.slideIndices[productIndex]].classList.add('active');
}

// Toggle Admin Modal
function toggleAdminModal() {
    const modal = document.getElementById("admin-modal");
    modal.classList.toggle("open");
}

// Add New Product Handler (Fixed Image URL parsing)
function addNewProduct(event) {
    event.preventDefault();
    
    const title = document.getElementById("p-title").value;
    const desc = document.getElementById("p-desc").value;
    const price = parseFloat(document.getElementById("p-price").value);
    const imagesInput = document.getElementById("p-images").value;
    
    // Clean and split image URLs properly
    let images = imagesInput
        .split(',')
        .map(img => img.trim())
        .filter(img => img.length > 0);

    // Fallback if no valid link is provided
    if (images.length === 0) {
        images = [`https://picsum.photos/seed/${Date.now()}/500/300`];
    }

    const newProduct = {
        id: Date.now(), // Unique ID
        name: title,
        description: desc,
        price: price,
        images: images
    };

    let customProducts = JSON.parse(localStorage.getItem('custom_products')) || [];
    customProducts.push(newProduct);
    localStorage.setItem('custom_products', JSON.stringify(customProducts));

    // Reset form and close modal
    document.getElementById("product-form").reset();
    toggleAdminModal();
    
    // Refresh products list
    fetchProducts();
    alert("Product added successfully!");
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
    alert("Checkout successful!");
    cart = [];
    updateCartUI();
    toggleCart();
}

// Initialize
fetchProducts();
