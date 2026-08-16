const API_URL = "http://localhost:3000/api/clientes";

const listaClientes =
    document.getElementById("clientes-lista");

const modal =
    document.getElementById("modal-cliente");

const formulario =
    document.getElementById("cliente-form");

const modalTitle =
    document.getElementById("modal-title");

const buscarInput =
    document.getElementById("buscar-cliente");

const formMessage =
    document.getElementById("form-message");


async function cargarClientes() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener los clientes"
            );
        }

        const clientes = await respuesta.json();

        mostrarClientes(clientes);

    } catch (error) {

        console.error(error);

        listaClientes.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    No se pudieron cargar los clientes.
                </td>
            </tr>
        `;
    }
}


function mostrarClientes(clientes) {

    if (!clientes.length) {

        listaClientes.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    No hay clientes registrados.
                </td>
            </tr>
        `;

        return;
    }


    listaClientes.innerHTML =
        clientes.map(cliente => {

            return `
                <tr>

                    <td>
                        ${cliente.id_cliente}
                    </td>

                    <td>
                        <div class="vehicle-name">
                            ${cliente.nombre}
                            ${cliente.apellido}
                        </div>
                    </td>

                    <td>
                        ${cliente.correo || "—"}
                    </td>

                    <td>
                        ${cliente.telefono || "—"}
                    </td>

                    <td>
                        ${cliente.licencia || "—"}
                    </td>

                    <td>
                        ${cliente.direccion || "—"}
                    </td>

                    <td>

                        <div class="actions">

                            <button
                                class="btn-edit"
                                onclick="editarCliente(${cliente.id_cliente})"
                            >
                                Editar
                            </button>

                            <button
                                class="btn-delete"
                                onclick="eliminarCliente(${cliente.id_cliente})"
                            >
                                Eliminar
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");
}



document
    .getElementById("btn-nuevo")
    .addEventListener(
        "click",
        abrirModalNuevo
    );


function abrirModalNuevo() {

    formulario.reset();

    document.getElementById(
        "id_cliente"
    ).value = "";

    document.getElementById(
        "id_usuario"
    ).value = "";

    document.getElementById(
        "contrasena"
    ).required = true;

    document.querySelector(
        "#grupo-contrasena small"
    ).textContent =
        "Requerida para crear el usuario del cliente.";

    modalTitle.textContent =
        "Nuevo cliente";

    formMessage.textContent = "";

    modal.classList.add("show");
}


document
    .getElementById("btn-cerrar-modal")
    .addEventListener(
        "click",
        cerrarModal
    );


document
    .getElementById("btn-cancelar")
    .addEventListener(
        "click",
        cerrarModal
    );


function cerrarModal() {

    modal.classList.remove("show");

}



formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "id_cliente"
            ).value;


        const cliente = {

            nombre:
                document.getElementById(
                    "nombre"
                ).value,

            apellido:
                document.getElementById(
                    "apellido"
                ).value,

            correo:
                document.getElementById(
                    "correo"
                ).value,

            telefono:
                document.getElementById(
                    "telefono"
                ).value,

            licencia:
                document.getElementById(
                    "licencia"
                ).value,

            direccion:
                document.getElementById(
                    "direccion"
                ).value

        };


        const contrasena =
            document.getElementById(
                "contrasena"
            ).value;

        if (contrasena) {

            cliente.contrasena = contrasena;
        }


        try {

            let respuesta;


            if (id) {

                respuesta = await fetch(
                    `${API_URL}/${id}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                cliente
                            )

                    }
                );

            }


            else {

                respuesta = await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                cliente
                            )

                    }
                );

            }


            const data =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    data.error ||
                    data.mensaje ||
                    "Error en la operación"
                );
            }


            alert(
                id
                    ? "Cliente actualizado correctamente"
                    : "Cliente creado correctamente"
            );


            cerrarModal();

            cargarClientes();


        } catch (error) {

            console.error(error);

            formMessage.textContent =
                error.message;

        }

    }
);




async function editarCliente(id) {

    try {

        const respuesta =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el cliente"
            );
        }


        const data =
            await respuesta.json();


        const cliente =
            data.cliente || data;


        document.getElementById(
            "id_cliente"
        ).value =
            cliente.id_cliente;

        document.getElementById(
            "id_usuario"
        ).value =
            cliente.id_usuario || "";


        document.getElementById(
            "nombre"
        ).value =
            cliente.nombre;


        document.getElementById(
            "apellido"
        ).value =
            cliente.apellido;


        document.getElementById(
            "correo"
        ).value =
            cliente.correo;


        document.getElementById(
            "telefono"
        ).value =
            cliente.telefono || "";


        document.getElementById(
            "licencia"
        ).value =
            cliente.licencia || "";


        document.getElementById(
            "direccion"
        ).value =
            cliente.direccion || "";


        document.getElementById(
            "contrasena"
        ).value = "";

        document.getElementById(
            "contrasena"
        ).required = false;

        document.querySelector(
            "#grupo-contrasena small"
        ).textContent =
            "Deja en blanco para no cambiar la contraseña.";


        modalTitle.textContent =
            "Editar cliente";


        formMessage.textContent = "";


        modal.classList.add("show");


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo cargar el cliente."
        );

    }

}



async function eliminarCliente(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este cliente?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                data.error ||
                data.mensaje ||
                "No se pudo eliminar"
            );
        }


        alert(
            "Cliente eliminado correctamente"
        );


        cargarClientes();


    } catch (error) {

        console.error(error);

        alert(
            error.message
        );

    }

}



buscarInput.addEventListener(
    "input",
    async function () {

        const texto =
            this.value.toLowerCase().trim();


        const respuesta =
            await fetch(API_URL);


        const clientes =
            await respuesta.json();


        const filtrados =
            clientes.filter(
                cliente =>

                    `${cliente.nombre} ${cliente.apellido}`
                        .toLowerCase()
                        .includes(texto)

                    ||

                    (cliente.correo || "")
                        .toLowerCase()
                        .includes(texto)

                    ||

                    (cliente.telefono || "")
                        .toLowerCase()
                        .includes(texto)
            );


        mostrarClientes(filtrados);

    }
);



cargarClientes();