require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    "https://gentle-tree-01f568900.7.azurestaticapps.net",
    "http://localhost:3000",
  ]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend OK 🚀");
});

// エフェメラルキー取得
app.post("/realtime/session", async (req, res) => {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    const response = await fetch(
      `${endpoint}/openai/v1/realtime/client_secrets`,
      {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: deployment,
          voice: "onyx",
          instructions: `
            あなたは落ち着いた男性のAIです。
            日本語で自然に会話してください。
            短く、わかりやすく答えてください。
          `
        }),
      }
    );

    const data = await response.json();
    console.log("Session response:", JSON.stringify(data).substring(0, 200));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "session作成失敗" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Backend running on port " + port);
});