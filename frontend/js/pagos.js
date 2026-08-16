const API_URL = "http://localhost:3000/api/pagos";

const listaPagos =
    document.getElementById("pagos-lista");

const modal =
    document.getElementById("modal-pago");

const formulario =
    document.getElementById("pago-form");

const modalTitle =
    document.getElementById("modal-title");

const buscarInput =
    document.getElementById("buscar-pago");

const formMessage =
    document.getElementById("form-message");

const selectReserva =
    document.getElementById("id_reserva");

const infoReserva =
    document.getElementById("info-reserva");


async function cargarPagos() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los pagos");
        }

        const pagos = await respuesta.json();

        mostrarPagos(pagos);

    } catch (error) {

        console.error(error);

        listaPagos.innerHTML = `
            <tr>
                <td colspan="8" class="loading">
                    No se pudieron cargar los pagos.
                </td>
            </tr>
        `;
    }
}


function mostrarPagos(pagos) {

    if (!pagos.length) {

        listaPagos.innerHTML = `
            <tr>
                <td colspan="8" class="loading">
                    No hay pagos registrados.
                </td>
            </tr>
        `;

        return;
    }

    listaPagos.innerHTML =
        pagos.map(pago => {

            let claseEstado = "status-mantenimiento";

            if (pago.estado === "Completado") claseEstado = "status-disponible";
            if (pago.estado === "Pendiente") claseEstado = "status-alquilado";

            const montoFormateado =
                "RD$" + Number(pago.monto).toLocaleString("es-DO", { minimumFractionDigits: 2 });

            return `
                <tr>
                    <td>${pago.id_pago}</td>
                    <td class="vehicle-name">${pago.cliente}</td>
                    <td>${pago.vehiculo} <span class="vehicle-category">${pago.placa}</span></td>
                    <td>${montoFormateado}</td>
                    <td>${pago.metodo_pago}</td>
                    <td>${formatearFecha(pago.fecha_pago)}</td>
                    <td><span class="status ${claseEstado}">${pago.estado}</span></td>
                    <td>
                        <div class="actions">
                            <button class="btn-edit" onclick="editarPago(${pago.id_pago})">Editar</button>
                            <button class="btn-delete" onclick="eliminarPago(${pago.id_pago})">Eliminar</button>
                        </div>
                    </td>
                </tr>
            `;

        }).join("");
}


function formatearFecha(fecha) {
    const f = new Date(fecha);
    return f.toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" });
}


// ---------- CARGAR SELECT DE RESERVAS ----------
async function cargarReservasSelect() {

    const respuesta = await fetch(`${API_URL}/apoyo/reservas`);
    const reservas = await respuesta.json();

    selectReserva.innerHTML = `<option value="">Selecciona una reserva...</option>` +
        reservas.map(r =>
            `<option value="${r.id_reserva}" data-total="${r.total}">
                #${r.id_reserva} - ${r.cliente} - ${r.vehiculo} (${r.placa})
            </option>`
        ).join("");
}

selectReserva.addEventListener("change", () => {

    const opcion = selectReserva.options[selectReserva.selectedIndex];
    const total = opcion ? opcion.dataset.total : null;

    if (total) {
        infoReserva.textContent =
            `Total de la reserva: RD$${Number(total).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;
    } else {
        infoReserva.textContent = "";
    }

});


// ---------- MODAL ----------
document
    .getElementById("btn-nuevo")
    .addEventListener("click", abrirModalNuevo);

async function abrirModalNuevo() {

    formulario.reset();

    document.getElementById("id_pago").value = "";

    modalTitle.textContent = "Nuevo pago";
    formMessage.textContent = "";
    infoReserva.textContent = "";

    // Fecha de hoy por defecto
    document.getElementById("fecha_pago").value =
        new Date().toISOString().split("T")[0];

    await cargarReservasSelect();

    modal.classList.add("show");
}


document
    .getElementById("btn-cerrar-modal")
    .addEventListener("click", cerrarModal);

document
    .getElementById("btn-cancelar")
    .addEventListener("click", cerrarModal);

function cerrarModal() {
    modal.classList.remove("show");
}


formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const id = document.getElementById("id_pago").value;

    const pago = {
        id_reserva: Number(selectReserva.value),
        monto: Number(document.getElementById("monto").value),
        fecha_pago: document.getElementById("fecha_pago").value,
        metodo_pago: document.getElementById("metodo_pago").value,
        estado: document.getElementById("estado").value
    };

    try {

        let respuesta;

        if (id) {
            respuesta = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pago)
            });
        } else {
            respuesta = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pago)
            });
        }

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.error || data.mensaje || "Error en la operación");
        }

        alert(id ? "Pago actualizado correctamente" : "Pago creado correctamente");

        cerrarModal();
        cargarPagos();

    } catch (error) {

        console.error(error);
        formMessage.textContent = error.message;

    }

});


async function editarPago(id) {

    try {

        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el pago");
        }

        const pago = await respuesta.json();

        await cargarReservasSelect();

        document.getElementById("id_pago").value = pago.id_pago;
        selectReserva.value = pago.id_reserva;

        document.getElementById("monto").value = pago.monto;
        document.getElementById("fecha_pago").value = pago.fecha_pago.split("T")[0];
        document.getElementById("metodo_pago").value = pago.metodo_pago;
        document.getElementById("estado").value = pago.estado;

        const opcion = selectReserva.options[selectReserva.selectedIndex];
        if (opcion && opcion.dataset.total) {
            infoReserva.textContent =
                `Total de la reserva: RD$${Number(opcion.dataset.total).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;
        }

        modalTitle.textContent = "Editar pago";
        formMessage.textContent = "";

        modal.classList.add("show");

    } catch (error) {

        console.error(error);
        alert("No se pudo cargar el pago.");

    }

}


async function eliminarPago(id) {

    const confirmar = confirm("¿Seguro que deseas eliminar este pago?");

    if (!confirmar) return;

    try {

        const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje || "No se pudo eliminar");
        }

        alert("Pago eliminado correctamente");
        cargarPagos();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}


buscarInput.addEventListener("input", async function () {

    const texto = this.value.toLowerCase().trim();

    const respuesta = await fetch(API_URL);
    const pagos = await respuesta.json();

    const filtrados = pagos.filter(pago =>
        pago.cliente.toLowerCase().includes(texto) ||
        pago.vehiculo.toLowerCase().includes(texto) ||
        pago.metodo_pago.toLowerCase().includes(texto)
    );

    mostrarPagos(filtrados);

});


cargarPagos();