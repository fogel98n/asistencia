import { agregar_alumnos } from "./btn.js";
import { header } from "./header.js";

export async function mostrarAlumnos(idGrado, usuario, claseExtra = "", mostrarBotones = true) {
    const contenedorAlumnos = document.createElement("div");
    contenedorAlumnos.className = "alumnos-listado";

    if (claseExtra) {
        contenedorAlumnos.classList.add(claseExtra);
    }

    contenedorAlumnos.appendChild(header(usuario));

    try {
        const res = await fetch("http://localhost:3000/alumnos");
        if (!res.ok) throw new Error("Error al cargar alumnos");

        const alumnos = await res.json();
        const filtrados = alumnos.filter(a => String(a.id_grado) === String(idGrado));

        if (filtrados.length === 0) {
            contenedorAlumnos.textContent = "No hay alumnos para este grado.";
        } else {
            filtrados.forEach(alumno => {
                const div = document.createElement("div");
                div.className = "alumno-item";
                div.textContent = alumno.nombre;

                if (mostrarBotones) {
                    div.appendChild(btn());
                }

                contenedorAlumnos.appendChild(div);
            });
        }
    } catch (error) {
        contenedorAlumnos.textContent = "Error al cargar alumnos: " + error.message;
        contenedorAlumnos.style.color = "red";
    }

    if (mostrarBotones) {
        const btnAgregarAlumno = agregar_alumnos("btn-alumno", "Agregar Alumno");
        btnAgregarAlumno.addEventListener("click", () => {
            mostrarPanelAgregarAlumno();
        });

        contenedorAlumnos.appendChild(btnAgregarAlumno);
    }

    return contenedorAlumnos;
}

export function btn() {
    const contenedorBotones = document.createElement("div");
    contenedorBotones.className = "botones-contenedor";

    const btnAsistencia = document.createElement("button");
    btnAsistencia.className = "btn-asistencia sin-borde";

    btnAsistencia.addEventListener("click", () => {
        btnAsistencia.style.backgroundColor = "#4CAF50";
    });

    btnAsistencia.addEventListener("dblclick", () => {
        btnAsistencia.style.backgroundColor = "#F44336";
    });

    const btnUniforme = document.createElement("button");
    btnUniforme.className = "btn-uniforme";

    const btnMsj = document.createElement("button");
    btnMsj.className = "btn-msj";

    const imgMsj = document.createElement("img");
    imgMsj.src = "./media/iconmsj.png";
    imgMsj.alt = "Mensaje";
    imgMsj.className = "btn-msj-icon";

    btnMsj.appendChild(imgMsj);

    btnMsj.addEventListener("click", () => {
        const email = "";
        const subject = "Asunto del correo";
        const body = "Cuerpo del mensaje";
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    });

    btnUniforme.addEventListener("click", () => {
        mostrarPanelUniforme();
    });

    contenedorBotones.appendChild(btnAsistencia);
    contenedorBotones.appendChild(btnUniforme);
    contenedorBotones.appendChild(btnMsj);

    return contenedorBotones;
}

function mostrarPanelAgregarAlumno() {
    const panelEmergente = document.createElement("div");
    panelEmergente.className = "panel-emergente";

    const titulo = document.createElement("h3");
    titulo.textContent = "Agregar Alumno";

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.placeholder = "Nombre";
    inputNombre.className = "input-texto";

    const inputApellido = document.createElement("input");
    inputApellido.type = "text";
    inputApellido.placeholder = "Apellido";
    inputApellido.className = "input-texto";

    const agregarBtn = document.createElement("button");
    agregarBtn.textContent = "Agregar";
    agregarBtn.className = "cerrar-btn";

    agregarBtn.addEventListener("click", () => {
        const nombre = inputNombre.value.trim();
        const apellido = inputApellido.value.trim();

        if (nombre && apellido) {
            panelEmergente.remove();
            mostrarPanelConfirmar(); 
        } else {
            alert("Por favor, completa ambos campos.");
        }
    });

    const cerrarBtn = document.createElement("button");
    cerrarBtn.textContent = "Cerrar";
    cerrarBtn.className = "cerrar-btn";

    cerrarBtn.addEventListener("click", () => {
        panelEmergente.remove();
    });

    panelEmergente.appendChild(titulo);
    panelEmergente.appendChild(inputNombre);
    panelEmergente.appendChild(inputApellido);
    panelEmergente.appendChild(agregarBtn);
    panelEmergente.appendChild(cerrarBtn);
    document.body.appendChild(panelEmergente);
}

function mostrarPanelConfirmar() {
    const panelEmergente = document.createElement("div");
    panelEmergente.className = "panel-emergente";

    const titulo = document.createElement("h3");
    titulo.textContent = "Confirmar Contraseña";

    const inputPassword = document.createElement("input");
    inputPassword.type = "password";
    inputPassword.placeholder = "Contraseña";
    inputPassword.className = "input-texto";

    const confirmarBtn = document.createElement("button");
    confirmarBtn.textContent = "Confirmar";
    confirmarBtn.className = "cerrar-btn";

    confirmarBtn.addEventListener("click", () => {
        const password = inputPassword.value.trim();

        if (password) {
            alert("Contraseña confirmada. Alumno agregado exitosamente.");
            panelEmergente.remove();
        } else {
            alert("Por favor, ingresa una contraseña.");
        }
    });

    const cerrarBtn = document.createElement("button");
    cerrarBtn.textContent = "Cerrar";
    cerrarBtn.className = "cerrar-btn";

    cerrarBtn.addEventListener("click", () => {
        panelEmergente.remove();
    });

    panelEmergente.appendChild(titulo);
    panelEmergente.appendChild(inputPassword);
    panelEmergente.appendChild(confirmarBtn);
    panelEmergente.appendChild(cerrarBtn);
    document.body.appendChild(panelEmergente);
}

function mostrarPanelUniforme() {
    const panelEmergente = document.createElement("div");
    panelEmergente.className = "panel-emergente";

    const mensaje = document.createElement("p");
    mensaje.textContent = "Falta de uniforme";

    const inputTexto = document.createElement("input");
    inputTexto.type = "text";
    inputTexto.placeholder = "Escribe aquí...";
    inputTexto.className = "input-texto";

    const contenedorImagenes = document.createElement("div");
    contenedorImagenes.className = "contenedor-imagenes";

    const imagen1 = document.createElement("img");
    imagen1.src = "./media/camisa.png";
    imagen1.alt = "Uniforme 1";
    imagen1.className = "imagen-uniforme";

    const imagen2 = document.createElement("img");
    imagen2.src = "./media/pantalon.png";
    imagen2.alt = "Uniforme 2";
    imagen2.className = "imagen-uniforme";

    const imagen3 = document.createElement("img");
    imagen3.src = "./media/zapatos.png";
    imagen3.alt = "Uniforme 3";
    imagen3.className = "imagen-uniforme";

    contenedorImagenes.appendChild(imagen1);
    contenedorImagenes.appendChild(imagen2);
    contenedorImagenes.appendChild(imagen3);

    const cerrarBtn = document.createElement("button");
    cerrarBtn.textContent = "Enviar";
    cerrarBtn.className = "cerrar-btn";

    cerrarBtn.addEventListener("click", () => {
        panelEmergente.remove();
    });

    panelEmergente.appendChild(mensaje);
    panelEmergente.appendChild(inputTexto);
    panelEmergente.appendChild(contenedorImagenes);
    panelEmergente.appendChild(cerrarBtn);
    document.body.appendChild(panelEmergente);
}
