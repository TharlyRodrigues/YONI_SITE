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

  // Atualiza a exibição do carrinho
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
              <img src="${item.image}" class="me-3" alt="${item.name}" style="width: 60px; height: auto;" />
              <div>
                <strong>${item.name}</strong>
                <p class="text-muted mb-0">${item.description || ""}</p>
              </div>
            </td>
            <td>
              <div class="input-group">
                <button class="btn btn-outline-secondary decrement" data-index="${index}">-</button>
                <input type="text" class="form-control text-center" value="${item.quantity}" style="width: 50px" readonly />
                <button class="btn btn-outline-secondary increment" data-index="${index}">+</button>
              </div>
            </td>
            <td>
              <div class="price-final">
                <span class="d-block">A prazo: <strong>R$ ${(item.price * item.quantity * 1.25).toFixed(2)}</strong></span>
                <span class="text-danger d-block">No PIX: <strong>R$ ${(item.price * item.quantity).toFixed(2)}</strong></span>
              </div>
              <i class="fas fa-trash-alt text-danger fa-2x remove" data-index="${index}"></i>
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
    resumoPix.textContent = `No PIX: R$ ${total.toFixed(2)}`;

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    attachEventListeners();
  };

  const attachEventListeners = () => {
    document.querySelectorAll(".increment").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        cartItems[index].quantity++;
        updateCartDisplay();
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
        updateCartDisplay();
      });
    });

    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        cartItems.splice(index, 1);
        updateCartDisplay();
      });
    });
  };

  // Função para limpar todo o carrinho
  limparCarrinhoBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (confirm("Tem certeza que deseja limpar o carrinho?")) {
      localStorage.removeItem("cartItems");
      cartItems = [];
      updateCartDisplay();
    }
  });

  // Finalizar compra
  const finalizarCompra = () => {
    alert("Compra finalizada com sucesso!");

    // Limpa os itens do carrinho no localStorage
    localStorage.removeItem("cartItems");

    // Esvazia o array cartItems
    cartItems = [];

    // Atualiza a interface do carrinho
    updateCartDisplay();

    // Redireciona para a página inicial após um pequeno delay
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 500);
  };

  document
    .getElementById("finalizarCompra")
    .addEventListener("click", finalizarCompra);

  updateCartDisplay();
});
