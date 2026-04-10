import axios from "axios";
import fs from "fs";
import http from "http";

// 🔥 COLOCA SEU WEBHOOK AQUI
const WEBHOOK = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

// API (por enquanto Roblox oficial)
const URL = "https://catalog.roblox.com/v1/search/items?category=All&limit=10&sortType=3";

// =====================
// KEEP ALIVE SERVER
// =====================
http.createServer((req, res) => {
  res.write("Bot rodando");
  res.end();
}).listen(3000);

console.log("🌐 Servidor fake rodando na porta 3000");

// =====================
// LOAD ULTIMO ITEM
// =====================
let ultimoItem = null;

if (fs.existsSync("ultimo.txt")) {
  ultimoItem = fs.readFileSync("ultimo.txt", "utf-8");
  console.log("📂 Último item carregado:", ultimoItem);
}

// =====================
// FUNÇÃO PRINCIPAL
// =====================
async function verificarCatalogo() {
  console.log("🔍 Verificando catálogo às", new Date().toLocaleTimeString());

  try {
    const res = await axios.get(URL, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const items = res.data?.data;

    if (!items || items.length === 0) {
      console.log("❌ Nenhum item encontrado");
      return;
    }

    const novoItem = items[0];

    // primeira execução
    if (!ultimoItem) {
      ultimoItem = novoItem.id;
      fs.writeFileSync("ultimo.txt", String(novoItem.id));
      console.log("🟡 Primeiro item salvo:", novoItem.name);
      return;
    }

    // novo item detectado
    if (String(novoItem.id) !== String(ultimoItem)) {
      ultimoItem = novoItem.id;

      fs.writeFileSync("ultimo.txt", String(novoItem.id));

      console.log("🚨 NOVO ITEM:", novoItem.name);

      await axios.post(WEBHOOK, {
        content: `🚨 ITEM NOVO!\n\n🧢 ${novoItem.name}\n🔗 https://www.roblox.com/catalog/${novoItem.id}`
      });

      console.log("✅ Enviado pro Discord");

    } else {
      console.log("⏳ Nada novo");
    }

  } catch (err) {
    console.log("❌ ERRO:", err.message);
  }
}

// =====================
// LOOP INFINITO
// =====================
async function loop() {
  while (true) {
    await verificarCatalogo();
    await new Promise(r => setTimeout(r, 10000));
  }
}

// =====================
// KEEP ALIVE LOG
// =====================
setInterval(() => {
  console.log("💓 Bot ainda vivo...");
}, 30000);

// =====================
// ANTI-CRASH
// =====================
process.on("uncaughtException", (err) => {
  console.log("💥 Erro não tratado:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("💥 Promise não tratada:", err);
});

// =====================
// START
// =====================
console.log("🤖 Bot iniciado...");
loop();
