const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxONG348u2l5WeGlYvZbBTlej0G6wOY_URvRLjwj4-Sw42IMUDidQdDhLfaXdYdaTCH/exec";

document.addEventListener("DOMContentLoaded", () => {
  const ratingButtons = document.querySelectorAll(".emoji");
  const notaRange     = document.getElementById("notaRange");
  const notaValue     = document.getElementById("notaValue");
  const feedbackForm  = document.getElementById("feedbackForm");
  const statusEl      = document.getElementById("status");
  const clearBtn      = document.getElementById("clearBtn");

  let selectedRating = null;

  // ----------------- Emojis -----------------
  ratingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedRating = btn.dataset.value;
    });
  });

  // ----------------- Range da nota -----------------
  notaRange.addEventListener("input", () => {
    notaValue.textContent = notaRange.value;
  });

  // ----------------- Limpar formulário -----------------
  clearBtn.addEventListener("click", () => clearForm());

  // ----------------- Enviar feedback -----------------
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";

    if (!selectedRating) {
      statusEl.textContent = "Por favor, selecione como foi sua experiência.";
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      experiencia_emoji: selectedRating,
      indicaria:
        feedbackForm.querySelector('input[name="indicaria"]:checked')?.value ||
        "",
      nota_plataforma: notaRange.value,
      sugestoes_melhorias: document.getElementById("melhorias").value.trim(),
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      userAgent: navigator.userAgent,
    };

    try {
      statusEl.textContent = "Enviando...";

      const formData = new URLSearchParams(payload);

      // IMPORTANTE: no-cors por causa do domínio diferente (Vercel -> Google)
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      // Se o fetch não explodiu, consideramos OK
      statusEl.textContent = "✅ Obrigado! Sua avaliação foi enviada.";
      clearForm();
    } catch (err) {
      console.error("Erro ao enviar para o endpoint:", err);
      statusEl.innerHTML =
        "⚠️ Não foi possível enviar ao servidor. O feedback foi salvo offline.";
      saveFallback(payload);
      clearForm();
    }
  });

  // ----------------- Funções auxiliares -----------------
  function clearForm() {
    ratingButtons.forEach((b) => b.classList.remove("selected"));
    selectedRating = null;
    feedbackForm.reset();
    notaRange.value = 8;
    notaValue.textContent = "8";
  }

  function saveFallback(payload) {
    const key = "protime_feedback_local";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push(payload);
    localStorage.setItem(key, JSON.stringify(arr));
    console.log("Backup local salvo →", payload);
  }
});
