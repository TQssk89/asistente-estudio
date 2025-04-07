function agregarMensaje(texto, clase) {
  const chat = document.getElementById("chat");
  const burbuja = document.createElement("div");
  burbuja.classList.add("msg", clase);
  burbuja.innerText = texto;
  chat.appendChild(burbuja);
  chat.scrollTop = chat.scrollHeight;
}

function eliminarEscribiendo() {
  const chat = document.getElementById("chat");
  const burbujas = chat.querySelectorAll(".msg");
  if (burbujas.length && burbujas[burbujas.length - 1].innerText === "Escribiendo...") {
    chat.removeChild(burbujas[burbujas.length - 1]);
  }
}

async function enviarMensaje() {
  const input = document.getElementById("userInput");
  const mensaje = input.value.trim();
  if (!mensaje) return;

  agregarMensaje(mensaje, "user");
  input.value = "";
  agregarMensaje("Escribiendo...", "bot");

  try {
    const response = await fetch("https://tu-backend.netlify.app/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje })
    });

    const data = await response.json();
    eliminarEscribiendo();
    agregarMensaje(data.respuesta, "bot");
  } catch (error) {
    eliminarEscribiendo();
    agregarMensaje("Error al conectar con el servidor.", "bot");
    console.error(error);
  }
}