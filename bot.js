const axios = require("axios");

const WEBHOOK_URL = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

let ultimoItem = null;

async function checkCatalog() {
  try {
    console.log("🔍 Verificando catálogo...");

    const res = await axios.get(
      "https://catalog.roblox.com/v1/search/items?category=All&limit=10&sortType=3"
    );

    const items = res.data.data;

    if (!items || items.length === 0) {
      console.log("⚠️ Nenhum item encontrado");
      return;
    }

    const novoItem = items[0];

    // primeira vez
    if (!ultimoItem) {
      ultimoItem = novoItem.id;
      console.log("🟡 Bot iniciado, salvando primeiro item...");
      return;
    }

    // item novo detectado
    if (novoItem.id !== ultimoItem) {
      console.log("🚨 ITEM NOVO ENCONTRADO!");

      ultimoItem = novoItem.id;

      await axios.post(WEBHOOK_URL, {
        content: `🆕 Novo item!\nNome: ${novoItem.name}\nLink: https://www.roblox.com/catalog/${novoItem.id}`
      });

      console.log("✅ Mensagem enviada pro Discord");
    } else {
      console.log("⏳ Nada novo ainda...");
    }

  } catch (err) {
    console.log("❌ Erro:", err.message);
  }
}

console.log("🚀 Bot rodando...");

// roda a cada 10 segundos
setInterval(checkCatalog, 10000);
