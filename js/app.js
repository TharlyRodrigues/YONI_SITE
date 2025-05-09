let currentPage = 1;
const itemsPerPage = 12;
let allItems = [];
let filteredItems = [];

// Função para formatar preços no padrão brasileiro
function formatPrice(price) {
  return parseFloat(price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
// Função para carregar os dados do arquivo JSON
function loadItems() {
  fetch("../produtos.json")
    .then((response) => response.json())
    .then((data) => {
      allItems = data;
      filteredItems = [].concat(...Object.values(allItems));
      if (data.topmaisvendidos) {
        displayTopMaisVendidos(data.topmaisvendidos);
      }
      updatePage(false);
      if (data.combos) {
        loadSliderItems(data.combos);
      }
    })
    .catch((error) => console.error("Erro ao carregar os produtos:", error));
}

// Função para carregar os itens do slider
function loadSliderItems(comboItems) {
  const sliderContainer = document.querySelector(
    "#slider-combos-yoni .carousel-inner"
  );
  const indicatorsContainer = document.querySelector(
    "#slider-combos-yoni .carousel-indicators"
  );
  sliderContainer.innerHTML = ""; // Limpa os itens anteriores
  indicatorsContainer.innerHTML = ""; // Limpa os indicadores anteriores

  // Define o número de itens por slide com base no tamanho da tela
  let itemsPerSlide = 4; // Padrão para telas grandes
  if (window.innerWidth < 992) {
    // Telas médias
    itemsPerSlide = 2;
  }
  if (window.innerWidth < 768) {
    // Telas pequenas
    itemsPerSlide = 1;
  }

  // Divide os itens em grupos com base no número de itens por slide
  for (let i = 0; i < comboItems.length; i += itemsPerSlide) {
    const slideItems = comboItems.slice(i, i + itemsPerSlide); // Pega os itens por slide
    const slideItem = document.createElement("div");
    slideItem.classList.add("carousel-item");

    // Cria uma linha para os cards
    const row = document.createElement("div");
    row.classList.add("row", "justify-content-center", "no-gutters");

    slideItems.forEach((item) => {
      const col = document.createElement("div");
      // Ajusta o tamanho das colunas com base no número de itens por slide
      if (itemsPerSlide === 4) {
        col.classList.add("col", "col-12", "col-md-3");
      } else if (itemsPerSlide === 2) {
        col.classList.add("col", "col-12", "col-md-4");
      } else if (itemsPerSlide === 1) {
        col.classList.add("col", "col-12");
      }

      const card = `
        <div class="card" style="text-align: center;">
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
            <p style="color: black; margin-bottom: 0;">De: R$ <s>${formatPrice(item.price * 1.25)}</s></p>
            <p style="margin-bottom: 0; font-weight: bold;">Por:</p>
            <p class="h5 preco">R$ ${formatPrice(item.price)}
              <span class="text-muted" style="font-size: 0.8rem">no pix</span>
            </p>
            <a class="btn-modal detalhes${item.estoque === 0 ? "disabled-link" : ""}" 
              ${item.estoque > 0 ? `onclick='openModal(${JSON.stringify(item)})'` : ""}
              data-id="${item.id}">
              <i class="fa-solid fa-eye"></i> Mais Detalhes 
            </a>
            <!-- Botão de compra -->
          <button class="btn btn-danger add-card btn-comprar" data-id="${item.id}" id="btnCompra${item.id}" ${item.estoque === 0 ? "disabled" : ""}>
            ${item.estoque === 0 ? "Sem Estoque" : `<i class="fa-solid fa-cart-shopping"></i> COMPRAR`}
          </button>
          </div>
        </div>
      `;
      col.innerHTML = card;
      row.appendChild(col);
    });

    slideItem.appendChild(row);
    sliderContainer.appendChild(slideItem);

    // Cria os indicadores
    const indicator = document.createElement("button");
    indicator.setAttribute("type", "button");
    indicator.setAttribute("data-bs-target", "#slider-combos-yoni");
    indicator.setAttribute("data-bs-slide-to", i / itemsPerSlide);
    if (i === 0) {
      indicator.classList.add("active"); // Torna o primeiro indicador ativo
    }
    indicatorsContainer.appendChild(indicator);
  }

  // Torna o primeiro slide ativo
  sliderContainer.firstElementChild.classList.add("active");

  // Exemplo de função de modal (pode ser personalizada conforme necessário)
  function openModal(item) {
    console.log(item); // Aqui você pode abrir um modal com mais informações sobre o item
  }
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

    // Criação do card do item
    itemElement.innerHTML = `
      <div class="card" style="text-align: center; position: relative;">
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
          <p style="color: black; margin-bottom: 0;">De: R$ <s>${formatPrice(item.price * 1.25)}</s></p>
          <p style="margin-bottom: 0; font-weight: bold;">Por:</p>
          <p class="h5 preco">R$ ${formatPrice(item.price)}
            <span class="text-muted" style="font-size: 0.8rem">no pix</span>
          </p>
            <a class="btn-modal ${item.estoque === 0 ? "disabled-link" : ""}" 
              ${item.estoque > 0 ? `onclick='openModal(${JSON.stringify(item)})'` : ""}
              data-id="${item.id}">
              <i class="fa-solid fa-eye"></i> Mais Detalhes 
            </a>
          <!-- Botão de compra -->
          <button class="btn btn-danger add-card btn-comprar" data-id="${item.id}" id="btnCompra${item.id}" ${item.estoque === 0 ? "disabled" : ""}>
            ${item.estoque === 0 ? "Sem Estoque" : `<i class="fa-solid fa-cart-shopping"></i> COMPRAR`}
          </button>
        </div>
      </div>
    `;

    itemsContainer.appendChild(itemElement);
  });
}

// Função para exibir os itens top mais vendidos na tela
function displayTopMaisVendidos(items__topMais) {
  const container = document.querySelector(".row.produtos-item__topMais");
  container.innerHTML = ""; // Limpa os itens anteriores

  items__topMais.forEach((item) => {
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

    // Criação do card do item
    itemElement.innerHTML = `
      <div class="card" style="text-align: center; position: relative;">
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
          <p style="color: black; margin-bottom: 0;">De: R$ <s>${formatPrice(item.price * 1.25)}</s></p>
          <p style="margin-bottom: 0; font-weight: bold;">Por:</p>
          <p class="h5 preco">R$ ${formatPrice(item.price)}
            <span class="text-muted" style="font-size: 0.8rem">no pix</span>
          </p>
          <a class="btn-modal ${item.estoque === 0 ? "disabled-link" : ""}" 
            ${item.estoque > 0 ? `onclick='openModal(${JSON.stringify(item)})'` : ""}
            data-id="${item.id}">
            <i class="fa-solid fa-eye"></i> Mais Detalhes 
          </a>
          <button class="btn btn-danger add-card btn-comprar" data-id="${item.id}" id="btnCompra${item.id}" ${item.estoque === 0 ? "disabled" : ""}>
            ${item.estoque === 0 ? "Sem Estoque" : `<i class="fa-solid fa-cart-shopping"></i> COMPRAR`}
          </button>
        </div>
      </div>
    `;

    container.appendChild(itemElement);
  });
}

// // Delegação de evento para os ícones de coração (executa apenas uma vez)
// document.addEventListener("click", (event) => {
//   if (event.target.classList.contains("coracao")) {
//     event.target.classList.toggle("fa-regular");
//     event.target.classList.toggle("fa-solid");
//   }
// });

// Função para abrir o modal com informações detalhadas do item
function openModal(item) {
  document.getElementById("modalImage").src = item.image;
  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDescription").textContent =
    item.description || "Descrição não disponível.";
  document.getElementById("modalComoUsar").textContent =
    item.comousar || "Descrição não disponível.";
  document.getElementById("modalComposicao").textContent =
    item.composicao || "Descrição não disponível.";
  document.getElementById("modalPrice").textContent = formatPrice(
    item.price * 1.25
  );
  document.getElementById("modalPixPrice").textContent = formatPrice(
    item.price
  );
  document.getElementById("modalDiscount").textContent = "25% OFF no PIX";

  // Adiciona o ID do item e o preço numérico como atributos de dados
  const modalBuyButton = document.querySelector(".modal-buy button");
  modalBuyButton.setAttribute("data-id", item.id);
  modalBuyButton.setAttribute("data-price", item.price); // Preço numérico sem formatação

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
  // updatePage(true); // Rola a página
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
      updatePage(false);
    });

    // Prevenir o envio do formulário ao pressionar "Enter"
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Impede o recarregamento da página ao pressionar Enter
        searchItems(e.target.value); // Realiza a busca
        updatePage(true);
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
