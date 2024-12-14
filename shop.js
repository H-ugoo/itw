const products = [
    { id: 1, name: "Cap Paris 2024", price: 10.99, image: "https://images.footballfanatics.com/the-olympics-team-france-unstructured-cap-navy_ss5_p-200444404+u-kkgnqvdakvqhrogfocgv+v-ch17i4hcyuvbgmxzcz2l.jpg?_hv=2&w=340" },
    { id: 2, name: "T-Shirt France 2024", price: 14.99, image: "https://images.footballfanatics.com/the-olympics-team-france-poly-t-shirt-navy_ss4_p-13365761+u-15nti0vsu7f1hr50dip0+v-88ba5114250d4fdcb7a83d472f0d5a47.jpg?_hv=2&w=340" },
    { id: 3, name: "Polos France 2024", price: 44.99, image: "https://images.footballfanatics.com/paris-2024-olympics-le-coq-sportif-team-france-podium-polo-ecru_ss5_p-200508713+u-50eywvp1wr47c2qykwo5+v-fw1lzjvp0ljtikl7y15g.jpg?_hv=2&w=340" },
    { id: 4, name: "Duvet Set France 2024", price: 23.50, image: "https://images.footballfanatics.com/the-olympics-team-france-flag-single-duvet-set_ss5_p-14417983+u-gkvyammyxfnqykghvuqa+v-6mysxfeq3aw4nxosqayp.jpg?_hv=2&w=340" },
    { id: 5, name: "Bathrobe France 2024", price: 22.50, image: "https://images.footballfanatics.com/paris-2024/paris-2024-olympics-hooded-bathrobe-blue-kids_ss5_p-200350892+u-9ckjueqfn5yo4kpgiiyn+v-cqckdjdhjubmwdruws3r.jpg?_hv=2&w=340" },
    { id: 6, name: "Plush Mascot", price: 9.99, image: "https://images.footballfanatics.com/the-olympics-team-france-plush-mascot-24cm_ss5_p-200352199+u-jrg2xutwjv1znso1b0xl+v-yznalx5z3v9853hudkrg.jpg?_hv=2&w=340" },
    { id: 7, name: "France Bear", price: 13.20, image: "https://images.footballfanatics.com/the-paralympics-team-france-bear-25cm_ss5_p-13397796+u-4eeaastjnftd7lmir1ls+v-tywjmphytu7qnifnqivm.jpg?_hv=2&w=340" },
    { id: 8, name: "Baby Sleepsuit", price: 8.88, image: "https://images.footballfanatics.com/the-olympics-team-france-sleepsuit-blue-baby_ss5_p-200662803+u-v5jpchoauei7ytmqbegx+v-gfpi4fjn92ztzlutdvmo.jpg?_hv=2&w=340" }
];

const productsContainer = document.getElementById("products-container");

products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price.toFixed(2)} €</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsContainer.appendChild(productDiv);
});


const CART_KEY = "shopping_cart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);

    if (product) {
        cart.push(product);
        saveCart(cart);
        updateCartCount();
        alert(`${product.name} adicionado ao carrinho!`);
    }
}
function updateCartCount() {
    const cart = getCart();
    document.getElementById("cart-count").textContent = cart.length;
}
window.onload = function() {
    updateCartCount();
  };
updateCartCount();