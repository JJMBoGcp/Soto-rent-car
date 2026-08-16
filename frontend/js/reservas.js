const API_URL = "http://localhost:3000/api/reservas";

const listaReservas =
    document.getElementById("reservas-lista");

const modal =
    document.getElementById("modal-reserva");

const formulario =
    document.getElementById("reserva-form");

const modalTitle =
    document.getElementById("modal-title");

const buscarInput =
    document.getElementById("buscar-reserva");

const formMessage =
    document.getElementById("form-message");

const selectCliente =
    document.getElementById("id_cliente");

const selectVehiculo =
    document.getElementById("id_vehiculo");

const totalEstimado =
    document.getElementById("total-estimado");


async function cargarReservas() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al obtener las reservas");
        }

        const reservas = await respuesta.json();

        mostrarReservas(reservas);

    } catch (error) {

        console.error(error);

        listaReservas.innerHTML = `
            <tr>
                <td colspan="9" class="loading">
                    No se pudieron cargar las reservas.
                </td>
            </tr>
        `;
    }
}


function mostrarReservas(reservas) {

    if (!reservas.length) {

        listaReservas.innerHTML = `
            <tr>
                <td colspan="9" class="loading">
                    No hay reservas registradas.
                </td>
            </tr>
        `;

        return;
    }

    listaReservas.innerHTML =
        reservas.map(reserva => {

            let claseEstado = "status-disponible";

            if (reserva.estado === "Pendiente") claseEstado = "status-mantenimiento";
            if (reserva.estado === "Cancelada") claseEstado = "status-alquilado";
            if (reserva.estado === "Activa" || reserva.estado === "Confirmada") claseEstado = "status-disponible";

            const totalFormateado =
                "RD$" + Number(reserva.total).toLocaleString("es-DO", { minimumFractionDigits: 2 });

            return `
                <tr>
                    <td>${reserva.id_reserva}</td>
                    <td class="vehicle-name">${reserva.cliente}</td>
                    <td>${reserva.vehiculo}</td>
                    <td>${reserva.placa}</td>
                    <td>${formatearFecha(reserva.fecha_inicio)}</td>
                    <td>${formatearFecha(reserva.fecha_fin)}</td>
                    <td>${totalFormateado}</td>
                    <td><span class="status ${claseEstado}">${reserva.estado}</span></td>
                    <td>
                        <div class="actions">
                            <button class="btn-edit" onclick="editarReserva(${reserva.id_reserva})">Editar</button>
                            <button class="btn-delete" onclick="eliminarReserva(${reserva.id_reserva})">Eliminar</button>
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


// ---------- CARGAR SELECTS ----------
async function cargarClientesSelect() {

    const respuesta = await fetch(`${API_URL}/apoyo/clientes`);
    const clientes = await respuesta.json();

    selectCliente.innerHTML = `<option value="">Selecciona un cliente...</option>` +
        clientes.map(c => `<option value="${c.id_cliente}">${c.nombre}</option>`).join("");
}

async function cargarVehiculosSelect() {

    const respuesta = await fetch(`${API_URL}/apoyo/vehiculos`);
    const vehiculos = await respuesta.json();

    selectVehiculo.innerHTML = `<option value="">Selecciona un vehículo...</option>` +
        vehiculos.map(v =>
            `<option value="${v.id_vehiculo}" data-precio="${v.precio_dia}">
                ${v.marca} ${v.modelo} - ${v.placa} (${v.estado})
            </option>`
        ).join("");
}


// ---------- CALCULAR TOTAL ESTIMADO EN VIVO ----------
function actualizarTotalEstimado() {

    const opcionVehiculo = selectVehiculo.options[selectVehiculo.selectedIndex];
    const precioDia = opcionVehiculo ? Number(opcionVehiculo.dataset.precio) : 0;

    const inicio = document.getElementById("fecha_inicio").value;
    const fin = document.getElementById("fecha_fin").value;

    if (!precioDia || !inicio || !fin) {
        totalEstimado.textContent = "";
        return;
    }

    const dias = Math.max(1, Math.ceil((new Date(fin) - new Date(inicio)) / (1000 * 60 * 60 * 24)));

    if (dias <= 0 || isNaN(dias)) {
        totalEstimado.textContent = "";
        return;
    }

    const total = dias * precioDia;

    totalEstimado.textContent =
        `${dias} día(s) × RD$${precioDia.toLocaleString("es-DO")} = RD$${total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;
}

selectVehiculo.addEventListener("change", actualizarTotalEstimado);
document.getElementById("fecha_inicio").addEventListener("change", actualizarTotalEstimado);
document.getElementById("fecha_fin").addEventListener("change", actualizarTotalEstimado);


// ---------- MODAL ----------
document
    .getElementById("btn-nuevo")
    .addEventListener("click", abrirModalNuevo);

async function abrirModalNuevo() {

    formulario.reset();

    document.getElementById("id_reserva").value = "";

    modalTitle.textContent = "Nueva reserva";

    formMessage.textContent = "";
    totalEstimado.textContent = "";

    await cargarClientesSelect();
    await cargarVehiculosSelect();

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

    const id = document.getElementById("id_reserva").value;

    const reserva = {
        id_cliente: Number(selectCliente.value),
        id_vehiculo: Number(selectVehiculo.value),
        fecha_inicio: document.getElementById("fecha_inicio").value,
        fecha_fin: document.getElementById("fecha_fin").value,
        estado: document.getElementById("estado").value
    };

    try {

        let respuesta;

        if (id) {
            respuesta = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reserva)
            });
        } else {
            respuesta = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reserva)
            });
        }

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.error || data.mensaje || "Error en la operación");
        }

        alert(id ? "Reserva actualizada correctamente" : "Reserva creada correctamente");

        cerrarModal();
        cargarReservas();

    } catch (error) {

        console.error(error);
        formMessage.textContent = error.message;

    }

});


async function editarReserva(id) {

    try {

        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la reserva");
        }

        const reserva = await respuesta.json();

        await cargarClientesSelect();
        await cargarVehiculosSelect();

        document.getElementById("id_reserva").value = reserva.id_reserva;
        selectCliente.value = reserva.id_cliente;
        selectVehiculo.value = reserva.id_vehiculo;

        document.getElementById("fecha_inicio").value = reserva.fecha_inicio.split("T")[0];
        document.getElementById("fecha_fin").value = reserva.fecha_fin.split("T")[0];
        document.getElementById("estado").value = reserva.estado;

        modalTitle.textContent = "Editar reserva";
        formMessage.textContent = "";

        actualizarTotalEstimado();

        modal.classList.add("show");

    } catch (error) {

        console.error(error);
        alert("No se pudo cargar la reserva.");

    }

}


async function eliminarReserva(id) {

    const confirmar = confirm("¿Seguro que deseas eliminar esta reserva?");

    if (!confirmar) return;

    try {

        const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje || "No se pudo eliminar");
        }

        alert("Reserva eliminada correctamente");
        cargarReservas();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}


buscarInput.addEventListener("input", async function () {

    const texto = this.value.toLowerCase().trim();

    const respuesta = await fetch(API_URL);
    const reservas = await respuesta.json();

    const filtrados = reservas.filter(reserva =>
        reserva.cliente.toLowerCase().includes(texto) ||
        reserva.vehiculo.toLowerCase().includes(texto) ||
        reserva.placa.toLowerCase().includes(texto)
    );

    mostrarReservas(filtrados);

});


cargarReservas();