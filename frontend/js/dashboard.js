const API_BASE = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    cargarEstadisticas();
    cargarReservasRecientes();
    inicializarSidebar();
});


// ---------- TOGGLE SIDEBAR (móvil) ----------
function inicializarSidebar() {

    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("menu-toggle");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
        const clicDentro = sidebar.contains(e.target) || toggle.contains(e.target);

        if (!clicDentro && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
        }
    });
}


// ---------- TARJETAS DE ESTADÍSTICAS ----------
async function cargarEstadisticas() {

    try {

        const respuesta = await fetch(`${API_BASE}/dashboard/resumen`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener el resumen");
        }

        const resumen = await respuesta.json();

        document.getElementById("total-usuarios").textContent = resumen.total_usuarios;
        document.getElementById("total-clientes").textContent = resumen.total_clientes;
        document.getElementById("total-vehiculos").textContent = resumen.total_vehiculos;
        document.getElementById("total-reservas").textContent = resumen.total_reservas;
        document.getElementById("total-pagos").textContent = resumen.total_pagos;

    } catch (error) {

        console.error("Error al cargar estadísticas:", error);

    }

}


// ---------- RESERVAS RECIENTES ----------
async function cargarReservasRecientes() {

    const tbody = document.getElementById("reservas-recientes");

    try {

        const respuesta = await fetch(`${API_BASE}/dashboard/reservas-recientes`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener las reservas");
        }

        const reservas = await respuesta.json();

        if (!reservas.length) {
            tbody.innerHTML = `<tr><td colspan="6">No hay reservas para mostrar.</td></tr>`;
            return;
        }

        tbody.innerHTML = reservas.map(r => {

            const claseEstado = `status-${r.estado.toLowerCase()}`;

            return `
                <tr>
                    <td>${r.id_reserva}</td>
                    <td>${r.cliente}</td>
                    <td>${r.vehiculo}</td>
                    <td>${formatearFecha(r.fecha_inicio)}</td>
                    <td>${formatearFecha(r.fecha_fin)}</td>
                    <td><span class="status-badge ${claseEstado}">${r.estado}</span></td>
                </tr>
            `;

        }).join("");

    } catch (error) {

        console.error("Error al cargar reservas recientes:", error);
        tbody.innerHTML = `<tr><td colspan="6">No se pudieron cargar las reservas.</td></tr>`;

    }

}


function formatearFecha(fecha) {
    const f = new Date(fecha);
    return f.toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" });
}