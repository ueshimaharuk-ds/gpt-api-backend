require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// フロントエンドのURL（Azure Static Web Appsなど）
app.use(cors({
  origin: "https://gentle-tree-01f568900.7.azurestaticapps.net"
}));

app.use(express.json());

// 確認用
app.get("/", (req, res) => {
  res.send("Azure Backend OK 🚀");
});

// セッション取得（エフェメラルキーの発行）
app.post("/realtime/session", async (req, res) => {
  try {
    // Azure OpenAIのエンドポイントURLを構築
    // .envには https://gpt-api-realtime.openai.azure.com/ を設定してください
    const url = `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/gpt-realtime-1.5/realtime/sessions?api-version=2024-10-01-preview`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "api-key": process.env.AZURE_OPENAI_KEY, // Azure Portalで確認したキー
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-realtime-1.5",
        voice: "alloy",
        instructions: `
        あなたは落ち着いた男性のAIです。
        日本語で自然に会話してください。
        短く、わかりやすく答えてください。
        `
      }),
    });

    const data = await response.json();
    
    // Azureから返ってきたセッション情報（client_secret等）をそのままフロントへ
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Azure session作成失敗" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Backend running on port " + port);
});