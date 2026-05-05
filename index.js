require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// フロントエンドのURLを許可
app.use(cors({
  origin: "https://gentle-tree-01f568900.7.azurestaticapps.net"
}));

app.use(express.json());

app.post("/realtime/session", async (req, res) => {
  try {
    // Azure OpenAIポータルで確認したエンドポイントとデプロイ名を使用
    // 例: https://gpt-api-realtime.openai.azure.com/
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, ""); // 末尾のスラッシュを削除
    const deployment = "gpt-realtime-1.5"; 
    const apiVersion = "2024-10-01-preview";

    const url = `${endpoint}/openai/deployments/${deployment}/realtime/sessions?api-version=${apiVersion}`;

    console.log("Connecting to Azure URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "api-key": process.env.AZURE_OPENAI_KEY, // 'Authorization' ではなく 'api-key'
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-realtime-1.5",
        voice: "alloy",
        instructions: "あなたは落ち着いた男性のAIです。日本語で自然に会話してください。"
      }),
    });

    const data = await response.json();

    // デバッグ用にAzureからの生の応答を表示
    console.log("Azure Response Status:", response.status);
    console.log("Azure Response Data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(`Azure API Error: ${data.error?.message || response.statusText}`);
    }

    // ここで返る data の中に client_secret (エフェメラルキー) が含まれます
    res.json(data);
  } catch (err) {
    console.error("Session creation failed:", err.message);
    res.status(500).json({ error: "Azure session作成失敗", message: err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Backend running on port " + port);
});