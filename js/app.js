let currentPage = 1;
const itemsPerPage = 12;
let allItems = [];
let filteredItems = [];

// Função para carregar os dados do arquivo JSON
function loadItems() {
  fetch("produtos.json")
    .then((response) => response.json())
    .then((data) => {
      allItems = data;
      filteredItems = [].concat(...Object.values(allItems));
      updatePage(false); // Não rola a página no carregamento inicial
    })
    .catch((error) => console.error("Erro ao carregar os produtos:", error));
}

// Função para exibir os itens na tela
function displayItems(itemsToDisplay) {
  const itemsContainer = document.querySelector(".row.produtos-item");
  itemsContainer.innerHTML = "";
  itemsToDisplay.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add(
      "col-12",
      "col-sm-6",
      "col-md-4",
      "col-lg-3",
      "mb-4",
      "d-flex",
      "justify-content-center"
    );
    itemElement.innerHTML = `
      <div class="card" style="width: 18rem; text-align: center">
        <i class="fa-regular fa-heart coracao fa-2x"></i>
        <img src="${item.image}" class="card-img-top" alt="${item.name}" />
        <div class="card-body">
          <h5 class="card-title" style="margin-bottom: 0; font-weight: bold;">
            ${item.name}
          </h5>
          <p class="badge bg-danger text-white desconto">25% OFF no PIX</p>
          <div class="text-warning mb-2">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half-stroke"></i>
          </div>
          <p style="color: black; margin-bottom: 0;">De: R$ <s>${(
            item.price * 1.25
          ).toFixed(2)}</s></p>
          <p style="margin-bottom: 0; font-weight: bold;">Por:</p>
          <p class="h5 preco">R$ ${item.price.toFixed(2)}
            <span class="text-muted" style="font-size: 0.8rem">no pix</span>
          </p>
          <a class="btn-modal" onclick='openModal(${JSON.stringify(item)})'>
            <i class="fa-solid fa-eye"></i> Detalhes
          </a>
          <button class="btn btn-danger">
            <i class="fa-solid fa-cart-shopping"></i> COMPRAR
          </button>
        </div>
      </div>
    `;
    itemsContainer.appendChild(itemElement);
  });

  // Delegação de evento para os ícones de coração
  itemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("coracao")) {
      event.target.classList.toggle("fa-regular");
      event.target.classList.toggle("fa-solid");
    }
  });
}

// Função para abrir o modal com informações detalhadas do item
function openModal(item) {
  document.getElementById("modalImage").src = item.image;
  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDescription").textContent =
    item.description || "Descrição não disponível.";
  document.getElementById("modalPrice").textContent = (
    item.price * 1.25
  ).toFixed(2);
  document.getElementById("modalDiscount").textContent = "25% OFF no PIX";

  const modal = new bootstrap.Modal(document.getElementById("itemModal"));
  modal.show();
}

// Função para criar a paginação
function createPagination(itemsCount) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Limpa a paginação existente

  const pageCount = Math.ceil(itemsCount / itemsPerPage);

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(pageCount, currentPage + 1);

  if (endPage - startPage < 2) {
    if (startPage === 1) {
      endPage = Math.min(pageCount, startPage + 2);
    } else {
      startPage = Math.max(1, endPage - 2);
    }
  }

  // Botão "Anterior"
  const prevButton = document.createElement("li");
  prevButton.classList.add("page-item");
  prevButton.innerHTML = '<a class="page-link" href="#"><</a>';
  prevButton.classList.toggle("disabled", currentPage === 1);
  prevButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      updatePage(true); // Rola a página
    }
  });
  paginationContainer.appendChild(prevButton);

  // Links das páginas
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;

    if (i === currentPage) {
      pageItem.classList.add("active");
    }

    pageItem.addEventListener("click", (event) => {
      event.preventDefault();
      currentPage = i;
      updatePage(true); // Rola a página
    });

    paginationContainer.appendChild(pageItem);
  }

  // Botão "Próximo"
  const nextButton = document.createElement("li");
  nextButton.classList.add("page-item");
  nextButton.innerHTML = '<a class="page-link" href="#">></a>';
  nextButton.classList.toggle("disabled", currentPage === pageCount);
  nextButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (currentPage < pageCount) {
      currentPage++;
      updatePage(true); // Rola a página
    }
  });
  paginationContainer.appendChild(nextButton);
}

// Função para atualizar os itens da página e a paginação
function updatePage(shouldScroll = false) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = filteredItems.slice(startIndex, endIndex);
  displayItems(itemsToDisplay);
  createPagination(filteredItems.length);

  // Rola a página até a div de produtos e a mostra 100% visível
  if (shouldScroll) {
    const produtosMenu = document.querySelector(".produtos-menu");
    if (produtosMenu) {
      const yOffset =
        produtosMenu.getBoundingClientRect().top + window.scrollY - 300;
      window.scrollTo({ top: yOffset, behavior: "smooth" });
    }
  }
}

// Função para filtrar os itens por categoria
function filterItems(category) {
  if (category === "all") {
    filteredItems = [].concat(...Object.values(allItems));
  } else {
    filteredItems = allItems[category] || [];
  }
  currentPage = 1;
  updatePage(true); // Rola a página
}

// Função para buscar itens
function searchItems(query) {
  filteredItems = []
    .concat(...Object.values(allItems))
    .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  currentPage = 1;
  updatePage(true); // Rola a página
}

// Inicializa o carregamento dos itens e configura os eventos
document.addEventListener("DOMContentLoaded", () => {
  loadItems();

  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const category = e.target.getAttribute("data-category");
      filterItems(category);
    });
  });

  const searchForm = document.querySelector(".search form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Previne o comportamento padrão (recarregar a página)
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchItems(e.target.value);
    });

    // Prevenir o envio do formulário ao pressionar "Enter"
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Impede o recarregamento da página ao pressionar Enter
        searchItems(e.target.value); // Realiza a busca
      }
    });
  }
});

// Funções para o menu mobile
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const exitMenuButton = mobileMenu.querySelector("[data-menu-exit]");
  const categoryLinks = mobileMenu.querySelectorAll(".nav-link.filter-btn");

  // Abre o menu ao clicar no botão
  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.add("menu-open");
  });

  // Fecha o menu ao clicar no botão de fechar
  exitMenuButton.addEventListener("click", function () {
    mobileMenu.classList.remove("menu-open");
  });

  // Fecha o menu ao clicar em uma categoria
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("menu-open");
      const category = this.getAttribute("data-category");
      filterItems(category);
    });
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener("click", function (event) {
    if (
      !mobileMenu.contains(event.target) &&
      !mobileMenuButton.contains(event.target)
    ) {
      mobileMenu.classList.remove("menu-open");
    }
  });
});

function userScroll() {
  const navbar = document.querySelector(".header-nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("bg-warning");
    } else {
      navbar.classList.remove("bg-warning");
    }
  });
}

document.addEventListener("DOMContentLoaded", userScroll);
