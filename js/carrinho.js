// Variáveis do carrinho
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const cartIcons = document.querySelectorAll(".cart-compras"); // Ícones do carrinho
const cartCar = document.querySelector(".cart-car"); // Janela do carrinho
const cartCloseButtons = document.querySelectorAll(".close-cart"); // Botões de fechar
const cartBody = document.querySelector(".card-body"); // Área onde os itens aparecem
const totalPriceElement = document.querySelector(".total-price"); // Total do carrinho
const totalSubElement = document.querySelector(".total-sub"); // Subtotal
const cartCounter = document.querySelector(".quantyti-shop"); // Contador de itens no carrinho

// Atualiza o contador do carrinho
function updateCartCount() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.textContent = totalItems;
  // Atualiza outros elementos que exibem a quantidade
  const otherQuantityElements = document.querySelectorAll(".quantyti-shop");
  otherQuantityElements.forEach((element) => {
    element.textContent = totalItems;
  });
}

// Atualiza o total do carrinho
function updateCartTotal() {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  totalSubElement.innerHTML = `<p class="total-sub">R$ ${(total * 1.25).toFixed(2)}</p>`;

  totalPriceElement.textContent = `R$ ${total.toFixed(2)}`;
}

// Renderiza os itens do carrinho
function renderCartItems() {
  cartBody.innerHTML = "";

  if (cartItems.length === 0) {
    cartBody.innerHTML = "<p class='text-center'>Seu carrinho está vazio.</p>";
    return;
  }

  cartItems.forEach((item, index) => {
    const cartItemHTML = `
      <div class="row align-items-center mb-3">
        <div class="col-5">
          <img src="${item.image}" alt="${item.name}" class="img-fluid img-cart-car">
        </div>
        <div class="col-7">
        <h4 class="cart-title-car">${item.name}</h4>
        <span class="text-muted">R$ ${item.price.toFixed(2)}</span>
        </div>
        <div class="row cart-input justify-content-between align-items-center">
          <div class="col-10 col-md-5 btn-quantyti">
            <div class="input-group">
              <button class="btn btn-outline-danger decrement" data-index="${index}">-</button>
              <span class="form-control text-center" id="quantity">${item.quantity}</span>
              <button class="btn btn-outline-secondary increment" data-index="${index}">+</button>
            </div>
          </div>
          <div class="col-2 text-end">
            <i class="fas fa-trash-alt text-danger fa-2x remove" data-index="${index}"></i>
          </div>
        </div>
      </div>
    `;

    cartBody.innerHTML += cartItemHTML;
  });

  // Eventos dos botões de incremento e decremento
  document.querySelectorAll(".increment").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      cartItems[index].quantity++;
      updateCart();
    });
  });

  document.querySelectorAll(".decrement").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
      } else {
        cartItems.splice(index, 1);
      }
      updateCart();
    });
  });

  document.querySelectorAll(".remove").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      cartItems.splice(index, 1);
      updateCart();
    });
  });
}

// Atualiza o carrinho
function updateCart() {
  renderCartItems();
  updateCartTotal();
  updateCartCount();
  saveCart(); // Salva no localStorage após atualizar
}

// Salva o carrinho no localStorage
function saveCart() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Adiciona um item ao carrinho
function addToCart(item) {
  const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }

  updateCart();
}

// Eventos para abrir e fechar o carrinho
cartIcons.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    event.preventDefault();
    cartCar.classList.add("active");
  });
});

cartCloseButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    cartCar.classList.remove("active");
  });
});

// Evento para adicionar item ao carrinho ao clicar em "COMPRAR"
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-card")) {
    const button = event.target;
    const itemId = button.getAttribute("data-id");

    const item = {
      id: itemId,
      name: button.closest(".card-body").querySelector(".card-title")
        .textContent,
      price: parseFloat(
        button
          .closest(".card-body")
          .querySelector(".preco")
          .textContent.replace("R$", "")
          .trim()
      ),
      image: button.closest(".card").querySelector("img").src,
    };

    addToCart(item);
  }
});

// Inicializa o contador do carrinho
updateCartCount();

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

// Carregar os itens do carrinho do localStorage ao iniciar a página
document.addEventListener("DOMContentLoaded", () => {
  // Verifica se há itens no localStorage
  if (cartItems.length > 0) {
    renderCartItems(); // Renderiza os itens do carrinho
    updateCartCount(); // Atualiza o contador de itens no carrinho
    updateCartTotal(); // Atualiza o total do carrinho
  }
});
