const WEBHOOK_URL = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

let lastItem = null;

async function check() {
    try {
        const res = await fetch("https://www.pekora.zip/apisite/catalog/v1/items?limit=10");
        
        const text = await res.text();

        // evita crash se vier HTML
        if (text.startsWith("<")) {
            console.log("API bloqueou (HTML recebido)");
            return;
        }

        const data = JSON.parse(text);

        const item = data?.data?.[0];
        if (!item) return;

        if (item.id !== lastItem) {
            lastItem = item.id;

            await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: `🚨 NOVO ITEM!\n${item.name}\nhttps://www.pekora.zip/catalog/${item.id}`
                })
            });

            console.log("Novo item enviado:", item.name);
        }

    } catch (err) {
        console.log("Erro:", err.message);
    }
}

// roda a cada 10 segundos
setInterval(check, 10000);

console.log("Bot rodando...");
