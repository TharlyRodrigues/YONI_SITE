// Variáveis dos favoritos
let favoriteItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
const favoriteCar = document.querySelector(".cart-favorite");
const favoriteBody = document.querySelector(".card-body-fav");

// Elementos de controle
const favoriteOpenButtons = document.querySelectorAll(
  "#cart-favorites-button, .favorite-icon"
);
const favoriteCloseButtons = document.querySelectorAll(".close-favorite");

// Função para mostrar alertas
function showFavoriteAlert(message, type) {
  const alertContainer =
    document.getElementById("alertContainer") || createAlertContainer();
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.classList.remove("show");
    alertDiv.addEventListener("transitionend", () => alertDiv.remove());
  }, 3000);
}

function createAlertContainer() {
  const container = document.createElement("div");
  container.id = "alertContainer";
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.left = "50%";
  container.style.transform = "translateX(-50%)";
  container.style.zIndex = "1060";
  container.style.width = "90%";
  container.style.maxWidth = "500px";
  document.body.appendChild(container);
  return container;
}

// Renderiza os itens favoritos e adiciona os eventos
function renderAndBindEvents() {
  renderFavoriteItems();
  bindFavoriteItemEvents();
}

// Renderiza os itens favoritos
function renderFavoriteItems() {
  if (!favoriteBody) return;

  favoriteBody.innerHTML =
    favoriteItems.length === 0
      ? '<p class="text-center txt-cart-fav">Nenhum item favoritado ainda.</p>'
      : favoriteItems
          .map(
            (item, index) => `
        <div class="row align-items-center mb-3 item__favorito">
          <div class="col-4">
            <img src="${item.image}" alt="${item.name}" class="img-fluid img-cart-fav">
          </div>
          <div class="col-4">
            <h3 class="cart-title-fav">${item.name}</h3>
            <span class="text-muted">R$ ${item.price.toFixed(2)}</span>
          </div>
          <div class="col-4 box-btn__favorite">
            <button class="btn btn-danger btn-sm add-card btn-comprar btn-favorite-comprar" data-id="${item.id}">
              Comprar
            </button>
            <i class="fas fa-trash-alt remove-favorite text-danger" data-index="${index}"></i>
          </div>
        </div>
      `
          )
          .join("");
}

// Adiciona eventos de botão nos itens renderizados
function bindFavoriteItemEvents() {
  document.querySelectorAll(".remove-favorite").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      const removedItem = favoriteItems[index];
      favoriteItems.splice(index, 1);
      saveFavorites();
      renderAndBindEvents();
      showFavoriteAlert("removido dos favoritos", "danger");
    });
  });

  document.querySelectorAll(".btn-comprar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const itemId = e.currentTarget.dataset.id;
      const item = favoriteItems.find((item) => item.id === itemId);
      if (item && typeof addToCart === "function") {
        addToCart(item);
        showFavoriteAlert("adicionado ao carrinho", "success");
      }
    });
  });
}

// Funções de persistência
function saveFavorites() {
  localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
}

// Funções de controle dos favoritos
function addToFavorites(item) {
  if (!favoriteItems.some((fav) => fav.id === item.id)) {
    favoriteItems.push(item);
    saveFavorites();
    showFavoriteAlert("adicionado aos favoritos", "success");
    return true;
  }
  return false;
}

function removeFromFavorites(itemId) {
  const initialLength = favoriteItems.length;
  favoriteItems = favoriteItems.filter((item) => item.id !== itemId);
  if (favoriteItems.length !== initialLength) {
    saveFavorites();
    return true;
  }
  return false;
}

function toggleFavorite(item) {
  if (favoriteItems.some((fav) => fav.id === item.id)) {
    removeFromFavorites(item.id);
    return false;
  } else {
    addToFavorites(item);
    return true;
  }
}

// Atualiza ícones de coração
function updateHeartIcons() {
  document.querySelectorAll(".fa-heart").forEach((icon) => {
    const card = icon.closest(".card");
    if (card) {
      const itemId = card.querySelector(".add-card")?.dataset.id;
      if (itemId && favoriteItems.some((item) => item.id === itemId)) {
        icon.classList.add("fas");
        icon.classList.remove("far");
      } else {
        icon.classList.add("far");
        icon.classList.remove("fas");
      }
    }
  });
}

// Função auxiliar para verificar se é favorito
function isFavorite(itemId) {
  return favoriteItems.some((fav) => fav.id === itemId);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderAndBindEvents();
  updateHeartIcons();
});

// Controle do modal
favoriteOpenButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    favoriteCar.classList.add("active");
    renderAndBindEvents();
  });
});

favoriteCloseButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    favoriteCar.classList.remove("active");
  });
});

// Evento para ícones de coração
document.addEventListener("click", (e) => {
  if (e.target.closest(".fa-heart")) {
    const heartIcon = e.target.closest(".fa-heart");
    const card = heartIcon.closest(".card");
    if (card) {
      e.preventDefault();
      const item = {
        id: card.querySelector(".add-card")?.dataset.id,
        name: card.querySelector(".card-title")?.textContent.trim(),
        price: parseFloat(
          card
            .querySelector(".preco")
            ?.textContent.replace(/[^\d,]/g, "")
            .replace(",", ".") || 0
        ),
        image: card.querySelector("img")?.src,
      };

      if (item.id) {
        const isNowFavorite = toggleFavorite(item);
        heartIcon.classList.toggle("far", !isNowFavorite);
        heartIcon.classList.toggle("fas", isNowFavorite);
      }
    }
  }
});
