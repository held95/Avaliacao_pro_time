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
