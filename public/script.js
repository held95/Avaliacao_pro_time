// 🔧 CONFIG JSONBIN.IO
const BIN_ID = "69331591d0ea881f40152965";
const API_KEY = "$2a$10$/rLQU2j6EYy3acI3r/2iezHevzw4TRWGG3hF.uo3xl6AcZAJtWxe";  // MASTER KEY CORRETA

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;


// 🔧 Função para salvar feedback no JSONBin
async function salvarFeedback(feedback) {

  // 1️⃣ Buscar conteúdo atual
  const resposta = await fetch(JSONBIN_URL, {
    method: "GET",
    headers: {
      "X-Master-Key": API_KEY
    }
  });

  const json = await resposta.json();
  let lista = json.record.feedbacks || [];

  lista.push(feedback);

  // 2️⃣ Atualizar conteúdo
  return fetch(JSONBIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
      "X-Bin-Versioning": "off"
    },
    body: JSON.stringify({ feedbacks: lista })
  });
}


// 🔥 FORMULÁRIO
document.addEventListener("DOMContentLoaded", () => {
  const ratingButtons = document.querySelectorAll(".emoji");
  const notaRange = document.getElementById("notaRange");
  const notaValue = document.getElementById("notaValue");
  const feedbackForm = document.getElementById("feedbackForm");
  const statusEl = document.getElementById("status");
  const clearBtn = document.getElementById("clearBtn");

  let selectedRating = null;

  ratingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedRating = btn.dataset.value;
    });
  });

  notaRange.addEventListener("input", () => {
    notaValue.textContent = notaRange.value;
  });

  clearBtn.addEventListener("click", () => clearForm());

  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";

    if (!selectedRating) {
      statusEl.textContent = "Por favor selecione uma carinha.";
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      experiencia_emoji: selectedRating,
      indicaria: feedbackForm.querySelector('input[name="indicaria"]:checked')?.value || "",
      nota_plataforma: notaRange.value,
      sugestoes_melhorias: document.getElementById("melhorias").value.trim(),
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      userAgent: navigator.userAgent,
    };

    try {
      statusEl.textContent = "Enviando...";

      await salvarFeedback(payload);

      statusEl.textContent = "Feedback enviado com sucesso!";
      clearForm();

    } catch (err) {
      console.error("Erro ao salvar feedback:", err);
      statusEl.textContent = "Erro ao enviar feedback.";
    }
  });

  function clearForm() {
    feedbackForm.reset();
    ratingButtons.forEach((b) => b.classList.remove("selected"));
    selectedRating = null;
    notaRange.value = 8;
    notaValue.textContent = "8";
  }
});



