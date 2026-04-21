// --- NEW: Dynamic Cart Key Helper ---
function getCartKey() {
    let currentUser = localStorage.getItem('currentUser');
    // If they are logged in, use their specific email as the cart name.
    // If they are a guest, use a temporary 'guestCart'.
    return currentUser ? 'cart_' + currentUser : 'guestCart';
}

// This function runs automatically when the page loads
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

// 1. Function to update the number shown in the navigation bar
function updateCartCount() {
    let cartCountSpan = document.getElementById('cart-count');
    if (!cartCountSpan) return; 

    let currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        cartCountSpan.innerText = "0";
        return;
    }

    let currentCartKey = getCartKey(); 
    let cart = JSON.parse(localStorage.getItem(currentCartKey)) || [];
    
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.qty;
    });

    cartCountSpan.innerText = totalItems;
}

// --- AUTHENTICATION LOGIC ---

// Form Toggling Elements
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');

// Toggle to show Sign Up
if (showSignupBtn) {
    showSignupBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Stop page from jumping to top
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });
}

// Toggle to show Login
if (showLoginBtn) {
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
}

// 1. Handle Sign Up
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        let email = document.getElementById('signup-email').value;
        let password = document.getElementById('signup-password').value;
        
        let users = JSON.parse(localStorage.getItem('usersDB')) || [];
        
        let userExists = users.some(user => user.email === email);
        if (userExists) {
            alert("An account with this email already exists!");
            return;
        }
        
        // Save new user to the "database"
        users.push({ email: email, password: password });
        localStorage.setItem('usersDB', JSON.stringify(users));
        
        // AUTO-LOGIN: Set them as the current user immediately
        localStorage.setItem('currentUser', email);
        
        alert("Account created! You are now automatically logged in.");
        window.location.href = "index.html"; // Redirect to home page
    });
}

// 2. Handle Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let email = document.getElementById('login-email').value;
        let password = document.getElementById('login-password').value;
        
        let users = JSON.parse(localStorage.getItem('usersDB')) || [];
        
        let validUser = users.find(user => user.email === email && user.password === password);
        
        if (validUser) {
            localStorage.setItem('currentUser', validUser.email);
            alert("Welcome back, " + validUser.email + "!");
            window.location.href = "index.html"; 
        } else {
            alert("Incorrect email or password.");
        }
    });
}

// 3. Update Navigation Bar if Logged In
document.addEventListener("DOMContentLoaded", () => {
    let currentUser = localStorage.getItem('currentUser');
    let loginNavBtn = document.getElementById('nav-login-btn');
    
    if (currentUser && loginNavBtn) {
        loginNavBtn.innerText = "Logout";
        loginNavBtn.href = "#"; 
        
        loginNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // ONLY delete the current user session. 
            // Do NOT delete the cart data, so it waits for them when they return!
            localStorage.removeItem('currentUser'); 
            
            alert("You have been logged out.");
            window.location.reload(); 
        });
    }
});

// --- BUILDER PAGE LOGIC ---
const layoutSelect = document.getElementById('layout-select');
const switchSelect = document.getElementById('switch-select');
const totalPriceDisplay = document.getElementById('total-price');
const addToCartBtn = document.getElementById('add-to-cart-btn');

// Interactive Keyboard Elements
const keyboardContainer = document.getElementById('visual-keyboard');
const styleSelect = document.getElementById('keycap-style-select');
const customColorInput = document.getElementById('custom-key-color');
const colorInputsContainer = document.getElementById('color-inputs');
const color1Input = document.getElementById('custom-color-1');
const color2Input = document.getElementById('custom-color-2');
const applyStyleBtn = document.getElementById('apply-style-btn');
const selectAllBtn = document.getElementById('select-all-btn');

// Define the layouts mapping to the dropdown values
const keyboardLayouts = {
    "400": [ // 65% Layout
        ['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Bksp', 'Del'],
        ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\', 'PgUp'],
        ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter', 'PgDn'],
        ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', '↑', 'End'],
        ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl', '←', '↓', '→']
    ],
    "500": [ // 75% Layout
        ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'Del'],
        ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Bksp', 'Home'],
        ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\', 'PgUp'],
        ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter', 'PgDn'],
        ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', '↑', 'End'],
        ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl', '←', '↓', '→']
    ],
    "600": [ // 100% Layout (Now with structural gaps!)
        ['Esc', '_half_', 'F1', 'F2', 'F3', 'F4', '_half_', 'F5', 'F6', 'F7', 'F8', '_half_', 'F9', 'F10', 'F11', 'F12', '_', 'Prt', 'Scr', 'Pau', '_', 'Num', '/', '*', '-'],
        ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Bksp', '_', 'Ins', 'Home', 'PgUp', '_', '7', '8', '9', '+'],
        ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\', '_', 'Del', 'End', 'PgDn', '_', '4', '5', '6', '+'],
        ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter', '_', '_', '_', '_', '_', '1', '2', '3', ''],
        ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', '_', '↑', '_', '_', '1', '2', '3', ''],
        ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Menu', 'Ctrl', '_', '_', '_','_','_', '←', '↓', '→', '_', 'N0', '.', '']
    ]
};

let allKeysData = []; // Array to store the math/style of every individual key

// 1. Build the Interactive Keyboard (Dynamic Function)
function renderKeyboard(layoutValue) {
    if (!keyboardContainer) return;
    
    // Clear the existing board and data
    keyboardContainer.innerHTML = ''; 
    allKeysData = []; 
    
    let currentLayout = keyboardLayouts[layoutValue] || keyboardLayouts["400"];
    
    currentLayout.forEach(row => {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        row.forEach(keyLabel => {
            // NEW: Intercept the spacers and render empty divs instead of clickable keys
            if (keyLabel === '_' || keyLabel === '_half_') {
                let spacerDiv = document.createElement('div');
                spacerDiv.className = keyLabel === '_' ? 'key-spacer' : 'key-spacer half';
                rowDiv.appendChild(spacerDiv);
                return; // Stop here, don't add this "blank space" to the shopping cart data
            }

            let keyDiv = document.createElement('div');
            keyDiv.className = 'key';
            
            // NEW: Handle the double-wide Numpad 0 specifically
            if (keyLabel === 'N0') {
                keyDiv.innerText = '0';
                keyDiv.classList.add('key-numpad-zero');
            } else {
                keyDiv.innerText = keyLabel;
            }
            
            // Add custom width classes for wide keys
            if(keyLabel === 'Space') keyDiv.classList.add('key-space');
            if(['Shift', 'Enter', 'Caps', 'Tab', 'Bksp', 'Ent', '+'].includes(keyLabel)) keyDiv.classList.add('key-shift');
            
            let keyData = { 
                label: keyLabel === 'N0' ? '0' : keyLabel, 
                price: 1, 
                styleName: 'Midnight Black ABS' 
            };
            
            allKeysData.push({ element: keyDiv, data: keyData });

            keyDiv.addEventListener('click', () => {
                keyDiv.classList.toggle('selected');
            });
            
            rowDiv.appendChild(keyDiv);
        });
        keyboardContainer.appendChild(rowDiv);
    });

    // Re-calculate the price because the number of keys just changed
    updateLivePrice();
}

// 2. Add to Cart Logic (Builder Page)
if(addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
        let layoutName = layoutSelect.options[layoutSelect.selectedIndex].getAttribute('data-name');
        let switchName = switchSelect.options[switchSelect.selectedIndex].getAttribute('data-name');
        
        let totalKeycapPrice = 0;
        let uniqueStyles = new Set(); 
        
        allKeysData.forEach(k => {
            totalKeycapPrice += k.data.price;
            uniqueStyles.add(k.data.styleName);
        });

        let finalPrice = parseInt(layoutSelect.value) + parseInt(switchSelect.value) + totalKeycapPrice;
        let stylesSummary = Array.from(uniqueStyles).join(', ');
        let buildDescription = `${layoutName} with ${switchName} switches. Custom Keycaps featuring: [${stylesSummary}].`;
        
        // --- UPDATED DYNAMIC CART CALL ---
        let currentCartKey = getCartKey(); 
        let cart = JSON.parse(localStorage.getItem(currentCartKey)) || [];
        
        let existingItemIndex = cart.findIndex(item => item.desc === buildDescription);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].qty += 1;
        } else {
            cart.push({ 
                name: "Fully Custom Keyboard Build", 
                desc: buildDescription,
                price: finalPrice, 
                qty: 1 
            });
        }
        
        localStorage.setItem(currentCartKey, JSON.stringify(cart));
        updateCartCount(); 
        alert("Custom Build Added to Cart!");
    });
}

// 3. Apply Style to Selected Keys
// Handle Select All Button
if (selectAllBtn) {
    selectAllBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Stop the page from jumping to the top
        
        // Loop through all currently rendered keys and apply the green highlight
        allKeysData.forEach(k => {
            k.element.classList.add('selected');
        });
    });
}

if (applyStyleBtn) {
    applyStyleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        let pricePerKey = parseInt(styleSelect.value);
        let styleName = styleSelect.options[styleSelect.selectedIndex].getAttribute('data-name');
        
        let backgroundStyle = '#2a2a2a'; // Default dark
        let textColor = '#fff'; // Default text color

        // Determine background and text color based on selection
        if (styleName === 'Custom Solid Color') {
            backgroundStyle = color1Input.value;
            styleName = `Custom Solid (${backgroundStyle})`;
            textColor = '#fff'; // Keep white for custom
        } else if (styleName === 'Custom Gradient Color') {
            let c1 = color1Input.value;
            let c2 = color2Input.value;
            // Use linear-gradient for the background
            backgroundStyle = `linear-gradient(135deg, ${c1}, ${c2})`;
            styleName = `Custom Gradient (${c1} to ${c2})`;
            textColor = '#fff'; 
        } else {
            // Visual feedback for designer presets
            if(styleName.includes('White') || styleName.includes('Ceramic')) {
                backgroundStyle = '#f0f0f0';
                textColor = '#000';
            }
            if(styleName.includes('Matcha')) {
                backgroundStyle = '#c1dcb1';
                textColor = '#000';
            }
            if(styleName.includes('Blue')) backgroundStyle = '#2c3e50';
            if(styleName.includes('Neon')) backgroundStyle = '#ff00ff';
        }

        // Apply to all keys that currently have the 'selected' class
        allKeysData.forEach(k => {
            if (k.element.classList.contains('selected')) {
                // IMPORTANT: Use .background instead of .backgroundColor to support gradients
                k.element.style.background = backgroundStyle;
                k.element.style.color = textColor; 
                
                // Update the hidden math data
                k.data.price = pricePerKey;
                k.data.styleName = styleName;
                
                // Deselect it after applying
                k.element.classList.remove('selected');
            }
        });
        
        updateLivePrice();
    });
}

// 4. Calculate Final Price
function updateLivePrice() {
    if(!layoutSelect) return; 
    
    let layoutPrice = parseInt(layoutSelect.value);
    let switchPrice = parseInt(switchSelect.value);
    
    // Sum up the individual price of all 61 keys
    let totalKeycapPrice = 0;
    allKeysData.forEach(k => {
        totalKeycapPrice += k.data.price;
    });
    
    let total = layoutPrice + switchPrice + totalKeycapPrice;
    totalPriceDisplay.innerText = "RM " + total;
}

// 6. Handle URL Parameters from Explore Page and Initial Load
const urlParams = new URLSearchParams(window.location.search);

if (layoutSelect && switchSelect) {
    // When the user manually changes the base layout, redraw the board!
    layoutSelect.addEventListener('change', (e) => {
        renderKeyboard(e.target.value);
    });
    switchSelect.addEventListener('change', updateLivePrice);

    // Check if the user came from the Explore page with preset options
    if (urlParams.has('layout') || urlParams.has('switch') || urlParams.has('design')) {
        
        // 1. Read the layout from the URL and draw the board immediately
        if (urlParams.has('layout')) {
            layoutSelect.value = urlParams.get('layout');
        }
        renderKeyboard(layoutSelect.value);
        
        // 2. Set the switches
        if (urlParams.has('switch')) switchSelect.value = urlParams.get('switch');
        
        // 3. Handle the Keycaps using the EXACT name
        if (urlParams.has('design') && styleSelect) {
            let designName = urlParams.get('design');
            
            // Loop through the dropdown to find the perfect match
            for (let i = 0; i < styleSelect.options.length; i++) {
                if (styleSelect.options[i].getAttribute('data-name') === designName) {
                    styleSelect.selectedIndex = i;
                    break;
                }
            }

            // Special setup if it's the Gradient demo
            if (designName === 'Custom Gradient Color') {
                if (colorInputsContainer) colorInputsContainer.style.display = 'flex';
                if (color2Input) color2Input.style.display = 'block';
                color1Input.value = urlParams.get('c1');
                color2Input.value = urlParams.get('c2');
            }

            // Now that the dropdown is correctly set, programmatically paint the board
            setTimeout(() => {
                if (selectAllBtn && applyStyleBtn) {
                    selectAllBtn.click();
                    applyStyleBtn.click();
                }
            }, 100); 
        }
    } else {
        // If no URL parameters (user navigated here normally), draw default board
        renderKeyboard(layoutSelect.value); 
    }
}

// --- CART PAGE LOGIC ---
const cartContainer = document.getElementById('cart-items-container');
const cartSummary = document.getElementById('cart-summary');
const cartSubtotal = document.getElementById('cart-subtotal');

// 3. Render Cart
function renderCart() {
    if(!cartContainer) return; 
    
    let currentCartKey = getCartKey(); 
    let cart = JSON.parse(localStorage.getItem(currentCartKey)) || [];
    
    cartContainer.innerHTML = "";
    
    if(cart.length === 0) {
        cartContainer.innerHTML = `
            <p>Your cart is empty.</p>
            <p style="margin-top: 10px;">
                Head to the <a href="builder.html" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Builder</a> to create your perfect keyboard, 
                or go <a href="explore.html" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Explore</a> our curated collections!
            </p>
        `;
        cartSummary.style.display = "none";
        return;
    }
    
    let totalRM = 0;
    cartSummary.style.display = "block";
    
    cart.forEach((item, index) => {
        let rowTotal = item.price * item.qty; 
        totalRM += rowTotal; 
        
        let itemHTML = `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.desc || "Standard Item"}</p>
                    <p>Qty: ${item.qty} x RM ${item.price} = <strong style="color:#fff;">RM ${rowTotal}</strong></p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartContainer.innerHTML += itemHTML;
    });
    
    cartSubtotal.innerText = "RM " + totalRM;
}

// 4. Remove From Cart
window.removeFromCart = function(index) {
    let currentCartKey = getCartKey(); 
    let cart = JSON.parse(localStorage.getItem(currentCartKey)) || [];
    
    cart.splice(index, 1); 
    
    localStorage.setItem(currentCartKey, JSON.stringify(cart));
    updateCartCount(); 
    renderCart(); 
}

// Run render cart if on cart page
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

// --- CHECKOUT PAGE LOGIC ---
const checkoutForm = document.getElementById('checkout-form');
const checkoutItemsContainer = document.getElementById('checkout-items-container');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutGrandTotal = document.getElementById('checkout-grand-total');

// 5A. Render Checkout Summary
function renderCheckoutSummary() {
    if(!checkoutItemsContainer) return; 
    
    let currentCartKey = getCartKey(); 
    let cart = JSON.parse(localStorage.getItem(currentCartKey)) || [];
    
    if(cart.length === 0) {
        checkoutItemsContainer.innerHTML = "<p style='color: #ff4444;'>Your cart is empty.</p>";
        checkoutSubtotal.innerText = "RM 0";
        checkoutGrandTotal.innerText = "RM 0";
        return;
    }
    
    checkoutItemsContainer.innerHTML = "";
    let totalRM = 0;
    
    cart.forEach(item => {
        let rowTotal = item.price * item.qty;
        totalRM += rowTotal;
        
        checkoutItemsContainer.innerHTML += `
            <div class="checkout-mini-item">
                <span>${item.qty}x ${item.name}</span>
                <span>RM ${rowTotal}</span>
            </div>
        `;
    });
    
    checkoutSubtotal.innerText = "RM " + totalRM;
    checkoutGrandTotal.innerText = "RM " + totalRM;
}

if(checkoutItemsContainer) {
    renderCheckoutSummary();
}

// 5B. Handle Fake Purchase Submission
if(checkoutForm) {
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        let currentCartKey = getCartKey(); 
        let cart = JSON.parse(localStorage.getItem(currentCartKey)) || [];
        
        if (cart.length === 0) {
            alert("Your cart is empty! Please add items before checking out.");
            window.location.href = "explore.html";
            return;
        }

        alert("🎉 SUCCESSFUL PURCHASE!\n\nDISCLAIMER: This website is a prototype developed for educational purposes only. No actual transaction has occurred, no money was charged, and no products will be shipped.");
        
        // Empty only THIS specific user's cart
        localStorage.removeItem(currentCartKey);
        
        window.location.href = "index.html";
    });
}

// --- PAGE PROTECTION & ROUTING LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    let currentUser = localStorage.getItem('currentUser');
    
    // Get the current page filename (works for both local files and live servers)
    let pathArray = window.location.pathname.split('/');
    let currentPage = pathArray[pathArray.length - 1];

    // 1. Protect Builder, Cart, and Checkout pages from direct access
    // (If they are not logged in AND they are on one of these pages)
    if (!currentUser && (currentPage === 'builder.html' || currentPage === 'cart.html' || currentPage === 'checkout.html')) {
        alert("Access Denied: Please log in or create an account to view this page.");
        window.location.href = "login.html"; // Redirect to login
    }

    // 2. Protect "Customize This Build" buttons specifically on the Explore page
    if (currentPage === 'explore.html') {
        const customizeButtons = document.querySelectorAll('.explore-card .btn-primary');
        
        customizeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                // If they are not logged in when they click the button
                if (!currentUser) {
                    event.preventDefault(); // Stop the link from taking them to the builder
                    alert("Please log in to customize");
                    window.location.href = "login.html"; // Send to login instead
                }
            });
        });
    }
});
