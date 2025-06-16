import { Login } from "./components/login.js";
import { gradospanel } from "./components/niveles.js";

const root = document.getElementById("root");

function mostrarLogin() {
  root.innerHTML = "";

  root.appendChild(
    Login(async (usuario) => {
      root.innerHTML = "";

      const panelGrados = await gradospanel(usuario); // Se pasa el usuario logueado
      root.appendChild(panelGrados);
    })
  );
}

mostrarLogin();
