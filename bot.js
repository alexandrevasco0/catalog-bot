const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const WEBHOOK = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

let lastIds = new Set();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const getItems = async () => {
    try {
        const res = await fetch("https://www.pekora.zip/catalog?sortType=RecentlyUpdated", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "text/html"
            }
        });

        const html = await res.text();

        // pega ids dos itens pelo link
        const matches = [...html.matchAll(/\/catalog\/(\d+)/g)];
        return matches.map(m => m[1]);

    } catch (err) {
        console.log("Erro ao pegar itens:", err.message);
        return [];
    }
};

const sendDiscord = async (id) => {
    await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: `🚨 ITEM NOVO!\nhttps://www.pekora.zip/catalog/${id}`
        })
    });
};

const main = async () => {
    console.log("Bot rodando...");

    while (true) {
        const items = await getItems();

        for (const id of items) {
            if (!lastIds.has(id)) {
                lastIds.add(id);
                console.log("Novo item:", id);
                await sendDiscord(id);
            }
        }

        await sleep(5000); // verifica a cada 5s
    }
};

main();
