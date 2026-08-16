// Teks pesan confess kamu (bisa diubah sesuai keinginan)
const teksPesan = "Dari pertama kenal, aku udah ngerasa kamu beda. Mau gak kamu jalanin hari-hari kedepan bareng aku? ❤️";
let i = 0;

// Efek Mengetik Otomatis
function typeWriter() {
  if (i < teksPesan.length) {
    document.getElementById("message").innerHTML += teksPesan.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
}

// Fungsi saat tombol "Buka Pesan" diklik
function bukaPesan() {
  // Putar musik jika ada file lagu.mp3
  const music = document.getElementById("bgMusic");
  if (music) {
    music.play().catch(() => {});
  }

  document.getElementById("title").innerText = "Untuk Kamu ✨";
  document.getElementById("message").innerText = ""; 
  document.getElementById("btnOpen").style.display = "none";
  document.getElementById("btnNo").style.display = "none";
  
  typeWriter();
}

// Fungsi tombol "Nggak Mau" kabur
function kabur() {
  const btnNo = document.getElementById("btnNo");
  const x = Math.floor(Math.random() * (window.innerWidth - 100));
  const y = Math.floor(Math.random() * (window.innerHeight - 50));
  
  btnNo.style.left = x + "px";
  btnNo.style.top = y + "px";
}

// Pembuat Efek Kelopak Bunga Jatuh
function createPetal() {
  const container = document.getElementById('petals-container');
  if (!container) return;
  
  const petal = document.createElement('div');
  petal.classList.add('petal');
  
  const size = Math.random() * 15 + 10;
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.animationDuration = `${Math.random() * 3 + 2}s`;
  
  container.appendChild(petal);
  setTimeout(() => petal.remove(), 5000);
}

setInterval(createPetal, 300);