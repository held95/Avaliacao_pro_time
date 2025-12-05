const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz0P6BpHQZTEGt9_JaUoUQxUfb0pUdT2oUfU6zEkUxHDU8GcDLaM5b74Nr1TLtQFZzQ/exec";

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

      const formData = new URLSearchParams(payload);

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",     // importante (Vercel -> Google)
        body: formData       // e.parameter no Apps Script
      });

      statusEl.textContent = "Obrigado! Feedback enviado.";
      clearForm();
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Erro ao enviar. Tente novamente mais tarde.";
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
