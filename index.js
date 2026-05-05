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
    // image_f1fff7.png の情報に基づく設定
    const endpoint = "https://gpt-api-realtime.openai.azure.com";
    const deployment = "gpt-realtime-1.5";
    const apiVersion = "2024-10-01-preview";

    // 【重要】Realtime Session 用の正しいパス
    // /openai/realtime/sessions ではなく /openai/deployments/{name}/realtime/sessions です
    const url = `${endpoint}/openai/deployments/${deployment}/realtime/sessions?api-version=${apiVersion}`;

    console.log("Connecting to Azure URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "api-key": process.env.AZURE_OPENAI_KEY, // image_f1fff7.png のキーを使用
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-realtime-1.5",
        voice: "alloy",
        instructions: "あなたは落ち着いた男性のAIです。日本語で短く簡潔に答えてください。"
      }),
    });

    const data = await response.json();

    console.log("Azure Response Status:", response.status);

    if (!response.ok) {
      console.error("Azure Error Detail:", JSON.stringify(data, null, 2));
      return res.status(response.status).json(data);
    }

    // 成功すれば data.client_secret.value が返ります
    res.json(data);
  } catch (err) {
    console.error("Session creation failed:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Backend running on port " + port);
});