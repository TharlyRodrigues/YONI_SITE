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

// contador de tempo
function startTimer() {
  const agora = new Date();

  const meiaNoite = new Date();
  meiaNoite.setHours(23, 59, 59, 999);

  let tempoRestante = Math.floor((meiaNoite - agora) / 1000);

  let horas = Math.floor(tempoRestante / 3600);
  let minutos = Math.floor((tempoRestante % 3600) / 60);
  let segundos = tempoRestante % 60;

  horas = horas < 10 ? "0" + horas : horas;
  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundos = segundos < 10 ? "0" + segundos : segundos;

  document.getElementById("contador").textContent =
    `${horas}:${minutos}:${segundos}`;
}

setInterval(startTimer, 1000);

startTimer();

// header scroll

function userScroll() {
  const navbar = document.querySelector(".header-nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("bg-yoni");
    } else {
      navbar.classList.remove("bg-yoni");
    }
  });
}

document.addEventListener("DOMContentLoaded", userScroll);
