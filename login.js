export function Login(onSuccess) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-login";

  // Estilos embebidos para mejorar UI (puedes moverlo a un CSS externo)
  const style = document.createElement("style");
  style.textContent = `
    .contenedor-login {
      max-width: 320px;
      margin: auto;
      font-family: Arial, sans-serif;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 0 10px #ddd;
      background: #fff;
    }
    .login-imagen {
      display: block;
      margin: 0 auto 15px;
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    form {
      display: flex;
      flex-direction: column;
    }
    label {
      margin-top: 10px;
      font-weight: bold;
    }
    input {
      padding: 8px;
      margin-top: 4px;
      font-size: 1em;
      border: 1px solid #aaa;
      border-radius: 4px;
    }
    button {
      margin-top: 20px;
      padding: 10px;
      font-size: 1em;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:disabled {
      background-color: #aaa;
      cursor: default;
    }
    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .message {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      font-weight: bold;
    }
    .message.error {
      background-color: #f8d7da;
      color: #842029;
    }
    .message.success {
      background-color: #d1e7dd;
      color: #0f5132;
    }
    .link-button {
      background: none;
      border: none;
      color: #007bff;
      text-align: left;
      padding: 0;
      margin-top: 10px;
      cursor: pointer;
      font-size: 0.9em;
    }
    .link-button:hover {
      text-decoration: underline;
    }
  `;
  contenedor.appendChild(style);

  const imagen = document.createElement("img");
  imagen.src = "./media/user.png";
  imagen.alt = "Logo";
  imagen.className = "login-imagen";

  const form = document.createElement("form");

  // Crear función para crear inputs con label, para reutilizar
  function crearInput({ id, type, labelText, placeholder, required = false }) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    if (placeholder) input.placeholder = placeholder;
    if (required) input.required = true;

    return { label, input };
  }

  const { label: labelEmail, input: inputEmail } = crearInput({
    id: "email",
    type: "email",
    labelText: "Correo:",
    placeholder: "ejemplo@correo.com",
    required: true,
  });

  const { label: labelPassword, input: inputPassword } = crearInput({
    id: "password",
    type: "password",
    labelText: "Contraseña:",
    placeholder: "********",
    required: true,
  });

  const boton = document.createElement("button");
  boton.type = "submit";
  boton.textContent = "Entrar";

  const recuperarBtn = document.createElement("button");
  recuperarBtn.type = "button";
  recuperarBtn.textContent = "¿Olvidaste tu contraseña?";
  recuperarBtn.className = "link-button";

  const messageBox = document.createElement("div");
  messageBox.className = "message";
  messageBox.style.display = "none";

  form.append(labelEmail, inputEmail, labelPassword, inputPassword, boton, recuperarBtn, messageBox);
  contenedor.append(imagen, form);

  function mostrarMensaje(text, tipo = "error") {
    messageBox.textContent = text;
    messageBox.className = `message ${tipo}`;
    messageBox.style.display = "block";
  }
  function ocultarMensaje() {
    messageBox.style.display = "none";
  }

  function decodeJWT(token) {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensaje();

    // Validación extra contraseña (mínimo 6 caracteres)
    if (inputPassword.value.length < 6) {
      mostrarMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const data = {
      email: inputEmail.value.trim(),
      password: inputPassword.value,
    };

    boton.disabled = true;
    boton.textContent = "Cargando...";

    try {
      const response = await fetch("http://localhost:3000/login_asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al iniciar sesión");

      const userData = decodeJWT(result.token);
      mostrarMensaje("Inicio de sesión exitoso.", "success");

      if (typeof onSuccess === "function") onSuccess(userData);
    } catch (err) {
      mostrarMensaje("Error al iniciar sesión: " + err.message);
    } finally {
      boton.disabled = false;
      boton.textContent = "Entrar";
    }
  });

  // Recuperación de contraseña
  recuperarBtn.addEventListener("click", () => {
    contenedor.innerHTML = "";
    contenedor.appendChild(style);

    const recForm = document.createElement("form");
    recForm.innerHTML = `
      <h3>Recuperar contraseña</h3>
      <input type="email" placeholder="Tu correo registrado" required />
      <button type="submit">Enviar código</button>
      <div class="message" style="display:none;"></div>
    `;

    const emailInput = recForm.querySelector("input");
    const recMessage = recForm.querySelector(".message");
    const enviarBtn = recForm.querySelector("button");

    function mostrarRecMensaje(text, tipo = "error") {
      recMessage.textContent = text;
      recMessage.className = `message ${tipo}`;
      recMessage.style.display = "block";
    }
    function ocultarRecMensaje() {
      recMessage.style.display = "none";
    }

    recForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      ocultarRecMensaje();

      enviarBtn.disabled = true;
      enviarBtn.textContent = "Enviando...";

      const email = emailInput.value.trim();

      try {
        const res = await fetch("http://localhost:3000/recuperacion/codigo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        mostrarRecMensaje("Código enviado. Revisa tu correo.", "success");

        setTimeout(() => mostrarVerificacion(email), 1000);
      } catch (err) {
        mostrarRecMensaje("Error al enviar código: " + err.message);
      } finally {
        enviarBtn.disabled = false;
        enviarBtn.textContent = "Enviar código";
      }
    });

    contenedor.appendChild(recForm);
  });

  function mostrarVerificacion(email) {
    contenedor.innerHTML = "";
    contenedor.appendChild(style);

    const formVerificar = document.createElement("form");
    formVerificar.innerHTML = `
      <h3>Ingresa el código recibido</h3>
      <input type="text" placeholder="Código de verificación" required />
      <button type="submit">Verificar</button>
      <div class="message" style="display:none;"></div>
    `;

    const inputCodigo = formVerificar.querySelector("input");
    const btnVerificar = formVerificar.querySelector("button");
    const verifMessage = formVerificar.querySelector(".message");

    function mostrarVerifMensaje(text, tipo = "error") {
      verifMessage.textContent = text;
      verifMessage.className = `message ${tipo}`;
      verifMessage.style.display = "block";
    }
    function ocultarVerifMensaje() {
      verifMessage.style.display = "none";
    }

    formVerificar.addEventListener("submit", async (e) => {
      e.preventDefault();
      ocultarVerifMensaje();

      btnVerificar.disabled = true;
      btnVerificar.textContent = "Verificando...";

      try {
        const res = await fetch("http://localhost:3000/recuperacion/verificar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, codigo: inputCodigo.value.trim() }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        mostrarVerifMensaje("Código correcto. Ahora puedes cambiar tu contraseña.", "success");

        setTimeout(() => mostrarCambio(email), 1000);
      } catch (err) {
        mostrarVerifMensaje("Código incorrecto: " + err.message);
      } finally {
        btnVerificar.disabled = false;
        btnVerificar.textContent = "Verificar";
      }
    });

    contenedor.appendChild(formVerificar);
  }

  function mostrarCambio(email) {
    contenedor.innerHTML = "";
    contenedor.appendChild(style);

    const formCambio = document.createElement("form");
    formCambio.innerHTML = `
      <h3>Nueva contraseña</h3>
      <input type="password" placeholder="Nueva contraseña (mín 6 caracteres)" required />
      <button type="submit">Cambiar contraseña</button>
      <div class="message" style="display:none;"></div>
    `;

    const inputNueva = formCambio.querySelector("input");
    const btnCambiar = formCambio.querySelector("button");
    const cambioMessage = formCambio.querySelector(".message");

    function mostrarCambioMensaje(text, tipo = "error") {
      cambioMessage.textContent = text;
      cambioMessage.className = `message ${tipo}`;
      cambioMessage.style.display = "block";
    }
    function ocultarCambioMensaje() {
      cambioMessage.style.display = "none";
    }

    formCambio.addEventListener("submit", async (e) => {
      e.preventDefault();
      ocultarCambioMensaje();

      if (inputNueva.value.length < 6) {
        mostrarCambioMensaje("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }

      btnCambiar.disabled = true;
      btnCambiar.textContent = "Cambiando...";

      try {
        const res = await fetch("http://localhost:3000/recuperacion/nueva", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, nuevaPassword: inputNueva.value }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        mostrarCambioMensaje("Contraseña actualizada. Inicia sesión.", "success");

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        mostrarCambioMensaje("Error al cambiar contraseña: " + err.message);
      } finally {
        btnCambiar.disabled = false;
        btnCambiar.textContent = "Cambiar contraseña";
      }
    });

    contenedor.appendChild(formCambio);
  }

  return contenedor;
}
