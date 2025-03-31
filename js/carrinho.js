// Função para formatar preços no padrão brasileiro (R$ 19,99)
function formatPrice(price) {
  return parseFloat(price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Variáveis do carrinho
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const cartIcons = document.querySelectorAll(".cart-compras");
const cartCar = document.querySelector(".cart-car");
const cartCloseButtons = document.querySelectorAll(".close-cart");
const cartBody = document.querySelector(".card-body");
const totalPriceElement = document.querySelector(".total-price");
const totalSubElement = document.querySelector(".total-sub");
const cartCounter = document.querySelector(".quantyti-shop");

// Container de alertas
const alertContainer = document.createElement("div");
alertContainer.id = "alertContainer";
alertContainer.style.position = "fixed";
alertContainer.style.top = "10px";
alertContainer.style.left = "50%";
alertContainer.style.transform = "translateX(-50%)";
alertContainer.style.zIndex = "1100";
alertContainer.style.width = "90%";
alertContainer.style.maxWidth = "500px";
document.body.prepend(alertContainer);

const showAlert = (message, type) => {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show text-center`;
  alertDiv.setAttribute("role", "alert");
  alertDiv.style.borderRadius = "5px";
  alertDiv.style.padding = "15px";
  alertDiv.style.fontWeight = "bold";
  alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.classList.remove("show");
    alertDiv.classList.add("fade");
    setTimeout(() => {
      alertDiv.remove();
    }, 150);
  }, 3000);
};

function updateCartCount() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCounter) {
    cartCounter.textContent = totalItems;
  }

  const otherQuantityElements = document.querySelectorAll(".quantyti-shop");
  otherQuantityElements.forEach((element) => {
    if (element) {
      element.textContent = totalItems;
    }
  });
}

function updateCartTotal() {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  totalSubElement.innerHTML = `<p class="total-sub">${formatPrice(total * 1.25)}</p>`;
  totalPriceElement.textContent = formatPrice(total);
}

function renderCartItems() {
  cartBody.innerHTML = "";
  if (cartItems.length === 0) {
    cartBody.innerHTML = "<p class='text-center'>Seu carrinho está vazio.</p>";
    showAlert("Seu carrinho está vazio.", "info");
    return;
  }

  cartItems.forEach((item, index) => {
    const cartItemHTML = `
      <div class="row align-items-center mb-3 item__carrinho">
        <div class="col-5">
          <img src="${item.image}" alt="${item.name}" class="img-fluid img-cart-car">
        </div>
        <div class="col-7">
          <h4 class="cart-title-car">${item.name}</h4>
          <span class="text-muted">${formatPrice(item.price)}</span>
        </div>
        <div class="row cart-input justify-content-between align-items-center">
          <div class="col-6 col-md-4 btn-quantyti">
            <div class="input-group">
              <button class="btn btn-outline-danger decrement" data-index="${index}">-</button>
              <span class="form-control text-center" id="quantity">${item.quantity}</span>
              <button class="btn btn-outline-secondary increment" data-index="${index}">+</button>
            </div>
          </div>
          <div class="col-2 text-end btn-remove">
            <i class="fas fa-trash-alt text-danger fa-2x remove" data-index="${index}"></i>
          </div>
        </div>
      </div>
    `;

    cartBody.innerHTML += cartItemHTML;
  });

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
      const removedItem = cartItems[index];
      cartItems.splice(index, 1);
      updateCart();
      showAlert(" foi removido do carrinho.", "danger");
    });
  });
}

function updateCart() {
  renderCartItems();
  updateCartTotal();
  updateCartCount();
  saveCart();
}

function saveCart() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function addToCart(item) {
  const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }

  updateCart();
}

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
          .textContent.replace(/[^\d,]/g, "")
          .replace(",", ".")
      ),
      image: button.closest(".card").querySelector("img").src,
    };

    addToCart(item);
    showAlert("foi adicionado ao carrinho!", "success");
  }
});

updateCartCount();

document
  .querySelector(".modal-buy .add-cart")
  .addEventListener("click", (event) => {
    const button = event.target.closest("button"); // Garante que pegamos o botão mesmo se clicarmos em um ícone dentro dele
    const itemId = button.getAttribute("data-id");
    const itemPrice = parseFloat(button.getAttribute("data-price")); // Já está no formato numérico correto

    const item = {
      id: itemId,
      name: document.getElementById("modalTitle").textContent,
      price: itemPrice, // Usa o preço numérico diretamente
      image: document.getElementById("modalImage").src,
    };

    addToCart(item);
    showAlert("foi adicionado ao carrinho!", "success");
  });

document.addEventListener("DOMContentLoaded", () => {
  if (cartItems.length > 0) {
    renderCartItems();
    updateCartCount();
    updateCartTotal();
  }
});

const checkoutButton = document.getElementById("checkout");

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItems.length === 0) {
      showAlert("Seu carrinho está vazio!", "warning");
      return;
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.location.href = "finalizar_compra/index.html";
  });
} else {
  console.warn("O botão de checkout não foi encontrado.");
}
