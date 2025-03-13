// Recupera os itens do carrinho do localStorage ao carregar a página
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Seleciona elementos do carrinho
const cartCar = document.querySelector(".cart-car"); // Janela do carrinho
const cartIcons = document.querySelectorAll(".cart-compras"); // Ícones que abrem o carrinho
const cartCloseButtons = document.querySelectorAll(".close-cart"); // Botões que fecham o carrinho
const quantityElement = document.getElementById("quantyti");

// Atualiza a contagem de itens no carrinho ao carregar a página
updateCartCount();
updateCartDisplay();

// 🔹 Adiciona eventos para abrir o carrinho
cartIcons.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    event.preventDefault();
    cartCar.classList.add("active"); // Adiciona classe 'active' para exibir o carrinho
  });
});

// 🔹 Adiciona eventos para fechar o carrinho
cartCloseButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    cartCar.classList.remove("active"); // Remove classe 'active' para esconder o carrinho
  });
});

// Adiciona um item ao carrinho
function addToCart(item) {
  const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  updateCartDisplay();
}

// Salva o carrinho no localStorage
function saveCart() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Atualiza a contagem total no ícone do carrinho
function updateCartCount() {
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  quantityElement.textContent = totalQuantity;
}

// Atualiza a exibição do carrinho
function updateCartDisplay() {
  const cartContainer = document.querySelector(".cart-car .card-body");
  cartContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p class='text-center'>Carrinho vazio!</p>";
    return;
  }

  cartItems.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("row", "align-items-center", "mb-3");

    cartItemElement.innerHTML = `
      <div class="col-5">
        <img src="${item.image}" alt="${item.name}" class="img-fluid img-cart-car">
      </div>
      <div class="col-7">
        <h3 class="cart-title-car">${item.name}</h3>
        <span class="text-muted">R$ ${item.price.toFixed(2)}</span>
      </div>
      <div class="row cart-input justify-content-between align-items-center">
        <div class="col-10 col-md-5 btn-quantyti">
          <div class="input-group">
            <button class="btn btn-outline-danger decrement" data-id="${item.id}">-</button>
            <span class="form-control text-center quantity" data-id="${item.id}">${item.quantity}</span>
            <button class="btn btn-outline-secondary increment" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="col-2 text-end">
          <i class="fas fa-trash-alt text-danger fa-2x remove-item" data-id="${item.id}"></i>
        </div>
      </div>
    `;

    cartContainer.appendChild(cartItemElement);
  });

  addCartEventListeners();
}

// Atualiza todas as quantidades no carrinho
function updateAllQuantities() {
  document.querySelectorAll(".quantity").forEach((element) => {
    const itemId = element.getAttribute("data-id");
    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (item) {
      element.textContent = item.quantity;
    }
  });

  updateCartCount();
}

// Adiciona eventos para incrementar, decrementar e remover itens
function addCartEventListeners() {
  document.querySelectorAll(".increment").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      const item = cartItems.find((cartItem) => cartItem.id === itemId);
      if (item) {
        item.quantity += 1;
        saveCart();
        updateAllQuantities();
        updateCartDisplay();
      }
    });
  });

  document.querySelectorAll(".decrement").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      const item = cartItems.find((cartItem) => cartItem.id === itemId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cartItems = cartItems.filter((cartItem) => cartItem.id !== itemId);
      }
      saveCart();
      updateAllQuantities();
      updateCartDisplay();
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      cartItems = cartItems.filter((cartItem) => cartItem.id !== itemId);
      saveCart();
      updateAllQuantities();
      updateCartDisplay();
    });
  });
}

// Evento para adicionar ao carrinho pelo modal
document
  .querySelector(".modal-buy .add-cart")
  .addEventListener("click", (event) => {
    const button = event.target;
    const itemId = button.getAttribute("data-id");

    const item = {
      id: itemId,
      name: document.getElementById("modalTitle").textContent,
      price: parseFloat(document.getElementById("modalPrice").textContent),
      image: document.getElementById("modalImage").src,
    };

    addToCart(item);
    updateAllQuantities();
  });

// Evento para adicionar ao carrinho pelos botões "COMPRAR" da lista de produtos
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-card")) {
    const button = event.target;
    const itemId = button.getAttribute("data-id");

    const itemElement = button.closest(".card-body");
    const item = {
      id: itemId,
      name: itemElement.querySelector(".card-title").textContent,
      price: parseFloat(
        itemElement.querySelector(".preco").textContent.replace("R$ ", "")
      ),
      image: itemElement.closest(".card").querySelector(".card-img-top").src,
    };

    addToCart(item);
    updateAllQuantities();
  }
});
