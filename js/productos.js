// ─── DATOS: Array de 8 productos ─────────────────────────────────
const productos = [
  { id: 1, nombre: "Unanimo Party",             precio: 30500,  categoria: "Familiar", enStock: true,  emoji: "🎉" },
  { id: 2, nombre: "Masomenos",                 precio: 51500,  categoria: "Familiar", enStock: true,  emoji: "🤔" },
  { id: 3, nombre: "Catan",                     precio: 111500, categoria: "Experto",  enStock: false, emoji: "🏝️" },
  { id: 4, nombre: "Buscadores de Unicornios",  precio: 29700,  categoria: "Infantil", enStock: true,  emoji: "🦄" },
  { id: 5, nombre: "Carcassonne",                precio: 47500,  categoria: "Experto",  enStock: true,  emoji: "🏰" },
  { id: 6, nombre: "Dodo",                      precio: 81500,  categoria: "Infantil", enStock: true,  emoji: "🐦" },
  { id: 7, nombre: "La gran siete",             precio: 29000,  categoria: "Familiar", enStock: true,  emoji: "7️⃣" },
  { id: 8, nombre: "Azul",                      precio: 115000, categoria: "Experto",  enStock: false, emoji: "🟦" },
];


// ─── SELECCIONAR ELEMENTOS DEL DOM ───────────────────────────────
const container     = document.querySelector("#productos-lista");
const vacioMsg      = document.querySelector("#productos-vacio");
const busqueda      = document.querySelector("#busqueda");
const categoria     = document.querySelector("#categoria");
const precio        = document.querySelector("#precio");
const precioValor   = document.querySelector("#precio-valor");
const stock         = document.querySelector("#stock");
const contadorEl    = document.querySelector("#contador-productos");
const btnReset      = document.querySelector("#btn-reset");

// ─── RENDERIZAR PRODUCTOS CON .map() + innerHTML ─────────────────
const renderProductos = (lista) => {
  if (lista.length === 0) {
    container.innerHTML = "";
    vacioMsg.style.display = "block";
    contadorEl.textContent = "0 productos";
    return;
  }

  vacioMsg.style.display = "none";
  contadorEl.textContent = `${lista.length} producto${lista.length !== 1 ? "s" : ""}`;

  // .map() genera el HTML de cada tarjeta
  container.innerHTML = lista.map(p => `
    <article class="producto-card ${!p.enStock ? "sin-stock" : ""}">
      <span class="producto-emoji">${p.emoji}</span>
      <div class="producto-nombre">${p.nombre}</div>
      <div class="producto-precio">$${p.precio}</div>
      <span class="producto-cat">${p.categoria}</span>
      <div class="producto-stock">${p.enStock ? "✅ En stock" : "❌ Sin stock"}</div>
    </article>
  `).join("");
};

// ─── FILTRAR PRODUCTOS — Encadena .filter() por cada criterio ────
const filtrarProductos = () => {
  const texto    = busqueda.value.toLowerCase();
  const cat      = categoria.value;
  const maxPrice = Number(precio.value);
  const soloStock = stock.checked;

  // CHAINING: filter → filter → filter → filter
  const resultado = productos
    .filter(p => p.nombre.toLowerCase().includes(texto))    // búsqueda por nombre
    .filter(p => cat === "todas" || p.categoria === cat)     // filtro por categoría
    .filter(p => p.precio <= maxPrice)                       // filtro por precio
    .filter(p => !soloStock || p.enStock);                   // filtro por stock

  renderProductos(resultado);
};

// ─── ACTUALIZAR VALOR DEL RANGE ──────────────────────────────────
precio.addEventListener("input", () => {
  precioValor.textContent = precio.value;
});

// ─── ESCUCHAR TODOS LOS FILTROS ──────────────────────────────────
// Cada vez que un filtro cambia, se vuelve a filtrar y renderizar
busqueda.addEventListener("input", filtrarProductos);
categoria.addEventListener("change", filtrarProductos);
precio.addEventListener("input", filtrarProductos);
stock.addEventListener("change", filtrarProductos);

// ─── BOTÓN RESET ─────────────────────────────────────────────────
btnReset.addEventListener("click", () => {
  busqueda.value = "";
  categoria.value = "todas";
  precio.value = 115000;
  precioValor.textContent = "115000";
  stock.checked = false;
  filtrarProductos();
});

// ─── INICIALIZAR ─────────────────────────────────────────────────
renderProductos(productos);
