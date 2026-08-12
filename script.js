"use strict";
const produitsGrid=document.getElementById("produit-grid");

/**  */
async function loadProduits(){
    try{
        //Afficher un indicateur de chargement 
        produitsGrid.innerHTML=" <p>Chargement des produits en cours </p>";
        
        const response = byIdOrFetch = await fetch('https://fakestoreapi.com/products');

    }

}