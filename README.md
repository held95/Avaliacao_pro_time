# Projeto: Avaliação de Experiências Protime

Este é um projeto simples em **HTML + CSS + JS** para que usuários possam avaliar suas experiências na plataforma Protime. Os envios são armazenados em um arquivo **JSON** que poderá servir como base para um backend futuro, além de integrar com um segundo front (dashboard ou I.A.).

A seguir está toda a estrutura do projeto e o código completo para você subir no GitHub e fazer deploy em serviços como **Vercel** ou **Netlify**.

---

## 📁 Estrutura de Pastas

```
projeto-protime/
│
├── index.html
├── style.css
├── script.js
├── data.json        ← onde serão armazenados os registros
└── README.md
```

---

## 📄 index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Avaliação Protime</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1>Avalie sua experiência na Protime</h1>

    <label for="nota">Sua nota (0 a 10):</label>
    <input type="number" id="nota" min="0" max="10" />

    <label for="comentario">Comentário:</label>
    <textarea id="comentario" placeholder="Como foi sua experiência?"></textarea>

    <button id="enviar">Enviar Avaliação</button>

    <p id="status"></p>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

---

## 🎨 style.css

```css
body {
  background: #f5f5f5;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  background: white;
  padding: 20px;
  width: 350px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

#status {
  margin-top: 10px;
  font-size: 14px;
  color: green;
}
```

---

## ✨ script.js

> **Importante:** Em hospedagens estáticas como Vercel, você não pode escrever diretamente em um arquivo JSON pelo front-end.
> Para isso funcionar, você precisa criar uma API (serverless function) ou rodar localmente.

A versão abaixo **simula o salvamento local** usando localStorage, para fins de demonstração:

```javascript
document.getElementById("enviar").addEventListener("click", () => {
  const nota = document.getElementById("nota").value;
  const comentario = document.getElementById("comentario").value;
  const status = document.getElementById("status");

  if (!nota || !comentario) {
    status.style.color = "red";
    status.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  const registro = {
    nota: Number(nota),
    comentario,
    data: new Date().toISOString(),
  };

  // carregar dados existentes
  const registros = JSON.parse(localStorage.getItem("avaliacoes")) || [];

  // adicionar novo
  registros.push(registro);

  // salvar
  localStorage.setItem("avaliacoes", JSON.stringify(registros));

  status.style.color = "green";
  status.textContent = "Avaliação registrada com sucesso!";

  document.getElementById("nota").value = "";
  document.getElementById("comentario").value = "";
});
```

---

## 📄 data.json (placeholder para futuro backend)

```json
[]
```

---

## 📘 README.md

```md
# Sistema de Avaliação Protime

Projeto simples em HTML, CSS e JS para registrar avaliações de usuários.

### 🚀 Funcionalidades
- Usuário registra nota e comentário
- Dados são armazenados em localStorage
- Pode servir como base para backend futuro

### 💡 Ideias de Expansão
- Criar API Serverless na Vercel para salvar avaliações em JSON real
- Criar dashboard com tabela usando outro front-end
- Criar uma I.A. que analisa sentimentos dos comentários

### ▶️ Como rodar
Apenas abra `index.html` no navegador.
```

---

Se quiser, posso gerar também:
✅ a API serverless da Vercel
✅ o dashboard de visualização
✅ a I.A. que interpreta os registros

É só pedir! 😄
