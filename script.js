const truePassword = "kamu"; // Ganti password di sini (huruf kecil)
const pesanSurat = "Makasih ya udah keranjangin semua Dubai Chewy Cookie-nya! Sama kayak cookie tadi, hadirnya kamu itu manis dan spesial banget buat aku. Tetap sama aku terus ya! I love you so much! ❤️";

let score = 0;
let gameInterval;
let i = 0;
let isTyped = false;

function playMusic() {
  const music = document.getElementById("bgMusic");
  if (music && music.paused) {
    music.play().catch(() => {});
  }
}

function nextSlide(slideId) {
  playMusic();
  
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.classList.remove('active'));

  const targetSlide = document.getElementById(slideId);
  if (targetSlide) {
    targetSlide.classList.add('active');
  }

  if (slideId === 'slide2') {
    startGame();
  } else {
    clearInterval(gameInterval);
  }

  if (slideId === 'slide5' && !isTyped) {
    typeWriter();
    isTyped = true;
  }
}

function checkPassword() {
  const input = document.getElementById("passInput").value.toLowerCase().trim();
  const errorMsg = document.getElementById("errorMsg");

  if (input === truePassword) {
    nextSlide('slide2');
  } else {
    errorMsg.innerText = "Jawaban salah, coba lagi dong! 😜";
  }
}

// Logika Game Tangkap Cookie
function startGame() {
  score = 0;
  document.getElementById("score").innerText = score;
  const container = document.getElementById("game-container");
  const basket = document.getElementById("basket");

  // Kontrol Keranjang dengan Mouse / Sentuhan Layar
  container.onmousemove = (e) => moveBasket(e.clientX);
  container.ontouchmove = (e) => moveBasket(e.touches[0].clientX);

  function moveBasket(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left - 20;
    if (x < 0) x = 0;
    if (x > rect.width - 40) x = rect.width - 40;
    basket.style.left = x + "px";
  }

  // Buat Cookie jatuh setiap 1 detik
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    createCookie();
  }, 1000);
}

function createCookie() {
  const container = document.getElementById("game-container");
  const basket = document.getElementById("basket");
  if (!container || score >= 5) return;

  const cookie = document.createElement("div");
  cookie.classList.add("cookie");
  
  const startX = Math.random() * (container.clientWidth - 45);
  cookie.style.left = startX + "px";
  cookie.style.top = "0px";
  container.appendChild(cookie);

  let posY = 0;
  const fall = setInterval(() => {
    posY += 3;
    cookie.style.top = posY + "px";

    // Cek tabrakan cookie dengan keranjang
    const cookieRect = cookie.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    if (
      cookieRect.bottom >= basketRect.top &&
      cookieRect.top <= basketRect.bottom &&
      cookieRect.right >= basketRect.left &&
      cookieRect.left <= basketRect.right
    ) {
      score++;
      document.getElementById("score").innerText = score;
      cookie.remove();
      clearInterval(fall);

      if (score >= 5) {
        clearInterval(gameInterval);
        setTimeout(() => {
          alert("Yeay! Semua Dubai Cookie berhasil dikeranjangin! 🥳✨");
          nextSlide('slide3');
        }, 300);
      }
    }

    // Hapus jika lolos jatuh ke bawah
    if (posY > container.clientHeight) {
      cookie.remove();
      clearInterval(fall);
    }
  }, 20);
}

function typeWriter() {
  if (i < pesanSurat.length) {
    document.getElementById("typedText").innerHTML += pesanSurat.charAt(i);
    i++;
    setTimeout(typeWriter, 40);
  }
}
