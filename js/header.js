/*
  JS: usamos IntersectionObserver para detectar cuándo la .hero sale de la vista.
  Cuando la .hero deja de intersectar la ventana, mostramos el header sticky.
*/
document.addEventListener('DOMContentLoaded', function () {
  const hero = document.querySelector('.hero');
  const headerOver = document.querySelector('.header--over');
  const headerSticky = document.querySelector('.header--sticky');

  // Manejo de foco/tabuabilidad: desactivar tabIndex en el header oculto
  function setHeaderFocusable(header, focusable) {
    const controls = header.querySelectorAll('a, button, [tabindex]');
    controls.forEach(el => {
      if (!focusable) {
        // guardamos valor anterior (si lo hay) y ponemos -1 para que no reciba tab
        el.dataset._oldtab = el.getAttribute('tabindex') || '';
        el.setAttribute('tabindex', '-1');
      } else {
        if (el.dataset._oldtab === '') el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', el.dataset._oldtab);
        delete el.dataset._oldtab;
      }
    });
  }

  // Mostrar/ocultar y actualizar atributos aria
  function toggleHeaders(showSticky) {
    if (showSticky) {
      headerOver.classList.add('hidden');
      headerOver.setAttribute('aria-hidden', 'true');
      headerSticky.classList.add('visible');
      headerSticky.setAttribute('aria-hidden', 'false');
      setHeaderFocusable(headerOver, false);
      setHeaderFocusable(headerSticky, true);
      document.body.classList.add('has-sticky'); // añade padding-top al main
    } else {
      headerOver.classList.remove('hidden');
      headerOver.setAttribute('aria-hidden', 'false');
      headerSticky.classList.remove('visible');
      headerSticky.setAttribute('aria-hidden', 'true');
      setHeaderFocusable(headerOver, true);
      setHeaderFocusable(headerSticky, false);
      document.body.classList.remove('has-sticky');
    }
  }

  // Observador (lo recreamos si cambia el tamaño de header)
  let observer = null;
  function createObserver() {
    // calcular altura del sticky para que la aparición sea justo cuando la hero "sale"
    const stickyHeight = headerSticky.getBoundingClientRect().height || 56;
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // entry.isIntersecting === true -> hero visible -> NO sticky
        // si NO intersecta -> hero fuera -> mostramos sticky
        toggleHeaders(!entry.isIntersecting);
      });
    }, {
      root: null,
      threshold: 0,
      rootMargin: `-${stickyHeight}px 0px 0px 0px` // ajusta el punto en que aparece el sticky
    });
    observer.observe(hero);
  }

  // simple debounce para resize
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // inicializamos
  setHeaderFocusable(headerSticky, false); // al cargar, sticky no debería ser focusable
  setHeaderFocusable(headerOver, true);
  createObserver();

  // recalc on resize (si cambia la altura del sticky)
  window.addEventListener('resize', debounce(createObserver, 120));
});












//SCIPT PARA VER MAS
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".exp-btn");
  const content = document.querySelector(".exp-content");

  btn.addEventListener("click", () => {
    content.classList.toggle("active");
    btn.textContent = content.classList.contains("active") ? "Ver menos" : "Ver más";
  });
});



//SCRIT CARROUSEL
const wrapper = document.querySelector('.carousel-wrapper');
let isDown = false;
let startX;
let scrollLeft;
let isDragging = false;

// Evitar arrastrar imágenes de forma nativa
const images = document.querySelectorAll('.carousel-slide img');
images.forEach(img => {
  img.setAttribute('draggable', 'false');
  img.addEventListener('dragstart', e => e.preventDefault());
});

// Drag horizontal
wrapper.addEventListener('mousedown', (e) => {
  // no bloquear botones
  if (e.target.closest('.carousel-btn')) return;

  isDown = true;
  isDragging = false;
  wrapper.classList.add('active');
  startX = e.pageX;
  scrollLeft = wrapper.scrollLeft;
});

wrapper.addEventListener('mouseup', (e) => {
  if (!isDown) return;
  isDown = false;
  wrapper.classList.remove('active');

  // Detectar clic sin arrastre en imagen
  if (!isDragging) {
    const img = e.target.closest('.carousel-slide img');
    if (img) openLightbox(img.src);
  }
});

wrapper.addEventListener('mouseleave', () => {
  isDown = false;
  wrapper.classList.remove('active');
});

wrapper.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  isDragging = true;
  const x = e.pageX;
  const walk = x - startX;
  wrapper.scrollLeft = scrollLeft - walk;
});

// --- Botones carrusel ---
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const slide = document.querySelector('.carousel-slide');

if (prevBtn && nextBtn && slide) {
  const slideWidth = slide.offsetWidth + 15; // ancho + gap

  prevBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: -slideWidth, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: slideWidth, behavior: 'smooth' });
  });
}

// --- Lightbox ---
const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
document.body.appendChild(lightbox);

const lightboxImg = document.createElement('img');
lightbox.appendChild(lightboxImg);

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('active');
}

lightbox.addEventListener('click', (e) => {
  if (e.target !== lightboxImg) {
    lightbox.classList.remove('active');
  }
});
