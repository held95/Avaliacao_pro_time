import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "feedback.json");

  try {
    // cria a pasta /data se não existir
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // carrega o arquivo existente
    let existing = [];
    if (fs.existsSync(filePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (_) {}
    }

    // adiciona o novo registro
    existing.push({
      ...req.body,
      savedAt: new Date().toISOString()
    });

    // salva no arquivo
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf8");

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("ERRO AO SALVAR:", err);
    return res.status(500).json({ error: "Erro ao salvar feedback" });
  }
}

