const API_URL = "http://localhost:3000/api/usuarios";

const listaUsuarios =
    document.getElementById("usuarios-lista");

const modal =
    document.getElementById("modal-usuario");

const formulario =
    document.getElementById("usuario-form");

const modalTitle =
    document.getElementById("modal-title");

const buscarInput =
    document.getElementById("buscar-usuario");

const formMessage =
    document.getElementById("form-message");


async function cargarUsuarios() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los usuarios");
        }

        const usuarios = await respuesta.json();

        mostrarUsuarios(usuarios);

    } catch (error) {

        console.error(error);

        listaUsuarios.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    No se pudieron cargar los usuarios.
                </td>
            </tr>
        `;
    }
}


function mostrarUsuarios(usuarios) {

    if (!usuarios.length) {

        listaUsuarios.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    No hay usuarios registrados.
                </td>
            </tr>
        `;

        return;
    }

    listaUsuarios.innerHTML =
        usuarios.map(usuario => {

            const claseRol =
                usuario.rol === "admin" ? "status-mantenimiento" : "status-disponible";

            return `
                <tr>
                    <td>${usuario.id_usuario}</td>
                    <td class="vehicle-name">${usuario.nombre} ${usuario.apellido}</td>
                    <td>${usuario.correo}</td>
                    <td><span class="status ${claseRol}">${usuario.rol}</span></td>
                    <td>
                        <div class="actions">
                            <button class="btn-edit" onclick="editarUsuario(${usuario.id_usuario})">Editar</button>
                            <button class="btn-delete" onclick="eliminarUsuario(${usuario.id_usuario})">Eliminar</button>
                        </div>
                    </td>
                </tr>
            `;

        }).join("");
}


document
    .getElementById("btn-nuevo")
    .addEventListener("click", abrirModalNuevo);

function abrirModalNuevo() {

    formulario.reset();

    document.getElementById("id_usuario").value = "";

    document.getElementById("contrasena").required = true;
    document.querySelector("#grupo-contrasena small").textContent =
        "Requerida para crear el usuario.";

    modalTitle.textContent = "Nuevo usuario";
    formMessage.textContent = "";

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

    const id = document.getElementById("id_usuario").value;

    const usuario = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        correo: document.getElementById("correo").value,
        rol: document.getElementById("rol").value
    };

    const contrasena = document.getElementById("contrasena").value;
    if (contrasena) usuario.contrasena = contrasena;

    try {

        let respuesta;

        if (id) {
            respuesta = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });
        } else {
            respuesta = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });
        }

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.error || data.mensaje || "Error en la operación");
        }

        alert(id ? "Usuario actualizado correctamente" : "Usuario creado correctamente");

        cerrarModal();
        cargarUsuarios();

    } catch (error) {

        console.error(error);
        formMessage.textContent = error.message;

    }

});


async function editarUsuario(id) {

    try {

        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el usuario");
        }

        const usuario = await respuesta.json();

        document.getElementById("id_usuario").value = usuario.id_usuario;
        document.getElementById("nombre").value = usuario.nombre;
        document.getElementById("apellido").value = usuario.apellido;
        document.getElementById("correo").value = usuario.correo;
        document.getElementById("rol").value = usuario.rol;

        document.getElementById("contrasena").value = "";
        document.getElementById("contrasena").required = false;
        document.querySelector("#grupo-contrasena small").textContent =
            "Deja en blanco para no cambiar la contraseña.";

        modalTitle.textContent = "Editar usuario";
        formMessage.textContent = "";

        modal.classList.add("show");

    } catch (error) {

        console.error(error);
        alert("No se pudo cargar el usuario.");

    }

}


async function eliminarUsuario(id) {

    const confirmar = confirm("¿Seguro que deseas eliminar este usuario?");

    if (!confirmar) return;

    try {

        const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje || "No se pudo eliminar");
        }

        alert("Usuario eliminado correctamente");
        cargarUsuarios();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}


buscarInput.addEventListener("input", async function () {

    const texto = this.value.toLowerCase().trim();

    const respuesta = await fetch(API_URL);
    const usuarios = await respuesta.json();

    const filtrados = usuarios.filter(usuario =>
        `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(texto) ||
        usuario.correo.toLowerCase().includes(texto)
    );

    mostrarUsuarios(filtrados);

});


cargarUsuarios();