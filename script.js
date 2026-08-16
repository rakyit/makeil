const truePassword = "kamu"; // Ganti password di sini (huruf kecil)
const pesanSurat = "Makasih ya udah mau ngeluangin waktu buat maenin game dan liat foto-foto kita. Dari awal kenal sampai sekarang, kehadiran kamu selalu jadi hal manis buat aku. Makanya hari ini aku pengen jujur sama kamu...";

// Data 6 Foto Pinterest Langsung (Langsung Bisa Diakses!)
const photos = [
  { src: "https://i.pinimg.com/736x/2b/9b/77/2b9b77d6118d098e9a6ef77732d84db8.jpg", desc: "Momen favorit pertama bareng kamu 💖" },
  { src: "https://i.pinimg.com/736x/d9/38/54/d93854930f7bb0039a8501533e414c5b.jpg", desc: "Lucu banget ekspresi kamu di sini 🥰" },
  { src: "https://i.pinimg.com/736x/8f/33/20/8f3320295eb13813894db896264d84f1.jpg", desc: "Kenangan manis yang gak bakal aku lupain ✨" },
  { src: "https://i.pinimg.com/736x/44/2c/3f/442c3f76903fbcf83ca649be11e5f03f.jpg", desc: "Selalu suka kalau ngeliat foto ini 📸" },
  { src: "https://i.pinimg.com/736x/ee/93/29/ee9329cb67e41bdca6b245ddbd588147.jpg", desc: "Hari dimana kita banyak ketawa bareng 😂" },
  { src: "https://i.pinimg.com/736x/29/77/b1/2977b10294155a557a1b02d84ee5e1df.jpg", desc: "Foto terindah bareng orang paling favorit ❤️" }
];

let currentPhoto = 0;
let score = 0;
let gameInterval;
let i = 0;
let isTyped = false;
let yesScale = 1;
let noScale = 1;

function playMusic() {
  const music = document.getElementById("bgMusic");
  if (music && music.paused) music.play().catch(() => {});
}

function nextSlide(slideId) {
  playMusic();
  document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
  const target = document.getElementById(slideId);
  if (target) target.classList.add('active');

  if (slideId === 'slide2') initWordSearch();
  if (slideId === 'slide3') startGame(); else clearInterval(gameInterval);
  if (slideId === 'slide5') updateGallery();
  if (slideId === 'slide6' && !isTyped) { typeWriter(); isTyped = true; }
}

function checkPassword() {
  const input = document.getElementById("passInput").value.toLowerCase().trim();
  if (input === truePassword) nextSlide('slide2');
  else document.getElementById("errorMsg").innerText = "Salah dong, coba lagi! 😜";
}

/* ---- GAME 1: CARI KATA (DUBAI) ---- */
const gridData = ['D','U','B','A','I','X','K','O','P','L','S','A','Y','A','N','M','A','N','I','S','C','O','O','K','I'];
let selectedWord = "";

function initWordSearch() {
  const container = document.getElementById("word-grid");
  container.innerHTML = "";
  selectedWord = "";
  gridData.forEach((char) => {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.innerText = char;
    cell.onclick = () => {
      cell.classList.toggle("selected");
      if (cell.classList.contains("selected")) selectedWord += char;
      if (selectedWord.includes("DUBAI")) {
        alert("Hore! Kamu berhasil menemukan kata DUBAI! 🎉");
        nextSlide('slide3');
      }
    };
    container.appendChild(cell);
  });
}

/* ---- GAME 2: TANGKAP COOKIE ---- */
function startGame() {
  score = 0;
  document.getElementById("score").innerText = score;
  const container = document.getElementById("game-container");
  const basket = document.getElementById("basket");

  container.onmousemove = (e) => moveBasket(e.clientX);
  container.ontouchmove = (e) => moveBasket(e.touches[0].clientX);

  function moveBasket(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left - 20;
    if (x < 0) x = 0;
    if (x > rect.width - 40) x = rect.width - 40;
    basket.style.left = x + "px";
  }

  clearInterval(gameInterval);
  gameInterval = setInterval(() => createCookie(), 1000);
}

function createCookie() {
  const container = document.getElementById("game-container");
  const basket = document.getElementById("basket");
  if (!container || score >= 5) return;

  const cookie = document.createElement("div");
  cookie.classList.add("cookie");
  cookie.style.left = Math.random() * (container.clientWidth - 40) + "px";
  cookie.style.top = "0px";
  container.appendChild(cookie);

  let posY = 0;
  const fall = setInterval(() => {
    posY += 3;
    cookie.style.top = posY + "px";
    const cRect = cookie.getBoundingClientRect();
    const bRect = basket.getBoundingClientRect();

    if (cRect.bottom >= bRect.top && cRect.top <= bRect.bottom && cRect.right >= bRect.left && cRect.left <= bRect.right) {
      score++;
      document.getElementById("score").innerText = score;
      cookie.remove();
      clearInterval(fall);
      if (score >= 5) {
        clearInterval(gameInterval);
        setTimeout(() => { alert("Semua Dubai Cookie berhasil dikeranjangin! 🥳"); nextSlide('slide4'); }, 300);
      }
    }
    if (posY > container.clientHeight) { cookie.remove(); clearInterval(fall); }
  }, 20);
}

/* ---- GALERI FOTO ---- */
function updateGallery() {
  document.getElementById("galleryImg").src = photos[currentPhoto].src;
  document.getElementById("galleryDesc").innerText = photos[currentPhoto].desc;
  document.getElementById("photoNum").innerText = `${currentPhoto + 1}/6`;
  if (currentPhoto === 5) document.getElementById("btnNextGallery").style.display = "inline-block";
}
function nextPhoto() { if (currentPhoto < 5) { currentPhoto++; updateGallery(); } }
function prevPhoto() { if (currentPhoto > 0) { currentPhoto--; updateGallery(); } }

/* ---- SURAT TYPING ---- */
function typeWriter() {
  if (i < pesanSurat.length) {
    document.getElementById("typedText").innerHTML += pesanSurat.charAt(i);
    i++;
    setTimeout(typeWriter, 40);
  }
}

/* ---- LOGIKA TOMBOL CONFESS ---- */
function shrinkNoBtn() {
  yesScale += 0.35;
  noScale -= 0.18;
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");

  btnYes.style.transform = `scale(${yesScale})`;
  btnNo.style.transform = `scale(${Math.max(noScale, 0.1)})`;
  if (noScale <= 0.2) btnNo.style.opacity = "0.2";
}

function acceptedConfess() {
  alert("YEAYYYY! I love you so much! ❤️💐 Terima kasih udah mau jadi pacar aku!");
}
