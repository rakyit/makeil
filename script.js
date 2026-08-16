const truePassword = "kamu"; // Password slide 1
const pesanSurat = "Makasih ya udah mau ngeluangin waktu buat maenin game dan liat foto-foto kita. Dari awal kenal sampai sekarang, kehadiran kamu selalu jadi hal manis buat aku. Makanya hari ini aku pengen jujur sama kamu...";

// Data Foto (Pastikan foto1.jpg s/d foto6.jpg sudah di-upload ke GitHub)
const photos = [
  { src: "foto1.jpg", desc: "Momen favorit pertama bareng kamu 💖" },
  { src: "foto2.jpg", desc: "Lucu banget ekspresi kamu di sini 🥰" },
  { src: "foto3.jpg", desc: "Kenangan manis yang gak bakal aku lupain ✨" },
  { src: "foto4.jpg", desc: "Selalu suka kalau ngeliat foto ini 📸" },
  { src: "foto5.jpg", desc: "Hari dimana kita banyak ketawa bareng 😂" },
  { src: "foto6.jpg", desc: "Foto terindah bareng orang paling favorit ❤️" }
];

let currentPhoto = 0;
let score = 0;
let timeLeft = 10;
let gameInterval, timerInterval;
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
  if (slideId === 'slide3') startGame(); else stopGame();
  if (slideId === 'slide5') updateGallery();
  if (slideId === 'slide6' && !isTyped) { typeWriter(); isTyped = true; }
}

function checkPassword() {
  const input = document.getElementById("passInput").value.toLowerCase().trim();
  if (input === truePassword) nextSlide('slide2');
  else document.getElementById("errorMsg").innerText = "Salah dong, coba lagi! 😜";
}

/* ---- GAME 1: CARI 6 KATA (LOGIKA FIX TANPA STUCK) ---- */
const targetWords = ["DUBAI", "MANIS", "SAYANG", "CINTA", "COOKIE", "KAMU"];
let foundWords = [];

// Grid 8x8 variatif
const gridData = [
  'D','S','M','A','N','I','S','C',
  'U','A','K','A','M','U','O','I',
  'B','Y','Y','P','Q','O','N','N',
  'A','A','A','A','K','T','L','T',
  'I','N','N','N','I','A','T','A',
  'R','G','G','G','E','E','O','L',
  'X','M','S','A','Y','A','N','G',
  'C','O','O','K','I','E','H','K'
];

function initWordSearch() {
  const container = document.getElementById("word-grid");
  container.innerHTML = "";
  foundWords = [];

  targetWords.forEach(w => {
    const el = document.getElementById(`target-${w}`);
    if (el) el.classList.remove("found");
  });

  gridData.forEach((char) => {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.innerText = char;

    cell.onclick = () => {
      cell.classList.toggle("selected");
      checkWords();
    };
    container.appendChild(cell);
  });
}

function checkWords() {
  // Ambil semua kotak yang sedang dipilih
  const selectedCells = Array.from(document.querySelectorAll(".grid-cell.selected"));
  const selectedText = selectedCells.map(c => c.innerText).join("");

  targetWords.forEach(word => {
    if (!foundWords.includes(word)) {
      // Cek apakah huruf-huruf kata tersebut terkandung di dalam kotak yang diklik
      let match = true;
      let tempText = selectedText;

      for (let char of word) {
        if (tempText.includes(char)) {
          tempText = tempText.replace(char, ""); // Hapus huruf yang sudah cocok untuk pengujian
        } else {
          match = false;
          break;
        }
      }

      // Jika cocok, tandai kata sebagai ditemukan dan coret tag-nya
      if (match && selectedText.length >= word.length) {
        foundWords.push(word);
        const wordTag = document.getElementById(`target-${word}`);
        if (wordTag) wordTag.classList.add("found");

        // Jika 6 kata sudah tercoret semua
        if (foundWords.length === targetWords.length) {
          setTimeout(() => {
            alert("WOAH HEBAT! Semua 6 kata berhasil kamu temukan! 🎉💖");
            nextSlide('slide3');
          }, 300);
        }
      }
    }
  });
}

/* ---- GAME 2: TANGKAP COOKIE EXTREME MODE ---- */
function startGame() {
  score = 0;
  timeLeft = 10;
  document.getElementById("score").innerText = score;
  document.getElementById("timer").innerText = timeLeft;

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

  stopGame();

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft <= 0) {
      stopGame();
      if (score >= 7) {
        alert(`JAGO BANGET! Kamu nangkep ${score} Dubai Cookie! 🥳✨`);
        nextSlide('slide4');
      } else {
        alert(`Waktu habis! Cuma dapet ${score}/7 cookie. Coba lagi ya! 😜`);
        startGame();
      }
    }
  }, 1000);

  gameInterval = setInterval(() => createCookie(), 300);
}

function stopGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
}

function createCookie() {
  const container = document.getElementById("game-container");
  const basket = document.getElementById("basket");
  if (!container || timeLeft <= 0) return;

  const cookie = document.createElement("div");
  cookie.classList.add("cookie");
  cookie.style.left = Math.random() * (container.clientWidth - 35) + "px";
  cookie.style.top = "0px";
  container.appendChild(cookie);

  let posY = 0;
  const fall = setInterval(() => {
    posY += 8;
    cookie.style.top = posY + "px";
    const cRect = cookie.getBoundingClientRect();
    const bRect = basket.getBoundingClientRect();

    if (cRect.bottom >= bRect.top && cRect.top <= bRect.bottom && cRect.right >= bRect.left && cRect.left <= bRect.right) {
      score++;
      document.getElementById("score").innerText = score;
      cookie.remove();
      clearInterval(fall);
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

/* ---- LOGIKA TOMBOL CONFESS & EFEK BUNGA ---- */
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
  document.getElementById("confessTitle").innerText = "YEAYYYY! I Love You! ❤️💐";
  document.getElementById("confessSub").innerText = "Makasih udah mau jadi pacar aku! ✨";
  document.getElementById("confessButtons").style.display = "none";
  
  startFlowerRain();
}

function startFlowerRain() {
  const container = document.getElementById("flowerContainer");
  const flowers = ['🌸', '🌺', '🌹', '💐', '🌷', '✨', '💖'];

  setInterval(() => {
    const flower = document.createElement("div");
    flower.classList.add("flower");
    flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = Math.random() * 100 + "vw";
    flower.style.animationDuration = (Math.random() * 2 + 2) + "s";
    container.appendChild(flower);

    setTimeout(() => flower.remove(), 4000);
  }, 100);
}
