const API_URL = "http://localhost:3000/api/vehiculos";

document.addEventListener("DOMContentLoaded", () => {
    cargarVehiculos();
});

async function cargarVehiculos() {

    const contenedor = document.getElementById("vehicles-container");

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los vehículos");
        }

        const vehiculos = await respuesta.json();

        mostrarVehiculos(vehiculos, contenedor);

    } catch (error) {

        console.error(error);

        contenedor.innerHTML = `
            <p class="no-vehiculos">
                No se pudieron cargar los vehículos. Intenta de nuevo más tarde.
            </p>
        `;

    }

}


function mostrarVehiculos(vehiculos, contenedor) {

    if (!vehiculos.length) {

        contenedor.innerHTML = `
            <p class="no-vehiculos">
                No hay vehículos disponibles por el momento.
            </p>
        `;

        return;
    }

    // Solo mostramos los disponibles en la página pública
    const disponibles = vehiculos.filter(v => v.estado === "Disponible");

    if (!disponibles.length) {

        contenedor.innerHTML = `
            <p class="no-vehiculos">
                No hay vehículos disponibles por el momento.
            </p>
        `;

        return;
    }

    contenedor.innerHTML =
        disponibles.map(vehiculo => {

            const precioFormateado =
                "RD$" + Number(vehiculo.precio_dia).toLocaleString("es-DO", { minimumFractionDigits: 2 });

            return `
                <article
                    class="vehicle-card"
                    data-id="${vehiculo.id_vehiculo}"
                    data-nombre="${vehiculo.marca} ${vehiculo.modelo}"
                    data-precio="${vehiculo.precio_dia}"
                >
                    <div class="vehicle-image">🚘</div>
                    <div class="vehicle-info">
                        <p class="vehicle-category">${vehiculo.categoria}</p>
                        <h3>${vehiculo.marca} ${vehiculo.modelo}</h3>
                        <p>${vehiculo.anio} · ${vehiculo.color}</p>
                        <div class="vehicle-footer">
                            <strong>${precioFormateado} / día</strong>
                            <button class="btn-primary">Reservar</button>
                        </div>
                    </div>
                </article>
            `;

        }).join("");

}


// ---------- RESERVAR VEHÍCULO ----------
let vehiculoSeleccionado = null;

document.addEventListener("click", function (event) {

    if (!event.target.matches(".vehicle-footer .btn-primary")) {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Debes iniciar sesión para reservar un vehículo.");
        window.location.href = "pages/login.html";
        return;
    }

    const card = event.target.closest(".vehicle-card");

    vehiculoSeleccionado = {
        id_vehiculo: card.dataset.id,
        nombre: card.dataset.nombre,
        precio: card.dataset.precio
    };

    abrirModalReserva();

});


function abrirModalReserva() {

    document.getElementById("reserva-vehiculo-nombre").textContent = vehiculoSeleccionado.nombre;
    document.getElementById("reserva-fecha-inicio").value = "";
    document.getElementById("reserva-fecha-fin").value = "";
    document.getElementById("reserva-mensaje").textContent = "";

    document.getElementById("modal-reserva-cliente").classList.add("show");

}


document.getElementById("btn-cerrar-reserva")?.addEventListener("click", () => {
    document.getElementById("modal-reserva-cliente").classList.remove("show");
});


document.getElementById("form-reserva-cliente")?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("reserva-mensaje");

    const reserva = {
        id_vehiculo: Number(vehiculoSeleccionado.id_vehiculo),
        fecha_inicio: document.getElementById("reserva-fecha-inicio").value,
        fecha_fin: document.getElementById("reserva-fecha-fin").value,
        estado: "Pendiente"
    };

    try {

        const res = await fetch("/api/reservas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(reserva)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.mensaje || "No se pudo crear la reserva.");
        }

        alert("¡Reserva creada correctamente! Nos pondremos en contacto contigo.");
        document.getElementById("modal-reserva-cliente").classList.remove("show");

    } catch (error) {

        console.error(error);
        mensaje.textContent = error.message;

    }

});