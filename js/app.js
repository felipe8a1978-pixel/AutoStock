
/************************************************************
 * AUTOSTOCK
 * Sistema de inventario de refacciones automotrices
 *
 * Archivo: js/app.js
 * Función: Controlar la interfaz y administrar productos.
 ************************************************************/


/* ==========================================================
   1. BASE DE DATOS TEMPORAL
   ========================================================== */

// Productos de prueba.
// Posteriormente conectaremos esta información con Google Sheets.

let productos = [

    {
        id: 1,
        codigo: "REF-001",
        nombre: "Filtro de aceite",
        categoria: "Filtros",
        marca: "Bosch",
        precio: 185.00,
        stock: 25,
        minimo: 5
    },

    {
        id: 2,
        codigo: "REF-002",
        nombre: "Bujía de encendido",
        categoria: "Encendido",
        marca: "NGK",
        precio: 120.00,
        stock: 40,
        minimo: 10
    },

    {
        id: 3,
        codigo: "REF-003",
        nombre: "Balatas delanteras",
        categoria: "Frenos",
        marca: "Brembo",
        precio: 650.00,
        stock: 3,
        minimo: 5
    },

    {
        id: 4,
        codigo: "REF-004",
        nombre: "Amortiguador delantero",
        categoria: "Suspensión",
        marca: "Monroe",
        precio: 1250.00,
        stock: 12,
        minimo: 4
    },

    {
        id: 5,
        codigo: "REF-005",
        nombre: "Batería automotriz",
        categoria: "Eléctrico",
        marca: "LTH",
        precio: 1850.00,
        stock: 8,
        minimo: 3
    }

];


/* ==========================================================
   2. ELEMENTOS DEL DOCUMENTO
   ========================================================== */

const tablaProductos =
    document.getElementById("tablaProductos");

const buscarProducto =
    document.getElementById("buscarProducto");

const filtroCategoria =
    document.getElementById("filtroCategoria");

const btnNuevoProducto =
    document.getElementById("btnNuevoProducto");

const btnActualizar =
    document.getElementById("btnActualizar");


/* ==========================================================
   3. FORMATO DE MONEDA
   ========================================================== */

function formatoMoneda(valor) {

    return new Intl.NumberFormat("es-MX", {

        style: "currency",
        currency: "MXN"

    }).format(Number(valor) || 0);

}


/* ==========================================================
   4. MOSTRAR PRODUCTOS EN LA TABLA
   ========================================================== */

function mostrarProductos(lista = productos) {

    if (!tablaProductos) return;

    tablaProductos.innerHTML = "";

    if (lista.length === 0) {

        tablaProductos.innerHTML = `
            <tr>
                <td colspan="7">
                    No se encontraron productos registrados.
                </td>
            </tr>
        `;

        return;
    }


    lista.forEach(producto => {

        const fila = document.createElement("tr");

        const estadoStock =
            producto.stock <= producto.minimo
                ? "stock-bajo"
                : "stock-normal";

        fila.innerHTML = `

            <td>${producto.codigo}</td>

            <td>
                <strong>${producto.nombre}</strong>
            </td>

            <td>${producto.categoria}</td>

            <td>${producto.marca}</td>

            <td>${formatoMoneda(producto.precio)}</td>

            <td>
                <span class="stock-label ${estadoStock}">
                    ${producto.stock}
                </span>
            </td>

            <td>
                <button
                    class="btn-edit"
                    data-action="edit"
                    data-id="${producto.id}">
                    Editar
                </button>

                <button
                    class="btn-delete"
                    data-action="delete"
                    data-id="${producto.id}">
                    Eliminar
                </button>
            </td>

        `;

        tablaProductos.appendChild(fila);

    });

    actualizarResumen();

}


/* ==========================================================
   5. ACTUALIZAR RESUMEN DEL INVENTARIO
   ========================================================== */

function actualizarResumen() {

    const totalProductos = productos.length;

    const totalStock = productos.reduce(
        (total, producto) => total + Number(producto.stock),
        0
    );

    const stockBajo = productos.filter(
        producto => producto.stock <= producto.minimo
    ).length;

    const valorInventario = productos.reduce(
        (total, producto) =>
            total + (
                Number(producto.precio) *
                Number(producto.stock)
            ),
        0
    );


    document.getElementById("totalProductos").textContent =
        totalProductos;

    document.getElementById("totalStock").textContent =
        totalStock;

    document.getElementById("stockBajo").textContent =
        stockBajo;

    document.getElementById("valorInventario").textContent =
        formatoMoneda(valorInventario);

}


/* ==========================================================
   6. CARGAR CATEGORÍAS EN EL SELECTOR
   ========================================================== */

function cargarCategorias() {

    if (!filtroCategoria) return;

    const categoriaActual = filtroCategoria.value;

    const categorias = [
        ...new Set(
            productos.map(producto => producto.categoria)
        )
    ];

    filtroCategoria.innerHTML = `
        <option value="">Todas las categorías</option>
    `;

    categorias.forEach(categoria => {

        const opcion = document.createElement("option");

        opcion.value = categoria;
        opcion.textContent = categoria;

        filtroCategoria.appendChild(opcion);

    });

    filtroCategoria.value = categorias.includes(categoriaActual)
        ? categoriaActual
        : "";

}


/* ==========================================================
   7. BUSCAR PRODUCTOS
   ========================================================== */

function buscarProductos() {

    const texto = buscarProducto.value
        .trim()
        .toLowerCase();

    const categoria = filtroCategoria.value;

    const resultado = productos.filter(producto => {

        const coincideTexto = [

            producto.codigo,
            producto.nombre,
            producto.marca,
            producto.categoria

        ].some(valor =>
            String(valor).toLowerCase().includes(texto)
        );

        const coincideCategoria =
            !categoria || producto.categoria === categoria;

        return coincideTexto && coincideCategoria;

    });

    mostrarProductos(resultado);

}


/* ==========================================================
   8. ESTILOS DEL FORMULARIO
   ========================================================== */

const estilosDinamicos = document.createElement("style");

estilosDinamicos.textContent = `

    .stock-label {
        display: inline-block;
        padding: 6px 10px;
        border-radius: 20px;
        font-weight: bold;
    }

    .stock-normal {
        color: #16865a;
        background: #e4f7ed;
    }

    .stock-bajo {
        color: #d93645;
        background: #fde8eb;
    }

    .btn-edit,
    .btn-delete {
        border: none;
        padding: 7px 9px;
        margin: 2px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 11px;
    }

    .btn-edit {
        color: #1766ad;
        background: #e6f1fc;
    }

    .btn-delete {
        color: #c83240;
        background: #fde8eb;
    }

    .modal-autostock {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(10, 25, 42, .65);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15px;
    }

    .modal-content {
        width: 100%;
        max-width: 520px;
        background: white;
        padding: 28px;
        border-radius: 14px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-content h2 {
        color: #152c46;
        margin-bottom: 20px;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 7px;
    }

    .form-group.full {
        grid-column: 1 / -1;
    }

    .form-group label {
        font-size: 12px;
        font-weight: bold;
    }

    .form-group input,
    .form-group select {
        width: 100%;
        padding: 11px;
        border: 1px solid #dce3eb;
        border-radius: 6px;
        outline: none;
    }

    .form-group input:focus,
    .form-group select:focus {
        border-color: #f39c35;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 24px;
    }

    .btn-cancel {
        background: #e8edf2;
        color: #26374a;
        border: none;
        padding: 11px 16px;
        border-radius: 6px;
        cursor: pointer;
    }

    .btn-save {
        background: #f39c35;
        color: white;
        border: none;
        padding: 11px 16px;
        border-radius: 6px;
        cursor: pointer;
    }

    @media(max-width: 500px) {
        .form-grid {
            grid-template-columns: 1fr;
        }

        .form-group.full {
            grid-column: auto;
        }
    }

`;

document.head.appendChild(estilosDinamicos);


/* ==========================================================
   9. ABRIR FORMULARIO DE PRODUCTOS
   ========================================================== */

function abrirFormulario(producto = null) {

    const editando = producto !== null;

    const modal = document.createElement("div");

    modal.className = "modal-autostock";

    modal.innerHTML = `

        <div class="modal-content">

            <h2>
                ${editando ? "Editar producto" : "Nuevo producto"}
            </h2>

            <form id="formProducto">

                <div class="form-grid">

                    <div class="form-group">
                        <label>Código</label>
                        <input
                            type="text"
                            name="codigo"
                            required
                            value="${editando ? producto.codigo : ""}">
                    </div>

                    <div class="form-group">
                        <label>Nombre del producto</label>
                        <input
                            type="text"
                            name="nombre"
                            required
                            value="${editando ? producto.nombre : ""}">
                    </div>

                    <div class="form-group">
                        <label>Categoría</label>
                        <input
                            type="text"
                            name="categoria"
                            required
                            value="${editando ? producto.categoria : ""}">
                    </div>

                    <div class="form-group">
                        <label>Marca</label>
                        <input
                            type="text"
                            name="marca"
                            required
                            value="${editando ? producto.marca : ""}">
                    </div>

                    <div class="form-group">
                        <label>Precio (MXN)</label>
                        <input
                            type="number"
                            name="precio"
                            min="0"
                            step="0.01"
                            required
                            value="${editando ? producto.precio : ""}">
                    </div>

                    <div class="form-group">
                        <label>Existencias</label>
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            step="1"
                            required
                            value="${editando ? producto.stock : ""}">
                    </div>

                    <div class="form-group full">
                        <label>Stock mínimo</label>
                        <input
                            type="number"
                            name="minimo"
                            min="0"
                            step="1"
                            required
                            value="${editando ? producto.minimo : 5}">
                    </div>

                </div>

                <div class="modal-actions">

                    <button
                        type="button"
                        class="btn-cancel"
                        id="cerrarModal">
                        Cancelar
                    </button>

                    <button type="submit" class="btn-save">
                        ${editando ? "Guardar cambios" : "Registrar producto"}
                    </button>

                </div>

            </form>

        </div>

    `;

    document.body.appendChild(modal);

    const form = modal.querySelector("#formProducto");

    modal.querySelector("#cerrarModal").onclick = () => {
        modal.remove();
    };


    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const datos = Object.fromEntries(
            new FormData(form).entries()
        );

        const codigo = datos.codigo.trim();

        const codigoDuplicado = productos.some(item =>
            item.codigo.toLowerCase() === codigo.toLowerCase() &&
            (!editando || item.id !== producto.id)
        );

        if (codigoDuplicado) {
            alert("Ya existe un producto con ese código.");
            return;
        }

        const nuevoProducto = {

            id: editando ? producto.id : Date.now(),

            codigo: codigo,

            nombre: datos.nombre.trim(),

            categoria: datos.categoria.trim(),

            marca: datos.marca.trim(),

            precio: Number(datos.precio),

            stock: Number(datos.stock),

            minimo: Number(datos.minimo)

        };


        if (editando) {

            productos = productos.map(item =>
                item.id === producto.id
                    ? nuevoProducto
                    : item
            );

        } else {

            productos.push(nuevoProducto);

        }


        cargarCategorias();
        buscarProductos();

        modal.remove();

        alert(
            editando
                ? "Producto actualizado correctamente."
                : "Producto registrado correctamente."
        );

    });

}


/* ==========================================================
   10. EDITAR Y ELIMINAR PRODUCTOS
   ========================================================== */

if (tablaProductos) {

    tablaProductos.addEventListener("click", function(event) {

        const boton = event.target.closest("button[data-action]");

        if (!boton) return;

        const id = Number(boton.dataset.id);

        const accion = boton.dataset.action;

        const producto = productos.find(item => item.id === id);

        if (!producto) return;


        if (accion === "edit") {

            abrirFormulario(producto);

        }


        if (accion === "delete") {

            const confirmar = confirm(
                `¿Deseas eliminar el producto ${producto.nombre}?`
            );

            if (confirmar) {

                productos = productos.filter(
                    item => item.id !== id
                );

                cargarCategorias();
                buscarProductos();

                alert("Producto eliminado correctamente.");

            }

        }

    });

}


/* ==========================================================
   11. EVENTOS DE LOS BOTONES
   ========================================================== */

if (btnNuevoProducto) {

    btnNuevoProducto.addEventListener("click", function() {

        abrirFormulario();

    });

}


if (btnActualizar) {

    btnActualizar.addEventListener("click", function() {

        cargarCategorias();

        buscarProductos();

        alert("Inventario actualizado.");

    });

}


if (buscarProducto) {

    buscarProducto.addEventListener(
        "input",
        buscarProductos
    );

}


if (filtroCategoria) {

    filtroCategoria.addEventListener(
        "change",
        buscarProductos
    );

}


/* ==========================================================
   12. MENÚ DE NAVEGACIÓN
   ========================================================== */

document.querySelectorAll(".menu-link").forEach(enlace => {

    enlace.addEventListener("click", function() {

        document.querySelectorAll(".menu-link").forEach(item => {

            item.classList.remove("active");

        });

        this.classList.add("active");

    });

});


/* ==========================================================
   13. INICIALIZAR AUTOSTOCK
   ========================================================== */

function iniciarAutoStock() {

    cargarCategorias();

    mostrarProductos();

    actualizarResumen();

    console.log("AutoStock iniciado correctamente.");

}


// Ejecutar cuando se carga la página.

document.addEventListener(
    "DOMContentLoaded",
    iniciarAutoStock
);
