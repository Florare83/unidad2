// ─── SELECCIONAR ELEMENTOS DEL DOM ───────────────────────────────
const form      = document.querySelector("#form-tarea");
const input     = document.querySelector("#input-tarea");
const lista     = document.querySelector("#lista-tareas");
const contador  = document.querySelector("#contador");
const vacioMsg  = document.querySelector("#todo-vacio");
const filtros   = document.querySelectorAll(".todo-filtro-btn");

let filtroActivo = "todas";

// ─── ACTUALIZAR CONTADOR DINÁMICO ────────────────────────────────
const actualizarContador = () => {
  const total     = lista.querySelectorAll("li").length;
  const pendientes = lista.querySelectorAll("li:not(.completada)").length;
  contador.textContent = `${pendientes} pendiente${pendientes !== 1 ? "s" : ""}`;

  // Mostrar/ocultar mensaje vacío
  vacioMsg.style.display = total === 0 ? "block" : "none";
};

// ─── APLICAR FILTRO VISUAL ───────────────────────────────────────
const aplicarFiltro = () => {
  const tareas = lista.querySelectorAll("li");
  tareas.forEach(li => {
    const completada = li.classList.contains("completada");
    if (filtroActivo === "todas") {
      li.style.display = "flex";
    } else if (filtroActivo === "pendientes") {
      li.style.display = completada ? "none" : "flex";
    } else if (filtroActivo === "completadas") {
      li.style.display = completada ? "flex" : "none";
    }
  });
};

// ─── AGREGAR TAREA (submit + preventDefault) ─────────────────────
form.addEventListener("submit", (e) => {
  e.preventDefault();    // evitar que recargue la página

  const texto = input.value.trim();
  if (!texto) return;    // NO agregar tarea vacía

  // Crear elemento <li> con createElement
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="tarea-texto">${texto}</span>
    <div class="tarea-acciones">
      <button class="btn-completar" title="Completar">✓</button>
      <button class="btn-eliminar" title="Eliminar">✕</button>
    </div>
  `;

  // ─── Botón COMPLETAR: classList.toggle("completada") ───────
  li.querySelector(".btn-completar").addEventListener("click", () => {
    li.classList.toggle("completada");
    actualizarContador();
    aplicarFiltro();
  });

  // ─── Botón ELIMINAR: .remove() ─────────────────────────────
  li.querySelector(".btn-eliminar").addEventListener("click", () => {
    li.style.transition = "all 0.3s ease";
    li.style.opacity = "0";
    li.style.transform = "translateX(50px)";
    setTimeout(() => {
      li.remove();
      actualizarContador();
      aplicarFiltro();
    }, 300);
  });

  // Animación de entrada
  li.style.opacity = "0";
  li.style.transform = "translateY(-10px)";
  lista.appendChild(li);
  requestAnimationFrame(() => {
    li.style.transition = "all 0.3s ease";
    li.style.opacity = "1";
    li.style.transform = "translateY(0)";
  });

  // Limpiar input y enfocar
  input.value = "";
  input.focus();
  actualizarContador();
  aplicarFiltro();
});

// ─── FILTROS (Todas / Pendientes / Completadas) ──────────────────
filtros.forEach(btn => {
  btn.addEventListener("click", () => {
    filtros.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    filtroActivo = btn.dataset.filtro;
    aplicarFiltro();
  });
});

// ─── INICIALIZAR ─────────────────────────────────────────────────
actualizarContador();
