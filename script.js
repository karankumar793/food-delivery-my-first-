// Sample restaurant data
const restaurants = [
    {
        id: 1,
        name: "Pizza Paradise",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1350&q=80",
        rating: 4.5,
        category: "pizza",
        menu: [
            { id: 1, name: "Margherita Pizza", price: 12.99, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1350&q=80" },
            { id: 2, name: "Pepperoni Pizza", price: 14.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1350&q=80" },
        ]
    },
    {
        id: 2,
        name: "Burger Boss",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1350&q=80",
        rating: 4.2,
        category: "burger",
        menu: [
            { id: 3, name: "Classic Burger", price: 9.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1350&q=80" },
            { id: 4, name: "Cheese Burger", price: 10.99, image: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1350&q=80" },
        ]
    },
    {
        id: 3,
        name: "Sushi Master",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1350&q=80",
        rating: 4.8,
        category: "sushi",
        menu: [
            { id: 5, name: "California Roll", price: 15.99, image: "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?auto=format&fit=crop&w=1350&q=80" },
            { id: 6, name: "Salmon Nigiri", price: 16.99, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1350&q=80" },
        ]
    }
];

// Cart state
let cart = [];

// DOM Elements
const restaurantGrid = document.getElementById('restaurantGrid');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.querySelector('.close-modal');
const overlay = document.getElementById('overlay');
const checkoutForm = document.getElementById('checkoutForm');
const searchInput = document.getElementById('searchInput');
const categoryItems = document.querySelectorAll('.category-item');

// Display restaurants
function displayRestaurants(filteredRestaurants = restaurants) {
    restaurantGrid.innerHTML = filteredRestaurants.map(restaurant => `
        <div class="restaurant-card" data-category="${restaurant.category}">
            <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <div class="rating">
                    ${"★".repeat(Math.floor(restaurant.rating))}${restaurant.rating % 1 >= 0.5 ? "½" : ""}
                    ${restaurant.rating}
                </div>
                <div class="menu">
                    ${restaurant.menu.map(item => `
                        <div class="menu-item">
                            <h4>${item.name}</h4>
                            <p>$${item.price}</p>
                            <button onclick="addToCart(${restaurant.id}, ${item.id})">Add to Cart</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(restaurantId, itemId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const item = restaurant.menu.find(i => i.id === itemId);
    
    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
    updateCartCount();
    showCart();
}

// Update cart display
function updateCart() {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== itemId);
    } else {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    
    updateCart();
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Show/hide cart
function showCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function hideCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Show/hide checkout modal
function showCheckoutModal() {
    checkoutModal.classList.add('active');
    overlay.classList.add('active');
}

function hideCheckoutModal() {
    checkoutModal.classList.remove('active');
    overlay.classList.remove('active');
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.menu.some(item => item.name.toLowerCase().includes(searchTerm))
    );
    displayRestaurants(filteredRestaurants);
});

// Category filter
categoryItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.dataset.category;
        const filteredRestaurants = category === 'all' 
            ? restaurants 
            : restaurants.filter(restaurant => restaurant.category === category);
        displayRestaurants(filteredRestaurants);
    });
});

// Event listeners
cartIcon.addEventListener('click', showCart);
closeCart.addEventListener('click', hideCart);
overlay.addEventListener('click', () => {
    hideCart();
    hideCheckoutModal();
});
checkoutBtn.addEventListener('click', showCheckoutModal);
closeModal.addEventListener('click', hideCheckoutModal);

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically send the order to a backend server
    alert('Order placed successfully! Thank you for your order.');
    cart = [];
    updateCart();
    updateCartCount();
    hideCheckoutModal();
    hideCart();
});

// Initialize
displayRestaurants();
updateCartCount();
