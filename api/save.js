import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { nota, comentario } = req.body;

  if (!nota || !comentario) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  // CONFIGURAÇÃO — personalize aqui
  const owner = "SEU_USUARIO_GITHUB";
  const repo = "SEU_REPOSITORIO";
  const filePath = "api/data.json";
  const token = process.env.GITHUB_TOKEN;

  const url =
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  // 1) pegar conteúdo atual
  const current = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  }).then((r) => r.json());

  const oldContent = JSON.parse(
    Buffer.from(current.content, "base64").toString()
  );

  const newEntry = {
    nota,
    comentario,
    data: new Date().toISOString(),
  };

  const updated = [...oldContent, newEntry];

  const newContentBase64 = Buffer.from(
    JSON.stringify(updated, null, 2)
  ).toString("base64");

  // 2) criar commit
  const commit = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      message: "Novo registro de avaliação",
      content: newContentBase64,
      sha: current.sha,
    }),
  }).then((r) => r.json());

  return res.status(200).json({
    status: "success",
    commit,
    saved: newEntry,
  });
}
