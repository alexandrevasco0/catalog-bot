import axios from "axios";

const webhook = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

let ultimoItem = null;

async function verificarCatalogo() {
  try {
    console.log("🔍 Verificando catálogo...");

    const res = await axios.get("https://catalog.roblox.com/v1/search/items?category=All&limit=10&sortType=3");

    const items = res.data.data;

    if (!items || items.length === 0) {
      console.log("❌ Nenhum item encontrado");
      return;
    }

    const novoItem = items[0];

    if (ultimoItem !== novoItem.id) {
      ultimoItem = novoItem.id;

      console.log("🆕 Novo item encontrado:", novoItem.name);

      await axios.post(webhook, {
        content: `🚨 NOVO ITEM!\n\n**${novoItem.name}**\nhttps://www.roblox.com/catalog/${novoItem.id}`
      });
    } else {
      console.log("✅ Nenhum item novo");
    }

  } catch (err) {
    console.log("❌ Erro:", err.message);
  }
}

console.log("🤖 Bot rodando...");

setInterval(verificarCatalogo, 10000);
