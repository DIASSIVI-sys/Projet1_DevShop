"use strict";

// Sélection des éléments du DOM
const produitsGrid = document.getElementById("produit-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search-input");
const cartCountElement = document.getElementById("cart-count");

// Variable globale pour stocker tous les produits récupérés
let allProducts = [];
// Tableau pour stocker les produits du panier
let cart = [];

async function loadProduits() {
    try {
        produitsGrid.innerHTML = "<p>Chargement des produits en cours...</p>";
        
        const response = await fetch('https://fakestoreapi.com/products');

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        
       
        allProducts = await response.json();

        // Afficher tous les produits par défaut au démarrage
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

    // Filtrer les produits avec includes() sur le titre
    const searchedProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );

    // Afficher les produits filtrés
    displayProducts(searchedProducts);
});

// Écouter les clics sur la grille pour intercepter les boutons "Ajouter au panier"
produitsGrid.addEventListener("click", (e) => {
    // Vérifier si l'élément cliqué possède la classe "add-to-cart-btn"
    if (e.target.classList.contains("add-to-cart-btn")) {
        const productId = Number(e.target.getAttribute("data-id"));

        // Trouver le produit correspondant dans notre tableau global allProducts
        const productToAdd = allProducts.find(product => product.id === productId);

        if (productToAdd) {
            // Ajouter le produit au tableau du panier
            cart.push(productToAdd);
            
            // Mettre à jour l'affichage du compteur dans la navbar
            updateCartCount();

            console.log("Panier actuel :", cart);
        }
    }
});

// Fonction pour mettre à jour le compteur du panier
function updateCartCount() {
    cartCountElement.textContent = cart.length;
}
// Lancer le chargement au démarrage
loadProduits();