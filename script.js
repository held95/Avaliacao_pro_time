const SCRIPT_URL = "/api/feedback";

document.addEventListener("DOMContentLoaded", () => {
  const ratingButtons = document.querySelectorAll(".emoji");
  const notaRange = document.getElementById("notaRange");
  const notaValue = document.getElementById("notaValue");
  const feedbackForm = document.getElementById("feedbackForm");
  const statusEl = document.getElementById("status");
  const clearBtn = document.getElementById("clearBtn");

  let selectedRating = null;

  // emojis
  ratingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedRating = btn.dataset.value;
    });
  });

  // range
  notaRange.addEventListener("input", () => {
    notaValue.textContent = notaRange.value;
  });

  clearBtn.addEventListener("click", () => clearForm());

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
      indicaria: feedbackForm.querySelector('input[name="indicaria"]:checked')?.value || "",
      nota_plataforma: notaRange.value,
      sugestoes_melhorias: document.getElementById("melhorias").value.trim(),
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      userAgent: navigator.userAgent
    };

    try {
      statusEl.textContent = "Enviando...";

      const res = await fetch(SCRIPT_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

      if (!response.ok) {
        throw new Error(`SheetMonkey respondeu: ${response.status}`);
      }

      statusEl.textContent = "✅ Obrigado! Sua avaliação foi enviada.";
      clearForm();
    } catch (err) {
      console.error("Erro ao enviar para SheetMonkey:", err);

      statusEl.innerHTML =
        "⚠️ Não foi possível enviar ao servidor.<br>O feedback foi salvo offline.";

      saveFallback(payload);
      clearForm();
    }
  });

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

    console.log("🔄 Backup local salvo →", payload);
  }
});



