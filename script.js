"use strict";

// Sélection des éléments du DOM
const produitsGrid = document.getElementById("produit-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search-input");
const cartCountElement = document.getElementById("cart-count");

// Sélection des éléments du tiroir panier
const cartIcon = document.querySelector(".cart-icon");
const cartDrawer = document.getElementById("cart-drawer");
const drawerOverlay = document.getElementById("drawer-overlay");
const closeDrawerBtn = document.getElementById("close-drawer");
const drawerItemsContainer = document.getElementById("drawer-items");
const drawerTotalElement = document.getElementById("drawer-total");

// Variable globale pour stocker tous les produits récupérés
let allProducts = [];

// Tableau pour stocker les produits du panier (chargé depuis le localStorage si existant)
let cart = JSON.parse(localStorage.getItem("devshop_cart")) || [];

async function loadProduits() {
    try {
        produitsGrid.innerHTML = "<p>Chargement des produits en cours...</p>";
        
        const response = await fetch('https://fakestoreapi.com/products');

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        
        allProducts = await response.json();
        displayProducts(allProducts);

    } catch (error) {
        console.error("Erreur lors du chargement :", error);
        produitsGrid.innerHTML = `<p style="color: red;">Impossible de charger les produits. Veuillez réessayer plus tard.</p>`;
    }
}

function displayProducts(productsToDisplay) {
    produitsGrid.innerHTML = "";

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 180px; object-fit: contain; margin-bottom: 1rem;">
            <span style="font-size: 0.8rem; color: #666; text-transform: uppercase;">${product.category}</span>
            <h3 style="font-size: 1rem; margin: 0.5rem 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.title}</h3>
            <p style="font-weight: bold; color: #333; margin-bottom: 1rem;">${product.price} $</p>
            <button class="add-to-cart-btn" data-id="${product.id}" style="padding: 0.5rem; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Ajouter au panier</button>
        `;
        
        produitsGrid.appendChild(productCard);
    });
}

// Gestion des événements de clic sur les boutons de filtre
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.getAttribute('data-category');

        if (category === 'all') {
            displayProducts(allProducts);
        } else {
            const filteredProducts = allProducts.filter(product => product.category === category);
            displayProducts(filteredProducts);
        }
    });
});

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const searchedProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(searchedProducts);
});

// Écouter les clics sur la grille pour intercepter les boutons "Ajouter au panier"
produitsGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
        const productId = Number(e.target.getAttribute("data-id"));
        const productToAdd = allProducts.find(product => product.id === productId);

        if (productToAdd) {
            const existingItem = cart.find(item => item.product.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ product: productToAdd, quantity: 1 });
            }
            
            saveAndToolkit();
        }
    }
});

// Ouvrir le tiroir au clic sur l'icône du panier
cartIcon.addEventListener("click", () => {
    cartDrawer.classList.add("open");
    drawerOverlay.classList.add("open");
    displayCartItems();
});

// Fermer le tiroir
function closeDrawer() {
    cartDrawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
}

closeDrawerBtn.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

// Fonction pour afficher les articles dans le tiroir et calculer le total
function displayCartItems() {
    drawerItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        drawerItemsContainer.innerHTML = "<p style='text-align: center; color: #666; margin-top: 2rem;'>Votre panier est vide.</p>";
        drawerTotalElement.textContent = "0.00";
        return;
    }

    let total = 0;

    cart.forEach((cartItem, index) => {
        const itemTotal = cartItem.product.price * cartItem.quantity;
        total += itemTotal;

        const cartItemCard = document.createElement("div");
        cartItemCard.style.display = "flex";
        cartItemCard.style.alignItems = "center";
        cartItemCard.style.justifyContent = "space-between";
        cartItemCard.style.marginBottom = "1rem";
        cartItemCard.style.paddingBottom = "1rem";
        cartItemCard.style.borderBottom = "1px solid #eee";

        cartItemCard.innerHTML = `
            <img src="${cartItem.product.image}" alt="${cartItem.product.title}" style="width: 45px; height: 45px; object-fit: contain;">
            <div style="flex: 1; margin: 0 0.8rem;">
                <h4 style="font-size: 0.85rem; margin: 0; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${cartItem.product.title}</h4>
                <!-- Prix, Input quantité et Croix alignés sur la même ligne -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.4rem;">
                    <span style="font-size: 0.8rem; color: #666; font-weight: bold;">${cartItem.product.price} $</span>
                    <input type="number" class="quantity-input" data-index="${index}" value="${cartItem.quantity}" min="1" style="width: 45px; padding: 2px 4px; font-size: 0.85rem; text-align: center;">
                    <button class="remove-item-btn" data-index="${index}" style="background: none; border: none; color: red; cursor: pointer; font-size: 1.2rem; padding: 0;" title="Supprimer">&times;</button>
                </div>
            </div>
        `;

        drawerItemsContainer.appendChild(cartItemCard);
    });

    drawerTotalElement.textContent = total.toFixed(2);
}

// Gérer la suppression et la modification de quantité dans le tiroir
drawerItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item-btn")) {
        const index = Number(e.target.getAttribute("data-index"));
        cart.splice(index, 1);

        saveAndToolkit();
        displayCartItems();
    }
});

drawerItemsContainer.addEventListener("change", (e) => {
    if (e.target.classList.contains("quantity-input")) {
        const index = Number(e.target.getAttribute("data-index"));
        const newQuantity = parseInt(e.target.value);

        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
        } else {
            cart.splice(index, 1);
        }

        saveAndToolkit();
        displayCartItems();
    }
});

// Sauvegarder dans localStorage et actualiser le compteur global
function saveAndToolkit() {
    localStorage.setItem("devshop_cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalCount;
}

// Initialiser le compteur au chargement
updateCartCount();

// Lancer le chargement au démarrage
loadProduits();