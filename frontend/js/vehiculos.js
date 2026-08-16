
const API_URL = "http://localhost:3000/api/vehiculos";



const listaVehiculos =
    document.getElementById("vehiculos-lista");

const modal =
    document.getElementById("modal-vehiculo");

const formulario =
    document.getElementById("vehiculo-form");

const modalTitle =
    document.getElementById("modal-title");

const buscarInput =
    document.getElementById("buscar-vehiculo");

const formMessage =
    document.getElementById("form-message");


async function cargarVehiculos() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener los vehículos"
            );
        }

        const vehiculos = await respuesta.json();

        mostrarVehiculos(vehiculos);

    } catch (error) {

        console.error(error);

        listaVehiculos.innerHTML = `
            <tr>
                <td colspan="9" class="loading">
                    No se pudieron cargar los vehículos.
                </td>
            </tr>
        `;
    }
}


function mostrarVehiculos(vehiculos) {

    if (!vehiculos.length) {

        listaVehiculos.innerHTML = `
            <tr>
                <td colspan="9" class="loading">
                    No hay vehículos registrados.
                </td>
            </tr>
        `;

        return;
    }


    listaVehiculos.innerHTML =
        vehiculos.map(vehiculo => {

            let claseEstado =
                "status-disponible";

            if (
                vehiculo.estado === "Alquilado"
            ) {

                claseEstado =
                    "status-alquilado";
            }

            if (
                vehiculo.estado === "Mantenimiento"
            ) {

                claseEstado =
                    "status-mantenimiento";
            }


            return `
                <tr>

                    <td>
                        ${vehiculo.id_vehiculo}
                    </td>

                    <td>

                        <div class="vehicle-name">
                            ${vehiculo.marca}
                            ${vehiculo.modelo}
                        </div>

                        <div class="vehicle-category">
                            ${vehiculo.categoria}
                        </div>

                    </td>

                    <td>
                        ${vehiculo.anio}
                    </td>

                    <td>
                        ${vehiculo.color}
                    </td>

                    <td>
                        ${vehiculo.categoria}
                    </td>

                    <td>
                        ${vehiculo.placa}
                    </td>

                    <td>
                        $${Number(
                            vehiculo.precio_dia
                        ).toFixed(2)}
                    </td>

                    <td>

                        <span
                            class="status ${claseEstado}"
                        >
                            ${vehiculo.estado}
                        </span>

                    </td>

                    <td>

                        <div class="actions">

                            <button
                                class="btn-edit"
                                onclick="editarVehiculo(${vehiculo.id_vehiculo})"
                            >
                                Editar
                            </button>

                            <button
                                class="btn-delete"
                                onclick="eliminarVehiculo(${vehiculo.id_vehiculo})"
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
        "id_vehiculo"
    ).value = "";

    modalTitle.textContent =
        "Nuevo vehículo";

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
                "id_vehiculo"
            ).value;


        const vehiculo = {

            marca:
                document.getElementById(
                    "marca"
                ).value,

            modelo:
                document.getElementById(
                    "modelo"
                ).value,

            anio:
                Number(
                    document.getElementById(
                        "anio"
                    ).value
                ),

            color:
                document.getElementById(
                    "color"
                ).value,

            categoria:
                document.getElementById(
                    "categoria"
                ).value,

            placa:
                document.getElementById(
                    "placa"
                ).value,

            precio_dia:
                Number(
                    document.getElementById(
                        "precio_dia"
                    ).value
                ),

            estado:
                document.getElementById(
                    "estado"
                ).value

        };


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
                                vehiculo
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
                                vehiculo
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
                    ? "Vehículo actualizado correctamente"
                    : "Vehículo creado correctamente"
            );


            cerrarModal();

            cargarVehiculos();


        } catch (error) {

            console.error(error);

            formMessage.textContent =
                error.message;

        }

    }
);




async function editarVehiculo(id) {

    try {

        const respuesta =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el vehículo"
            );
        }


        const data =
            await respuesta.json();


        const vehiculo =
            data.vehiculo || data;


        document.getElementById(
            "id_vehiculo"
        ).value =
            vehiculo.id_vehiculo;


        document.getElementById(
            "marca"
        ).value =
            vehiculo.marca;


        document.getElementById(
            "modelo"
        ).value =
            vehiculo.modelo;


        document.getElementById(
            "anio"
        ).value =
            vehiculo.anio;


        document.getElementById(
            "color"
        ).value =
            vehiculo.color;


        document.getElementById(
            "categoria"
        ).value =
            vehiculo.categoria;


        document.getElementById(
            "placa"
        ).value =
            vehiculo.placa;


        document.getElementById(
            "precio_dia"
        ).value =
            vehiculo.precio_dia;


        document.getElementById(
            "estado"
        ).value =
            vehiculo.estado;


        modalTitle.textContent =
            "Editar vehículo";


        formMessage.textContent = "";


        modal.classList.add("show");


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo cargar el vehículo."
        );

    }

}



async function eliminarVehiculo(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este vehículo?"
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
            "Vehículo eliminado correctamente"
        );


        cargarVehiculos();


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


        const vehiculos =
            await respuesta.json();


        const filtrados =
            vehiculos.filter(
                vehiculo =>

                    vehiculo.marca
                        .toLowerCase()
                        .includes(texto)

                    ||

                    vehiculo.modelo
                        .toLowerCase()
                        .includes(texto)

                    ||

                    vehiculo.placa
                        .toLowerCase()
                        .includes(texto)

                    ||

                    vehiculo.categoria
                        .toLowerCase()
                        .includes(texto)
            );


        mostrarVehiculos(filtrados);

    }
);



cargarVehiculos();