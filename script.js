// 🔧 CONFIG JSONBIN.IO
const BIN_ID = "69331591d0ea881f40152965";  
const API_KEY = "$2a$10$BDVWfPs2WXIPsw8Kd1kQfOVtRImf506MKMwjsJ8q7Z86MQJozfF9a";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// 🔧 Função para salvar feedback no JSONBin (PUT atualiza todo o JSON)
async function salvarFeedback(feedback) {
  // Busca dados atuais
  const dadosAtuais = await fetch(JSONBIN_URL, {
    headers: { "X-Master-Key": API_KEY }
  }).then(r => r.json());

  // Atualiza lista
  const novosFeedbacks = dadosAtuais.record.feedbacks || [];
  novosFeedbacks.push(feedback);

  // Envia de volta para o JSONBin
  return fetch(JSONBIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify({ feedbacks: novosFeedbacks })
  }).then(r => r.json());
}


// 🔥 CÓDIGO PRINCIPAL DO FORMULÁRIO
document.addEventListener("DOMContentLoaded", () => {
  const ratingButtons = document.querySelectorAll(".emoji");
  const notaRange = document.getElementById("notaRange");
  const notaValue = document.getElementById("notaValue");
  const feedbackForm = document.getElementById("feedbackForm");
  const statusEl = document.getElementById("status");
  const clearBtn = document.getElementById("clearBtn");

  let selectedRating = null;

  // ⭐ Seleção das carinhas
  ratingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedRating = btn.dataset.value;
    });
  });

  // ⭐ Mostra valor do range
  notaRange.addEventListener("input", () => {
    notaValue.textContent = notaRange.value;
  });

  // ⭐ Botão limpar
  clearBtn.addEventListener("click", () => clearForm());

  // ⭐ Envio do formulário
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";

    if (!selectedRating) {
      statusEl.textContent = "Por favor selecione uma carinha.";
      return;
    }

    // 📦 Dados a serem enviados
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

      statusEl.textContent = "Obrigado! Feedback enviado com sucesso.";
      clearForm();
    } catch (err) {
      console.error("Erro JSONBin → ", err);
      statusEl.textContent = "Erro ao enviar. Tente novamente.";
    }
  });

  // ⭐ Reset visual
  function clearForm() {
    feedbackForm.reset();
    ratingButtons.forEach((b) => b.classList.remove("selected"));
    selectedRating = null;
    notaRange.value = 8;
    notaValue.textContent = "8";
  }
});
