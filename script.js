// 🔗 URL do backend
const BACKEND_URL = "https://protime-backend.vercel.app";

// Referências corretas dos elementos
const form = document.getElementById("form-avaliacao");
const statusEl = document.getElementById("status");
const btnCarregar = document.getElementById("btn-carregar");
const listaAvaliacoes = document.getElementById("lista-avaliacoes");

// SUBMIT DO FORM
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    facilidade: Number(document.getElementById("facilidade").value),
    utilidade: Number(document.getElementById("utilidade").value),
    velocidade: Number(document.getElementById("velocidade").value),
    clareza: Number(document.getElementById("clareza").value),
    ajuda: document.getElementById("ajuda").value,
    melhorar: document.getElementById("melhorar").value,
    momentos: document.getElementById("momentos").value,
    mudanca: document.getElementById("mudanca").value,
    beneficio: document.getElementById("beneficio").value,
    experiencia: document.getElementById("experiencia").value,
  };

  if (Object.values(payload).includes("")) {
    statusEl.style.color = "red";
    statusEl.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  statusEl.style.color = "white";
  statusEl.textContent = "Enviando...";

  try {
    const response = await fetch(`${BACKEND_URL}/api/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Erro ao enviar avaliação");

    statusEl.style.color = "#4cff8f";
    statusEl.textContent = "Avaliação enviada com sucesso!";
    form.reset();

  } catch (error) {
    console.error(error);
    statusEl.style.color = "red";
    statusEl.textContent = "Erro ao enviar. Tente novamente.";
  }
});

// BOTÃO PARA VER AVALIAÇÕES
btnCarregar.addEventListener("click", async () => {
  statusEl.style.color = "white";
  statusEl.textContent = "Carregando avaliações...";

  try {
    const response = await fetch(`${BACKEND_URL}/api/ratings`);
    if (!response.ok) throw new Error("Erro ao buscar avaliações");

    const data = await response.json();
    listaAvaliacoes.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      listaAvaliacoes.innerHTML = "<li>Nenhuma avaliação registrada ainda.</li>";
    } else {
      data.slice().reverse().forEach((item) => {
        const li = document.createElement("li");
        li.textContent = JSON.stringify(item);
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
