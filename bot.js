import axios from "axios";

const webhook = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

let ultimoItem = null;

async function verificarCatalogo() {
  console.log("🔍 Verificando catálogo...");

  try {
    const res = await axios.get("https://catalog.roblox.com/v1/search/items?category=All&limit=10&sortType=3");

    const items = res.data?.data;

    if (!items || items.length === 0) {
      console.log("❌ Nenhum item encontrado");
      return;
    }

    const novoItem = items[0];

    if (ultimoItem !== novoItem.id) {
      ultimoItem = novoItem.id;

      console.log("🆕 Novo item:", novoItem.name);

      await axios.post(webhook, {
        content: `🚨 NOVO ITEM!\n\n${novoItem.name}\nhttps://www.roblox.com/catalog/${novoItem.id}`
      });

    } else {
      console.log("✅ Nada novo");
    }

  } catch (err) {
    console.log("❌ ERRO:", err.message);
  }
}

// loop manual (melhor que setInterval)
async function loop() {
  while (true) {
    await verificarCatalogo();

    // espera 10 segundos
    await new Promise(r => setTimeout(r, 10000));
  }
}

console.log("🤖 Bot iniciado...");
loop();
