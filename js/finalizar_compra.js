document.addEventListener("DOMContentLoaded", () => {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartItemsContainer = document.getElementById("cartItems");
  const subtotalPrazo = document.getElementById("subtotalPrazo");
  const totalPix = document.getElementById("totalPix");
  const totalItens = document.getElementById("totalItens");
  const resumoSubtotalPrazo = document.getElementById("resumoSubtotalPrazo");
  const resumoAPrazo = document.getElementById("resumoAPrazo");
  const resumoPix = document.getElementById("resumoPix");
  const limparCarrinhoBtn = document.getElementById("Limpar_carrinho-todo");

  // Criar um container de alertas no topo da página
  const alertContainer = document.createElement("div");
  alertContainer.id = "alertContainer";
  alertContainer.style.position = "fixed";
  alertContainer.style.top = "10px";
  alertContainer.style.left = "50%";
  alertContainer.style.transform = "translateX(-50%)";
  alertContainer.style.zIndex = "1050";
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

    // Fecha o alerta após 3 segundos
    setTimeout(() => {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("fade");
      setTimeout(() => {
        alertDiv.remove();
      }, 150); // Tempo para a animação de fade
    }, 3000);
  };

  const updateCartDisplay = () => {
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `<tr><td colspan="4" class="text-center">Seu carrinho está vazio.</td></tr>`;
      subtotalPrazo.textContent = "R$ 0,00";
      totalPix.textContent = "No PIX: R$ 0,00";
      totalItens.textContent = "0";
      resumoSubtotalPrazo.textContent = "R$ 0,00";
      resumoAPrazo.textContent = "R$ 0,00";
      resumoPix.textContent = "No PIX: R$ 0,00";
      return;
    }

    cartItemsContainer.innerHTML = cartItems
      .map(
        (item, index) => `
      <tr>
        <td class="d-flex align-items-center">
          <img src="${item.image}" class="me-3" alt="${item.name}" style="width: 100px; height: auto;" />
          <div>
            <strong>${item.name}</strong>
            <p class="text-muted mb-0">${item.description || ""}</p>
          </div>
        </td>
        <td>
          <div class="input-group">
            <button class="btn btn-outline-danger decrement" data-index="${index}">-</button>
            <input type="text" class="form-control text-center value bg-transparent" value="${item.quantity}" style="width: 2px" readonly />
            <button class="btn btn-outline-secondary increment" data-index="${index}">+</button>
          </div>
        </td>
        <td>
          <div class="price-final d-flex gap-2 align-items-center">
            <span class="d-block">A prazo: <strong>R$ ${(item.price * item.quantity * 1.25).toFixed(2)}</strong></span>
            <span class="text-danger d-block">No PIX: <strong>R$ ${(item.price * item.quantity).toFixed(2)}</strong></span>
            <i class="fas fa-trash-alt text-danger remove" data-index="${index}"></i>
            </div>
        </td>
      </tr>
    `
      )
      .join("");

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalComAcrescimo = total * 1.25;

    subtotalPrazo.textContent = `R$ ${totalComAcrescimo.toFixed(2)}`;
    totalPix.textContent = `No PIX: R$ ${total.toFixed(2)}`;
    totalItens.textContent = cartItems.length;
    resumoSubtotalPrazo.textContent = `R$ ${totalComAcrescimo.toFixed(2)}`;
    resumoAPrazo.textContent = `R$ ${totalComAcrescimo.toFixed(2)}`;
    resumoPix.textContent = `No PIX: ${total.toFixed(2)}`;

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    attachEventListeners();
  };

  const attachEventListeners = () => {
    document.querySelectorAll(".increment").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        cartItems[index].quantity++;
        updateCartDisplay();
        showAlert("Quantidade aumentada!", "info");
      });
    });

    document.querySelectorAll(".decrement").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity--;
          showAlert("Quantidade reduzida!", "info");
        } else {
          cartItems.splice(index, 1);
          showAlert("Item removido do carrinho!", "warning");
        }
        updateCartDisplay();
      });
    });

    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        cartItems.splice(index, 1);
        updateCartDisplay();
        showAlert("Item removido do carrinho!", "danger");
      });
    });
  };

  limparCarrinhoBtn.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("cartItems");
    cartItems = [];
    updateCartDisplay();
    showAlert("🛒 Carrinho limpo com sucesso!", "warning");
  });

  const finalizarCompra = () => {
    showAlert("🎉 Compra finalizada com sucesso!", "success");
    localStorage.removeItem("cartItems");
    cartItems = [];
    updateCartDisplay();
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3000);
  };

  document
    .getElementById("finalizarCompra")
    .addEventListener("click", finalizarCompra);
  updateCartDisplay();
});
