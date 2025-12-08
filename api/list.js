import fetch from "node-fetch";

export default async function handler(req, res) {
  const owner = "SEU_USUARIO_GITHUB";
  const repo = "SEU_REPOSITORIO";
  const filePath = "api/data.json";
  const token = process.env.GITHUB_TOKEN;

  const url =
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  }).then((r) => r.json());

  const content = JSON.parse(
    Buffer.from(result.content, "base64").toString()
  );

  return res.status(200).json(content);
}
