// Render Products with Image Slider Support & Fallback
function renderProducts() {
    const grid = document.getElementById("product-grid");
    if (products.length === 0) {
        grid.innerHTML = "<p>No products available.</p>";
        return;
    }
    
    grid.innerHTML = products.map((product, pIndex) => {
        // Handle images array safely
        let images = product.images;
        
        if (!images || (Array.isArray(images) && images.length === 0)) {
            images = ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"];
        } else if (typeof images === 'string') {
            images = images.split(',').map(img => img.trim()).filter(img => img.length > 0);
        }

        const imageHTML = images.map((img, i) => `
            <img src="${img}" class="${i === 0 ? 'active' : ''}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'">
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
