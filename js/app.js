/* ================= DATOS BASE ================= */
const servicios = [
  { id: 1, nombre: "Desarrollo Web", descripcion: "Creación de páginas web modernas y responsivas para empresas y emprendedores.", imagen: "img/desarrollo-web.png" },
  { id: 2, nombre: "Marketing Digital", descripcion: "Estrategias para mejorar tu presencia en redes sociales y atraer clientes.", imagen: "img/marketing.png" },
  { id: 3, nombre: "Curso de Inteligencia Artificial", descripcion: "Aprende los fundamentos de IA y machine learning desde cero.", imagen: "img/IA.png" },
  { id: 4, nombre: "Servicios Cloud", descripcion: "Implementación y gestión de infraestructura en la nube.", imagen: "img/nube.png" },
  { id: 5, nombre: "Turismo Digital", descripcion: "Experiencias turísticas organizadas a través de plataformas digitales.", imagen: "img/turismo.png" },
  { id: 6, nombre: "Curso de Inglés Profesional", descripcion: "Aprende inglés y mejora tus oportunidades laborales.", imagen: "img/ingles.png" }
];

/* ================= SERVICIOS DINÁMICOS ================= */
function obtenerServiciosGuardados() {
  return JSON.parse(localStorage.getItem("serviciosExtra")) || [];
}

function obtenerTodosServicios() {
  return [...servicios, ...obtenerServiciosGuardados()];
}

/* ================= FAVORITOS ================= */
function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function agregarFavorito(id) {
  let favoritos = obtenerFavoritos();

  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    mostrarModal("⭐ Agregado a favoritos");
  } else {
    mostrarModal("⚠️ Ya está en favoritos");
  }

  refrescarVista();
}

function eliminarFavorito(id) {
  let favoritos = obtenerFavoritos();
  favoritos = favoritos.filter(f => f !== id);

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarFavoritos();
}

/* ================= MOSTRAR SERVICIOS ================= */
function mostrarServicios(limit = null) {
  const contenedor = document.getElementById("servicios");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const listaCompleta = obtenerTodosServicios();
  const lista = limit ? listaCompleta.slice(0, limit) : listaCompleta;

  const favoritos = obtenerFavoritos();

  lista.forEach(s => {
    const esFavorito = favoritos.includes(s.id);

    contenedor.innerHTML += `
      <div class="card">

        ${esFavorito ? `<span class="estrella">⭐</span>` : ""}

        <!-- Imagen clickeable -->
        <img src="${s.imagen}" alt="${s.nombre}" 
             onclick="verDetalle(${s.id})" class="img-click">

        <h3>${s.nombre}</h3>
        <p>${s.descripcion}</p>

        <!-- VER MÁS -->
        <button onclick="verDetalle(${s.id})" class="btn-ver-mas">
          Ver más
        </button>

        <button onclick="agregarFavorito(${s.id})">
          ⭐ Favorito
        </button>

        <a href="contacto.html?servicio=${encodeURIComponent(s.nombre)}" class="btn-inscribirse">
          Contactar
        </a>
      </div>
    `;
  });
}

/* ================= MOSTRAR FAVORITOS ================= */
function mostrarFavoritos() {
  const contenedor = document.getElementById("servicios");
  if (!contenedor) return;

  const favoritos = obtenerFavoritos();
  const lista = obtenerTodosServicios().filter(s => favoritos.includes(s.id));

  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No tienes favoritos aún</p>";
    return;
  }

  lista.forEach(s => {
    contenedor.innerHTML += `
      <div class="card">
        <span class="estrella">⭐</span>

        <img src="${s.imagen}" alt="${s.nombre}" 
             onclick="verDetalle(${s.id})" class="img-click">

        <h3>${s.nombre}</h3>
        <p>${s.descripcion}</p>

        <button onclick="verDetalle(${s.id})" class="btn-ver-mas">
          Ver más
        </button>

        <button onclick="eliminarFavorito(${s.id})">
          ❌ Eliminar
        </button>

        <a href="contacto.html?servicio=${encodeURIComponent(s.nombre)}" class="btn-inscribirse">
          Contactar
        </a>
      </div>
    `;
  });
}

/* ================= DETALLE ================= */
let servicioActual = null;

function verDetalle(id) {
  window.location.href = `detalle.html?id=${id}`;
}

function cargarDetalle() {
  if (!window.location.href.includes("detalle.html")) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const servicio = obtenerTodosServicios().find(s => s.id === id);
  if (!servicio) return;

  servicioActual = servicio;

  document.getElementById("detalle-nombre").textContent = servicio.nombre;
  document.getElementById("detalle-imagen").src = servicio.imagen;
  document.getElementById("detalle-descripcion").textContent = servicio.descripcion;

  const btn = document.getElementById("btn-contactar");
  btn.href = `contacto.html?servicio=${encodeURIComponent(servicio.nombre)}`;
}

function agregarFavoritoDetalle() {
  if (!servicioActual) return;
  agregarFavorito(servicioActual.id);
}

/* ================= CREAR SERVICIO ================= */
function crearServicio(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre-servicio").value.trim();
  const descripcion = document.getElementById("detalle-servicio").value.trim();
  const categoria = document.getElementById("categoria-servicio").value.trim();
  const imagenInput = document.getElementById("imagen-servicio");

  if (!nombre || !descripcion || !categoria) {
    mostrarModal("⚠️ Todos los campos son obligatorios");
    return;
  }

  const archivo = imagenInput.files[0];

  if (archivo) {
    const reader = new FileReader();

    reader.onload = function () {
      guardarServicioFinal(nombre, descripcion, categoria, reader.result);
    };

    reader.readAsDataURL(archivo);

  } else {
    guardarServicioFinal(nombre, descripcion, categoria, "img/default.png");
  }
}

function guardarServicioFinal(nombre, descripcion, categoria, imagen) {
  const nuevoServicio = {
    id: Date.now(),
    nombre,
    descripcion,
    categoria,
    imagen
  };

  const serviciosGuardados = obtenerServiciosGuardados();
  serviciosGuardados.push(nuevoServicio);

  localStorage.setItem("serviciosExtra", JSON.stringify(serviciosGuardados));

  mostrarModal("✅ Servicio creado correctamente");

  document.querySelector(".formulario-crear")?.reset();
}

/* ================= PREVIEW IMAGEN ================= */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("imagen-servicio");
  const preview = document.getElementById("preview-img");

  if (!input || !preview) return;

  input.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };

      reader.readAsDataURL(file);
    }
  });
});

/* ================= FORMULARIO CONTACTO ================= */
function cargarServicioEnFormulario() {
  const params = new URLSearchParams(window.location.search);
  const servicio = params.get("servicio");

  const input = document.getElementById("servicio");
  const select = document.getElementById("servicio-select");

  if (!input || !select) return;

  if (servicio) {
    input.style.display = "block";
    select.style.display = "none";
    input.value = servicio;
  } else {
    input.style.display = "none";
    select.style.display = "block";

    select.innerHTML = `<option value="">Seleccione un servicio</option>`;

    obtenerTodosServicios().forEach(s => {
      select.innerHTML += `<option value="${s.nombre}">${s.nombre}</option>`;
    });
  }
}

function enviarFormulario(e) {
  e.preventDefault();
  mostrarModal("✅ Solicitud enviada correctamente");
  document.querySelector(".formulario")?.reset();
}

/* ================= MODAL ================= */
function mostrarModal(mensaje) {
  const modal = document.getElementById("modal");
  const texto = document.getElementById("modal-text");

  if (!modal || !texto) return;

  texto.textContent = mensaje;
  modal.style.display = "flex";
}

function cerrarModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.style.display = "none";
}

window.addEventListener("click", e => {
  const modal = document.getElementById("modal");
  if (e.target === modal) cerrarModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") cerrarModal();
});

/* ================= MENÚ ================= */
function toggleMenu() {
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".menu-toggle");

  if (menu && toggle) {
    menu.classList.toggle("active");
    toggle.classList.toggle("active");
  }
}

/* ================= UTIL ================= */
function refrescarVista() {
  if (window.location.href.includes("favoritos.html")) {
    mostrarFavoritos();
  } else if (window.location.href.includes("servicios.html")) {
    mostrarServicios();
  } else {
    mostrarServicios(3);
  }
}

/* ================= INIT ================= */
function init() {

  cargarServicioEnFormulario();
  cargarDetalle(); //clave

  if (window.location.href.includes("favoritos.html")) {
    mostrarFavoritos();
    return;
  }

  if (!document.getElementById("servicios")) return;

  if (window.location.href.includes("servicios.html")) {
    mostrarServicios();
  } else {
    mostrarServicios(3);
  }
}

document.addEventListener("DOMContentLoaded", init);