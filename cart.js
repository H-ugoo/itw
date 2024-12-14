const CART_KEY = "shopping_cart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function groupCartItems(cart) {
    const grouped = {};

    cart.forEach(item => {
        if (grouped[item.name]) {
            grouped[item.name].quantity += 1;
            grouped[item.name].totalPrice += item.price;
        } else {
            grouped[item.name] = { 
                ...item, 
                quantity: 1, 
                totalPrice: item.price 
            };
        }
    });

    return Object.values(grouped);
}

function renderCart() {
    const cart = getCart();
    const groupedCart = groupCartItems(cart); 
    const cartContainer = document.getElementById("cart-container");

    if (groupedCart.length === 0) {
        cartContainer.innerHTML = "<div style='text-align: center; margin-top:50px;margin-bottom:50px'><p>Your cart is empty.</p></div>";
        return;
    }

    cartContainer.innerHTML = `
    <div style="margin: 50px auto; max-width: 80%; text-align: center;">
        <table class="table table-striped table-bordered table-hover align-middle">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Quantity</th>
                    <th scope="col">Product</th>
                    <th scope="col">Image</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>
            <tbody>
                ${groupedCart.map((item, index) => `
                    <tr>
                        <td>${item.quantity}</td>
                        <td>${item.name}</td>
                        <td>
                            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border: 1px solid #ddd; border-radius: 8px;">
                        </td>
                        <td>$${item.totalPrice.toFixed(2)}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.name}')">
                                <i class="fa fa-trash"></i> Remove
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    </div>
`;
    const totalPrice = groupedCart.reduce((total, item) => total + item.totalPrice, 0);

    cartContainer.innerHTML += `
        <div style="text-align: center;">
            <h4>Total: $${totalPrice.toFixed(2)}</h4>
        </div>
    `;
}
function removeFromCart(name) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.name === name);

    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
    }

    saveCart(cart);
    renderCart();
}

renderCart();
