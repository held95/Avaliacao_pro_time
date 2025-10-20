/* script.js
 * Antes de subir ao GitHub/vercel: substitua SCRIPT_URL pela URL do seu Apps Script (ver instruções abaixo).
 * Se você não configurar o Apps Script, o formulário salvará no console/localStorage (modo fallback).
 */

const SCRIPT_URL = 'https://api.sheetmonkey.io/form/6oTzuXeWdojq4hSzCAQRKc'; // <-- editar antes de publicar

document.addEventListener('DOMContentLoaded', () => {
  const ratingButtons = document.querySelectorAll('.emoji');
  const notaRange = document.getElementById('notaRange');
  const notaValue = document.getElementById('notaValue');
  const feedbackForm = document.getElementById('feedbackForm');
  const statusEl = document.getElementById('status');
  const clearBtn = document.getElementById('clearBtn');

  let selectedRating = null;

  // Emojis rating
  ratingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      ratingButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedRating = btn.dataset.value;
    });
  });

  // range display
  notaRange.addEventListener('input', () => {
    notaValue.textContent = notaRange.value;
  });

  // clear form
  clearBtn.addEventListener('click', () => {
    clearForm();
  });

  // submit
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    const indicaria = feedbackForm.querySelector('input[name="indicaria"]:checked')?.value || '';
    const melhorias = document.getElementById('melhorias').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const nota = notaRange.value;

    // Validação simples: exigir uma avaliação por emojis
    if (selectedRating === null) {
      statusEl.textContent = 'Por favor, selecione como foi sua experiência (use as carinhas).';
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      experiencia_emoji: selectedRating,
      indicaria,
      nota_plataforma: nota,
      sugestoes_melhorias: melhorias,
      nome,
      email,
      userAgent: navigator.userAgent
    };

    try {
      // Se SCRIPT_URL não configurado, usa fallback
      if (!SCRIPT_URL || SCRIPT_URL.includes('COLE_AQUI_SUA_URL')) {
        // fallback: salvar em localStorage e mostrar no console
        saveFallback(payload);
        statusEl.textContent = 'Avaliação salva localmente (endpoint não configurado).';
        clearForm();
        return;
      }

      // Envia para Apps Script (espera-se que o endpoint aceite JSON)
      statusEl.textContent = 'Enviando...';
      const res = await fetch(https://docs.google.com/spreadsheets/d/1ZmDGwn3IQJSHdPMjDm4i-jVH5eyDTRnaSWfpQDGgut8/edit?gid=0#gid=0, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(()=>null);
        throw new Error(`Resposta do servidor: ${res.status} ${text||''}`);
      }

      // resposta bem-sucedida
      statusEl.textContent = 'Obrigado! Sua avaliação foi enviada com sucesso.';
      clearForm();

    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      statusEl.textContent = 'Erro ao enviar avaliação. Conferir console. (Usando fallback de salvamento)';
      saveFallback(payload);
      clearForm();
    }
  });

  function clearForm(){
    ratingButtons.forEach(b => b.classList.remove('selected'));
    selectedRating = null;
    feedbackForm.reset();
    notaRange.value = 8;
    notaValue.textContent = 8;
  }

  function saveFallback(payload){
    // salva no localStorage para teste
    const key = 'protime_feedback_local';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push(payload);
    localStorage.setItem(key, JSON.stringify(arr));
    console.log('Fallback save ->', payload);
  }
});
