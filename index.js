const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/api/chuza", async (req, res) => {
  const { message, name = "Chuza", author = "Faheem", username = "User" } = req.query;

  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const axios = await import("axios").then(m => m.default);

    const aiRes = await axios.post(
      "https://api.a4f.co/v1/chat/completions",
      {
        model: "provider-2/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a chatbot named ${name} made by ${author}. Reply in funny Urdu and always call the user by their name: ${username}.`,
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ddc-a4f-58cf64b46fd84575a17c351b4dbc7da5`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = aiRes.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("❌ AI Error:", err.message);
    res.status(500).json({ error: "AI error" });
  }
});

module.exports = app;
