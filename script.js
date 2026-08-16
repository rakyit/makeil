const truePassword = "JUNE 17"; // Password slide 1
const pesanSurat = "Aku gak tau harus mulai dari mana, karena honestly, aku masih suka heran gimana kita bisa sampai di titik ini. Pdhl kita dulu cuman jadi temen saling cerita soal orang yang kita sayang, saling dengerin cerita masing-masing, sampai akhirnya somehow orang yang dulu cuma jadi tempat cerita malah jadi orang yang paling aku sayang. Aku juga gak pernah nyangka bakal secepat ini bisa sayang sama kamu setelah semua yang kemarin. I thought I’d need more time to trust someone again, tapi ternyata sama kamu semuanya datang naturally. Aku gak pernah ngerasa harus maksa diri buat sayang sama kamu. It just happened, and somehow it feels right. Aku suka cara kamu sayang sama aku. Cara kamu nanyain kabarku, khawatirin aku, dengerin aku, sampai hal-hal kecil yang mungkin menurut kamu biasa aja tapi berarti banget buat aku. Makasih udah percaya sama aku. Makasih udah berani sayang sama aku sebesar ini. Makasih juga karena kamu bikin aku ngerasa aman buat buka hati lagi. Kamu gak perlu jadi siapa-siapa selain diri kamu sendiri buat bisa dicintai sama aku. You deserve to be loved, fully and sincerely, and I want to be someone who gives you that..";

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
const targetWords = ["DIMSUM", "MANIS", "SAYANG", "CINTA", "BABY", "MAKAIO"];
let foundWords = [];

// Grid 8x8 variatif
const gridData = [
  'D','S','M','A','P','O','S','C',
  'I','M','A','A','M','U','O','I',
  'M','Y','K','P','N','O','N','N',
  'S','W','A','A','K','I','L','T',
  'U','N','I','N','I','A','S','A',
  'M','G','O','G','E','E','O','L',
  'X','M','S','A','Y','A','N','G',
  'C','B','A','B','Y','E','H','K'
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
            alert("HAHAHAAA Sayangku Kerennnn, prouddddddd");
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
        alert(`HEBATNYA ADEK, Mam ya siwi kukisnya`);
        nextSlide('slide4');
      } else {
        alert(`YAHHH pAYAHHH Cuma dapet ${score}/7 cookie. Coba lagi!!`);
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
  document.getElementById("confessTitle").innerText = "YESS AKHIRNYA KITA OFFICIAL YAHAHAHAHAHAHAHAHA";
  document.getElementById("confessSub").innerText = " setelah sekian lama sayang-sayangan tanpa status, welcome to my boyfriend era REALLLL";
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
