import fetch from "node-fetch";

const WEBHOOK = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

const URL = "https://www.pekora.zip/apisite/catalog/v3/search/items?category=All&sortType=3&limit=30";

async function checkCatalog() {
    try {
        console.log("🔎 verificando catálogo...");

        const res = await fetch(URL, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/json",
                "Referer": "https://www.pekora.zip/",
                "Origin": "https://www.pekora.zip"
            }
        });

        if (!res.ok) {
            console.log("❌ erro:", res.status);
            return;
        }

        const data = await res.json();

        console.log("✅ API funcionando, itens:", data.data.length);

    } catch (err) {
        console.log("❌ erro:", err.message);
    }
}

console.log("🚀 Bot iniciado");

setInterval(checkCatalog, 5000);
