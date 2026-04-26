// ─── DOM ─────────────────────────────────────────────────────────
const container   = document.querySelector("#api-resultados");
const estadoEl    = document.querySelector("#api-estado");
const vacioEl     = document.querySelector("#api-vacio");
const inputBusq   = document.querySelector("#busqueda-api");
const hintEl      = document.querySelector("#buscador-hint");

// ─── ESTADO GLOBAL ───────────────────────────────────────────────
let datosCache = [];    // cache de datos para filtrar localmente

// ─── HELPERS DE ESTADO VISUAL ────────────────────────────────────
const mostrarBuscando = (msg = "Buscando las especies de gatos...") => {
  container.innerHTML = "";
  vacioEl.style.display = "none";
  estadoEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><span>${msg}</span></div>`;
};

const mostrarError = (msg) => {
  container.innerHTML = "";
  vacioEl.style.display = "none";
  estadoEl.innerHTML = `<div class="error-box"><span class="error-icon">❌</span><p>${msg}</p><button class="btn-retry" onclick="cargarGatos()">Reintentar</button></div>`;
};

const mostrarVacio = (msg = "No se encontraron resultados") => {
  container.innerHTML = "";
  estadoEl.innerHTML = "";
  vacioEl.style.display = "block";
};

const limpiarEstado = () => {
  estadoEl.innerHTML = "";
  vacioEl.style.display = "none";
};

// ═══════════════════════════════════════════════════════════════════
// API 1: RICK AND MORTY
// rickandmortyapi.com/api/character
// ═══════════════════════════════════════════════════════════════════

const cargarGatos = async () => {
  mostrarBuscando("Cargando las diferentes razas de gatos...");

  try {
    // (a) función async + fetch
  const response = await fetch(
  "https://api.thecatapi.com/v1/breeds"
);

    // (b) verificar response.ok
    if (!response.ok) throw new Error(`Error de red: ${response.status}`);

    const data = await response.json();
    datosCache = data;

    renderGatos(datosCache);

  } catch (error) {
    // (f) mostrar error visible
    mostrarError(`No se pudieron cargar las razas de gatos: ${error.message}`);
  }
};

const renderGatos = (lista) => {
  if (lista.length === 0) { mostrarVacio(); return; }
  limpiarEstado();

  // (e) renderizar con .map()
container.innerHTML = lista.map(p => `

  <article class="api-card-result gatos-card">

    <img 
         src="${p.reference_image_id 
  ? `https://cdn2.thecatapi.com/images/${p.reference_image_id}.jpg`
  : ''}"
      alt="${p.name}" 
      class="api-card-img"
      loading="lazy"
    >
 

    <div class="api-card-body">

      <h3>${p.name}</h3>

      <p class="api-card-detail">
        🌍 ${p.origin}
      </p>

      <p class="api-card-meta">
        🐱 ${p.temperament}
      </p>

      <p class="api-card-meta">
        ⏳ ${p.life_span} años
      </p>

    </div>

  </article>

`).join("");
};

const buscarGatos = (texto) => {

const filtrados = datosCache.filter(p =>

  (p.name).toLowerCase().includes(texto) ||

  (p.origin).toLowerCase().includes(texto) ||

  (p.temperament).toLowerCase().includes(texto)

);

  renderGatos(filtrados);

};


// ═══════════════════════════════════════════════════════════════════
// BUSCADOR DINÁMICO — addEventListener("input")
// ═══════════════════════════════════════════════════════════════════

inputBusq.addEventListener("input", (e) => {
  const texto = e.target.value.trim().toLowerCase();

  // Si está vacío, mostrar todos
  if (texto.length === 0) {
    hintEl.textContent = "Escribí al menos 3 caracteres";
    hintEl.style.display = "block";
    renderGatos(datosCache);
    return;
  }

  // No buscar con menos de 3 caracteres
  if (texto.length < 3) {
    hintEl.textContent = `Escribí ${3 - texto.length} caracter${3 - texto.length !== 1 ? 'es' : ''} más...`;
    hintEl.style.display = "block";
    return;
  }

  hintEl.style.display = "none";

  buscarGatos(texto);
});

// ═══════════════════════════════════════════════════════════════════
// INICIALIZAR
// ═══════════════════════════════════════════════════════════════════
cargarGatos();

