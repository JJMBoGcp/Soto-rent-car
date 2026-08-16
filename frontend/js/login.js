document.getElementById("login-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("login-message");
    const boton = document.getElementById("login-btn");

    mensaje.textContent = "";
    mensaje.className = "login-message";
    boton.disabled = true;
    boton.textContent = "Ingresando...";

    try {

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contrasena })
        });

        const data = await res.json();

        if (!res.ok) {
            mensaje.textContent = data.mensaje || "Correo o contraseña incorrectos.";
            mensaje.classList.add("error");
            return;
        }

        // Guarda sesión
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        mensaje.textContent = "¡Bienvenido! Redirigiendo...";
        mensaje.classList.add("success");

        setTimeout(() => {

            if (data.usuario.rol === "admin") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "../index.html";
            }

        }, 800);

    } catch (error) {

        console.error("Error de conexión:", error);
        mensaje.textContent = "Error de conexión con el servidor.";
        mensaje.classList.add("error");

    } finally {

        boton.disabled = false;
        boton.textContent = "Iniciar sesión";

    }

});