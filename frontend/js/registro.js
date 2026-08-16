document.getElementById("registro-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const mensaje = document.getElementById("registro-message");
    const boton = document.getElementById("registro-btn");

    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        contrasena: document.getElementById("contrasena").value,
        telefono: document.getElementById("telefono").value.trim(),
        licencia: document.getElementById("licencia").value.trim(),
        direccion: document.getElementById("direccion").value.trim()
    };

    mensaje.textContent = "";
    mensaje.className = "login-message";
    boton.disabled = true;
    boton.textContent = "Creando cuenta...";

    try {

        const res = await fetch("/api/auth/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        if (!res.ok) {
            mensaje.textContent = data.mensaje || "No se pudo crear la cuenta.";
            mensaje.classList.add("error");
            return;
        }

        mensaje.textContent = "¡Cuenta creada! Redirigiendo a inicio de sesión...";
        mensaje.classList.add("success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);

    } catch (error) {

        console.error("Error de conexión:", error);
        mensaje.textContent = "Error de conexión con el servidor.";
        mensaje.classList.add("error");

    } finally {

        boton.disabled = false;
        boton.textContent = "Crear cuenta";

    }

});
