document.addEventListener("DOMContentLoaded", () => {
  // Constantes e configurações
  const TAXA_ACRESCIMO = 1.25;
  const CUPONS_VALIDOS = {
    YONI10: 0.1,
    SEULUKAS10: 0.1,
  };
  const ALERT_DISPLAY_TIME = 3000;

  // Estado do carrinho
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let descontoAplicado = false;
  let percentualDescontoAtual = 0;

  // Elementos DOM
  const elements = {
    cartItemsContainer: document.getElementById("cartItems"),
    subtotalPrazo: document.getElementById("subtotalPrazo"),
    totalPix: document.getElementById("totalPix"),
    totalItens: document.getElementById("totalItens"),
    resumoSubtotalPrazo: document.getElementById("resumoSubtotalPrazo"),
    resumoAPrazo: document.getElementById("resumoAPrazo"),
    resumoPix: document.getElementById("resumoPix"),
    limparCarrinhoBtn: document.getElementById("Limpar_carrinho-todo"),
    cupomInput: document.getElementById("cupom"),
    cupomBtn: document.getElementById("cupom-btn"),
    finalizarCompraBtn: document.getElementById("finalizarCompra"),
    clienteNome: document.getElementById("clienteNome"),
    clienteCelular: document.getElementById("clienteCelular"),
    clienteEndereco: document.getElementById("clienteEndereco"),
    clienteEmail: document.getElementById("clienteEmail"),
    pedidoNumero: document.getElementById("n-pedido-js"),
  };

  // Inicialização
  initAlertContainer();
  updateCartDisplay();
  setupEventListeners();
  generateOrderNumber();
  initEmailJS();

  // Funções principais
  function initAlertContainer() {
    const alertContainer = document.createElement("div");
    alertContainer.id = "alertContainer";
    Object.assign(alertContainer.style, {
      position: "fixed",
      top: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "1050",
      width: "90%",
      maxWidth: "500px",
    });
    document.body.prepend(alertContainer);
  }

  function showAlert(message, type) {
    const alertContainer = document.getElementById("alertContainer");
    const alertDiv = document.createElement("div");

    alertDiv.className = `alert alert-${type} alert-dismissible fade show text-center`;
    alertDiv.setAttribute("role", "alert");
    Object.assign(alertDiv.style, {
      borderRadius: "5px",
      padding: "15px",
      fontWeight: "bold",
    });

    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("fade");
      setTimeout(() => alertDiv.remove(), 150);
    }, ALERT_DISPLAY_TIME);
  }

  function calculateTotals() {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const subtotalComDesconto = subtotal * (1 - percentualDescontoAtual);

    return {
      subtotal: subtotal.toFixed(2),
      subtotalComDesconto: subtotalComDesconto.toFixed(2),
      subtotalComAcrescimo: (subtotalComDesconto * TAXA_ACRESCIMO).toFixed(2),
      totalItens: cartItems.length,
    };
  }

  function updateCartDisplay() {
    if (cartItems.length === 0) {
      renderEmptyCart();
      resetTotals();
      return;
    }

    renderCartItems();
    updateTotals();
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  function renderEmptyCart() {
    elements.cartItemsContainer.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">Seu carrinho está vazio.</td>
      </tr>
    `;
  }

  function resetTotals() {
    const zeroValues = {
      subtotalPrazo: "R$ 0,00",
      totalPix: "R$ 0,00",
      totalItens: "0",
      resumoSubtotalPrazo: "R$ 0,00",
      resumoAPrazo: "R$ 0,00",
      resumoPix: "R$ 0,00",
    };

    Object.entries(zeroValues).forEach(([key, value]) => {
      if (elements[key]) elements[key].textContent = value;
    });
  }

  function renderCartItems() {
    elements.cartItemsContainer.innerHTML = cartItems
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
              <input type="text" class="form-control text-center value bg-transparent" 
                     value="${item.quantity}" style="width: 2px" readonly />
              <button class="btn btn-outline-secondary increment" data-index="${index}">+</button>
            </div>
          </td>
          <td>
            <div class="price-final d-flex gap-2 align-items-center">
              <span class="d-block">A prazo: <strong>R$ ${(item.price * item.quantity * TAXA_ACRESCIMO).toFixed(2)}</strong></span>
              <span class="text-danger d-block">No PIX: <strong>R$ ${(item.price * item.quantity).toFixed(2)}</strong></span>
              <i class="fas fa-trash-alt text-danger remove" data-index="${index}"></i>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  function updateTotals() {
    const { subtotalComAcrescimo, subtotalComDesconto, totalItens } =
      calculateTotals();

    const displayValues = {
      subtotalPrazo: `R$ ${subtotalComAcrescimo}`,
      totalPix: `R$ ${subtotalComDesconto}`,
      totalItens: totalItens,
      resumoSubtotalPrazo: `R$ ${subtotalComAcrescimo}`,
      resumoAPrazo: `R$ ${subtotalComAcrescimo}`,
      resumoPix: `${subtotalComDesconto}`,
    };

    Object.entries(displayValues).forEach(([key, value]) => {
      if (elements[key]) elements[key].textContent = value;
    });
  }

  function setupEventListeners() {
    // Eventos do carrinho
    elements.cartItemsContainer.addEventListener(
      "click",
      handleCartItemActions
    );
    elements.limparCarrinhoBtn.addEventListener("click", clearCart);
    elements.finalizarCompraBtn.addEventListener(
      "click",
      handleFinalizarCompra
    );

    // Eventos de cupom
    elements.cupomBtn.addEventListener("click", applyDiscount);
    elements.cupomInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") applyDiscount();
    });
  }

  function handleCartItemActions(e) {
    const index = e.target.dataset.index;
    if (!index) return;

    if (e.target.classList.contains("increment")) {
      cartItems[index].quantity++;
      updateCartDisplay();
      showAlert("Quantidade aumentada!", "info");
    } else if (e.target.classList.contains("decrement")) {
      handleDecrement(index);
    } else if (e.target.classList.contains("remove")) {
      removeItem(index);
    }
  }

  function handleDecrement(index) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
      showAlert("Quantidade reduzida!", "info");
    } else {
      removeItem(index);
    }
    updateCartDisplay();
  }

  function removeItem(index) {
    const removedItem = cartItems.splice(index, 1)[0];
    showAlert(`"${removedItem.name}" removido do carrinho!`, "warning");
    updateCartDisplay();
  }

  function clearCart(e) {
    e.preventDefault();
    if (cartItems.length === 0) {
      showAlert("O carrinho já está vazio!", "info");
      return;
    }

    if (!confirm("Tem certeza que deseja limpar todo o carrinho?")) return;

    localStorage.removeItem("cartItems");
    cartItems = [];
    resetDiscount();
    updateCartDisplay();
    showAlert("🛒 Carrinho limpo com sucesso!", "warning");
  }

  function applyDiscount() {
    const codigoCupom = elements.cupomInput.value.trim().toUpperCase();

    if (descontoAplicado) {
      showAlert(
        `Desconto de ${percentualDescontoAtual * 100}% já foi aplicado!`,
        "info"
      );
      return;
    }

    if (CUPONS_VALIDOS[codigoCupom]) {
      percentualDescontoAtual = CUPONS_VALIDOS[codigoCupom];
      descontoAplicado = true;
      updateCartDisplay();

      showAlert(
        `🎉 Cupom aplicado! ${percentualDescontoAtual * 100}% de desconto ativado.`,
        "success"
      );

      addDiscountBadge();
    } else {
      showAlert("Cupom inválido ou expirado!", "danger");
    }
  }

  function addDiscountBadge() {
    const badgeDesconto = document.createElement("span");
    badgeDesconto.className = "badge bg-success ms-2";
    badgeDesconto.textContent = `${percentualDescontoAtual * 100}% OFF`;
    document.querySelector("#resumoPix").parentNode.appendChild(badgeDesconto);
  }

  function resetDiscount() {
    descontoAplicado = false;
    percentualDescontoAtual = 0;
    elements.cupomInput.value = "";
    const badge = document.querySelector(".badge.bg-success");
    if (badge) badge.remove();
  }

  function generateOrderNumber() {
    const prefixo =
      "#" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    const sufixo = "-" + Math.floor(Math.random() * 10);
    elements.pedidoNumero.textContent = prefixo + sufixo;
  }

  function initEmailJS() {
    emailjs.init({
      publicKey: "j6o4UIA6aWu8PZG0e",
    });
  }

  async function handleFinalizarCompra() {
    if (!validateForm()) return;

    try {
      await sendOrderEmail();
      processSuccess();
      redirectAfterSuccess();
    } catch (error) {
      handleOrderError(error);
    }
  }

  function validateForm() {
    const requiredFields = {
      nome: elements.clienteNome.value.trim(),
      celular: elements.clienteCelular.value.trim(),
      endereco: elements.clienteEndereco.value.trim(),
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      const fieldsText = missingFields
        .map((f) =>
          f === "nome" ? "Nome" : f === "celular" ? "Celular" : "Endereço"
        )
        .join(", ");

      showAlert(`⚠️ Por favor, preencha: ${fieldsText}`, "danger");
      return false;
    }

    // Validação básica de celular (pelo menos 11 dígitos)
    if (requiredFields.celular.replace(/\D/g, "").length < 11) {
      showAlert(
        "⚠️ Celular inválido. Digite um número com DDD e 9 dígitos",
        "danger"
      );
      return false;
    }

    return true;
  }

  async function sendOrderEmail() {
    const templateParams = {
      pedido_numero: elements.pedidoNumero.textContent,
      nome_cliente: elements.clienteNome.value.trim(),
      celular_cliente: elements.clienteCelular.value.trim(),
      endereco_cliente: elements.clienteEndereco.value.trim(),
      email_cliente: elements.clienteEmail.value.trim() || "Não informado",
      itens_carrinho: formatCartItems(),
      total_carrinho: elements.subtotalPrazo.textContent,
      total_pix: elements.totalPix.textContent,
      data_pedido: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      metodo_pagamento:
        document.querySelector('input[name="paymentMethod"]:checked')?.value ||
        "Não especificado",
    };

    return await emailjs.send(
      "service_bzdzcij",
      "template_qsmbpva",
      templateParams
    );
  }

  function formatCartItems() {
    return cartItems
      .map(
        (item) =>
          `${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`
      )
      .join("\n");
  }

  function processSuccess() {
    showAlert(
      `🎉 Pedido ${elements.pedidoNumero.textContent} confirmado! Em breve entraremos em contato.`,
      "success"
    );

    // Limpar carrinho e cupom
    localStorage.removeItem("cartItems");
    cartItems = [];
    resetDiscount();
    updateCartDisplay();

    // Gerar novo número para próximo pedido
    generateOrderNumber();
  }

  function redirectAfterSuccess() {
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 5000);
  }

  function handleOrderError(error) {
    console.error("Erro no pedido:", error);

    // Tentar salvar localmente em caso de falha
    try {
      const pendingOrder = {
        numero: elements.pedidoNumero.textContent,
        data: new Date().toISOString(),
        itens: cartItems,
        cliente: {
          nome: elements.clienteNome.value.trim(),
          celular: elements.clienteCelular.value.trim(),
          email: elements.clienteEmail.value.trim(),
        },
        total: elements.subtotalPrazo.textContent,
      };

      localStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));
      showAlert(
        "⚠️ Seu pedido foi salvo localmente. Entraremos em contato em breve.",
        "warning"
      );
    } catch (e) {
      console.error("Falha ao salvar pedido localmente:", e);
      showAlert(
        "❌ Falha ao finalizar pedido. Por favor, tente novamente ou entre em contato.",
        "danger"
      );
    }
  }
});
