import axios from "axios";
import fs from "fs";
import http from "http";

const WEBHOOK = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

// keep alive
http.createServer((req, res) => res.end("ok")).listen(3000);

console.log("🚀 Bot API iniciado");

let anteriores = [];

if (fs.existsSync("itens.json")) {
  anteriores = JSON.parse(fs.readFileSync("itens.json"));
}

// 🔥 API REAL
const API = "https://www.pekora.zip/apisite/catalog/v3/search/items?category=All&limit=30&sortType=3&minPrice=0&maxPrice=0&currency=3";

async function verificar() {
  try {
    console.log("🔍 verificando API...");

    const res = await axios.get(API, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const itens = res.data.data;

    if (!itens || itens.length === 0) {
      console.log("❌ sem itens");
      return;
    }

    const ids = itens.map(i => i.id);

    const novos = ids.filter(id => !anteriores.includes(id));

    if (novos.length > 0) {
      for (const id of novos) {
        const item = itens.find(i => i.id === id);

        // 🔥 filtrar só ROBLOX
        if (item.creatorName !== "ROBLOX") continue;

        console.log("🚨 NOVO ITEM:", item.name);

        await axios.post(WEBHOOK, {
          content: `🚨 ITEM NOVO!\n**${item.name}**\nhttps://www.pekora.zip/catalog/${item.id}`
        });
      }

      anteriores = ids;
      fs.writeFileSync("itens.json", JSON.stringify(anteriores));
    } else {
      console.log("⏳ nada novo");
    }

  } catch (err) {
    console.log("❌ erro:", err.message);
  }
}

// loop rápido
async function loop() {
  while (true) {
    await verificar();
    await new Promise(r => setTimeout(r, 2000)); // 2s
  }
}

loop();
