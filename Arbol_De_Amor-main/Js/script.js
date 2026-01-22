//© Zero - Código libre no comercial

// Configuración y utilidades
const config = {
  drawDuration: 1200,
  drawDelay: 80,
  scaleDuration: 1200,
  typingSpeed: 45,
  typingNewlineDelay: 350,
  signatureDelay: 600,
  relationshipStart: new Date('2025-01-01T00:00:00')
};

function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Cargar y animar el SVG del árbol
function loadAndAnimateTree() {
  fetch('Img/arbolazul.svg')
    .then(res => {
      if (!res.ok) throw new Error('No se pudo cargar el SVG');
      return res.text();
    })
    .then(svgText => {
      const container = document.getElementById('tree-container');
      container.innerHTML = svgText;
      const svg = container.querySelector('svg');
      if (!svg) {
        console.error('No se encontró el elemento SVG');
        return;
      }

      animateTreeDrawing(svg);
    })
    .catch(err => {
      console.error('Error cargando el árbol:', err);
    });
}

// Animar el efecto de "dibujo" del árbol
function animateTreeDrawing(svg) {
  const allPaths = Array.from(svg.querySelectorAll('path'));
  
  // Preparar paths para animación
  allPaths.forEach(path => {
    path.style.stroke = '#222';
    path.style.strokeWidth = '2.5';
    path.style.fillOpacity = '0';
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.transition = 'none';
  });

  // Iniciar animación
  setTimeout(() => {
    allPaths.forEach((path, i) => {
      const delay = i * config.drawDelay;
      path.style.transition = `stroke-dashoffset ${config.drawDuration}ms cubic-bezier(.77,0,.18,1) ${delay}ms, fill-opacity 0.5s ${900 + delay}ms`;
      path.style.strokeDashoffset = 0;
      
      setTimeout(() => {
        path.style.fillOpacity = '1';
        path.style.stroke = '';
        path.style.strokeWidth = '';
      }, config.drawDuration + delay);
    });

    // Animar corazones
    animateHearts(allPaths);
    
    // Continuar con el resto de animaciones
    const totalDuration = config.drawDuration + (allPaths.length - 1) * config.drawDelay + 500;
    setTimeout(() => {
      svg.classList.add('move-and-scale');
      
      setTimeout(() => {
        showDedicationText();
        startFloatingObjects();
        showAnniversaryCounter();
        playBackgroundMusic();
      }, config.scaleDuration);
    }, totalDuration);
  }, 50);
}

// Animar los corazones del árbol
function animateHearts(allPaths) {
  const heartPaths = allPaths.filter(el => {
    const style = el.getAttribute('style') || '';
    return style.includes('#FC6F58') || style.includes('#C1321F');
  });
  
  heartPaths.forEach(path => {
    path.classList.add('animated-heart');
  });
}

// Efecto de escritura para la dedicatoria
function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text = `Nylle, alegra mis días cada vez más y más, no se imagina lo mucho que la amo y lo feliz que me hace tener una persona tan INCREÍBLE a mi lado. Gracias por siempre estar para mí y seguirme en todas mis locuras. Yo sé que no le pediría a Dios nada porque con usted lo tengo todo. La amo ❤️‍🔥`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      const delay = text[i - 2] === '\n' ? config.typingNewlineDelay : config.typingSpeed;
      setTimeout(type, delay);
    } else {
      setTimeout(() => {
        showSignature();
        showPhotoGallery();
      }, config.signatureDelay);
    }
  }
  type();
}

// Mostrar firma animada
function showSignature() {
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  
  const firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con todo mi corazón, Cris.";
  signature.classList.add('visible');
}

// Galería de fotos animada
function showPhotoGallery() {
  const galleryBtn = document.getElementById('gallery-btn');
  if (!galleryBtn) return;
  
  setTimeout(() => {
    galleryBtn.classList.add('visible');
  }, 800);
  
  galleryBtn.onclick = () => {
    const modal = document.getElementById('photo-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    initializeGallery();
  };
}

function initializeGallery() {
  const closeBtn = document.querySelector('.close-modal');
  const modal = document.getElementById('photo-modal');
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  const photoDisplay = document.querySelector('.photo-display');
  const caption = document.querySelector('.photo-caption');
  const counter = document.querySelector('.photo-counter');
  
  // Array de fotos (puedes agregar más)
  const photos = [
    { src: 'photos/foto1.jpg', caption: 'Nuestro primer momento juntos 💕' },
    { src: 'photos/foto2.jpg', caption: 'Ese día que me hiciste tan feliz ❤️' },
    { src: 'photos/foto3.jpg', caption: 'Siempre sonriendo a tu lado 😊' },
    { src: 'photos/foto4.jpg', caption: 'Cada momento es especial contigo 🌟' },
    { src: 'photos/foto5.jpg', caption: 'Te amo más cada día 💖' }
  ];
  
  let currentIndex = 0;
  
  function updatePhoto() {
    photoDisplay.style.opacity = '0';
    setTimeout(() => {
      photoDisplay.src = photos[currentIndex].src;
      caption.textContent = photos[currentIndex].caption;
      counter.textContent = `${currentIndex + 1} / ${photos.length}`;
      photoDisplay.style.opacity = '1';
    }, 300);
  }
  
  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updatePhoto();
  };
  
  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % photos.length;
    updatePhoto();
  };
  
  closeBtn.onclick = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };
  
  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'Escape') closeBtn.click();
  });
  
  updatePhoto();
}

// Objetos flotantes (pétalos/corazones)
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  
  function spawn() {
    const el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Continuar generando objetos
    const nextDelay = count++ < 32 ? 350 + Math.random() * 500 : 1200 + Math.random() * 1200;
    setTimeout(spawn, nextDelay);
  }
  
  spawn();
}

// Contador de aniversario mejorado
function showAnniversaryCounter() {
  const container = document.getElementById('countdown');
  const startParam = getURLParam('start');
  const startDate = startParam ? new Date(startParam + 'T00:00:00') : config.relationshipStart;
  
  function calculateTimeTogether(start, now) {
    // Calcular total de días
    const diff = now - start;
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Calcular años, meses y días de forma precisa
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    
    // Ajustar si los días son negativos
    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    // Ajustar si los meses son negativos
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { totalDays, years, months, days };
  }
  
  function update() {
    const now = new Date();
    const time = calculateTimeTogether(startDate, now);
    
    let message = '';
    if (time.years > 0) {
      message = `🎉 ¡${time.years} ${time.years === 1 ? 'año' : 'años'} juntos! 🎉<br>`;
      if (time.months > 0 || time.days > 0) {
        message += `Y ${time.months} ${time.months === 1 ? 'mes' : 'meses'} y ${time.days} ${time.days === 1 ? 'día' : 'días'}<br>`;
      }
    } else if (time.months > 0) {
      message = `Llevamos juntos: <b>${time.months}</b> ${time.months === 1 ? 'mes' : 'meses'} y <b>${time.days}</b> ${time.days === 1 ? 'día' : 'días'}<br>`;
    } else if (time.totalDays > 0) {
      message = `Llevamos juntos: <b>${time.totalDays}</b> ${time.totalDays === 1 ? 'día' : 'días'}<br>`;
    } else {
      message = `¡Hoy comenzamos nuestra historia! 💕<br>`;
    }
    
    message += `<span style="font-size: 0.9em; opacity: 0.9;">💕 ${time.totalDays} días de amor 💕</span>`;
    
    container.innerHTML = message;
    container.classList.add('visible');
  }
  
  update();
  setInterval(update, 1000);
}

// Control de música de fondo
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;
  
  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = createMusicButton();
  }
  
  audio.volume = 0.6;
  audio.loop = true;
  
  // Intentar reproducir automáticamente
  audio.play()
    .then(() => {
      btn.textContent = '🔊 Música';
    })
    .catch(() => {
      btn.textContent = '▶️ Música';
    });
  
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

function createMusicButton() {
  const btn = document.createElement('button');
  btn.id = 'music-btn';
  btn.textContent = '🔊 Música';
  
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '18px',
    right: '18px',
    zIndex: '99',
    background: 'rgba(255,255,255,0.9)',
    border: '2px solid rgba(252,111,88,0.3)',
    borderRadius: '24px',
    padding: '12px 20px',
    fontSize: '1.1em',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease'
  });
  
  btn.onmouseenter = () => {
    btn.style.transform = 'scale(1.05)';
    btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
  };
  
  btn.onmouseleave = () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  };
  
  document.body.appendChild(btn);
  return btn;
}

// Inicializar todo cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  loadAndAnimateTree();
  playBackgroundMusic();
});

// Manejar errores globales
window.addEventListener('error', (e) => {
  console.error('Error en la página:', e.error);
});