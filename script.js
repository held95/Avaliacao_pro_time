// 🔗 URL do backend (troque depois pelo domínio real da Vercel)
const BACKEND_URL = "https://protime-backend.vercel.app";

const form = document.getElementById("form-avaliacao");
const statusEl = document.getElementById("status");
const btnCarregar = document.getElementById("btn-carregar");
const listaAvaliacoes = document.getElementById("lista-avaliacoes");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nota = document.getElementById("nota").value;
  const comentario = document.getElementById("comentario").value.trim();

  if (nota === "" || comentario === "") {
    statusEl.style.color = "red";
    statusEl.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  statusEl.style.color = "black";
  statusEl.textContent = "Enviando...";

  try {
    const response = await fetch(`${BACKEND_URL}/api/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nota: Number(nota),
        comentario,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar avaliação");
    }

    statusEl.style.color = "green";
    statusEl.textContent = "Avaliação enviada com sucesso!";

    form.reset();
  } catch (error) {
    console.error(error);
    statusEl.style.color = "red";
    statusEl.textContent = "Erro ao enviar. Tente novamente.";
  }
});

btnCarregar.addEventListener("click", async () => {
  statusEl.style.color = "black";
  statusEl.textContent = "Carregando avaliações...";

  try {
    const response = await fetch(`${BACKEND_URL}/api/ratings`);
    if (!response.ok) {
      throw new Error("Erro ao buscar avaliações");
    }

    const data = await response.json();

    listaAvaliacoes.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      listaAvaliacoes.innerHTML = "<li>Nenhuma avaliação registrada ainda.</li>";
    } else {
      data.slice().reverse().forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `Nota: ${item.nota} | ${item.comentario}`;
        listaAvaliacoes.appendChild(li);
      });
    }

    statusEl.textContent = "";
  } catch (error) {
    console.error(error);
    statusEl.style.color = "red";
    statusEl.textContent = "Erro ao buscar avaliações.";
  }
});
