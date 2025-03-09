const row = document.querySelector(".row.flex-nowrap");

let speed = 1; // Velocidade do scroll
let offset = 0; // Controla a posição do scroll

function continuousScroll() {
  if (row) {
    // Move a posição do scroll suavemente
    offset += speed;
    // Verifica se chegou ao final e reseta suavemente
    if (offset >= row.scrollWidth - row.clientWidth) {
      offset = 0;
    }
    row.style.transform = `translateX(-${offset}px)`; // Aplica o scroll
    requestAnimationFrame(continuousScroll); // Continua a rolagem
  }
}

// Inicia o scroll contínuo
continuousScroll();
