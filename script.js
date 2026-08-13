"use strict";
const produitsGrid=document.getElementById("produit-grid");

/**  */
async function loadProduits(){
    try{
        //Afficher un indicateur de chargement 
        produitsGrid.innerHTML=" <p>Chargement des produits en cours </p>";
        
        const response = await fetch('https://fakestoreapi.com/products');

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const products = await response.json();

        // Vider le conteneur avant d'afficher
       produitsGrid.innerHTML = "";

        // 3. Boucler sur chaque produit pour créer sa carte HTML
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 180px; object-fit: contain; margin-bottom: 1rem;">
                <span style="font-size: 0.8rem; color: #666; text-transform: uppercase;">${product.category}</span>
                <h3 style="font-size: 1rem; margin: 0.5rem 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.title}</h3>
                <p style="font-weight: bold; color: #333; margin-bottom: 1rem;">${product.price} $</p>
                <button class="add-to-cart-btn" data-id="${product.id}" style="padding: 0.5px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Ajouter au panier</button>
            `;
            // Injecter la carte dans la grille
            produitsGrid.appendChild(productCard);
        });

        } catch (error) {
        // Gestion des erreurs (Try/Catch)
        console.error("Erreur lors du chargement :", error);
        produitsGrid.innerHTML = `<p style="color: red;">Impossible de charger les produits. Veuillez réessayer plus tard.</p>`;
    }

    }
    // Lancer le chargement au démarrage
    loadProduits();


