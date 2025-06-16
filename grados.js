import { mostrarAlumnos } from "./alumnos.js";
import { header } from "./header.js";

export async function mostrarGrados(idNivel, usuario, sinBotones = false) {
    const contenedorGrados = document.createElement("div");
    contenedorGrados.className = "grados-listado";

    contenedorGrados.appendChild(header(usuario));

    try {
        const res = await fetch("http://localhost:3000/grados");
        if (!res.ok) throw new Error("Error al cargar grados");

        const grados = await res.json();
        const filtrados = grados.filter(g => String(g.id_nivel) === String(idNivel));

        if (filtrados.length === 0) {
            contenedorGrados.textContent = "No hay grados para este nivel.";
        } else {
            filtrados.forEach(grado => {
                const div = document.createElement("div");
                div.className = "grado-item";
                div.textContent = grado.nombre_grado;

                div.addEventListener("click", async () => {
                    const root = document.getElementById("root");
                    root.innerHTML = "";

                    // Pasar sinBotones a mostrarAlumnos
                    const alumnosDiv = await mostrarAlumnos(grado.id_grado, usuario, "", sinBotones);
                    root.appendChild(alumnosDiv);
                });

                contenedorGrados.appendChild(div);
            });
        }
    } catch (error) {
        contenedorGrados.textContent = "Error cargando grados: " + error.message;
        contenedorGrados.style.color = "red";
    }

    return contenedorGrados;
}
