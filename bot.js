import fetch from "node-fetch";

const WEBHOOK = "https://discord.com/api/webhooks/1492266488441340044/FNN_HZa7vbrB2ah5EgBFjKQELSSbqA76VJrakYPfwxlwVcJXCfUyI5Pjeg3O6Tp-i4e6";

const API = "https://www.pekora.zip/catalog";

let lastId = null;

async function check() {
    try {
        const res = await fetch(API);
        const text = await res.text();

        const match = text.match(/\/catalog\/(\d+)/);

        if (!match) return;

        const id = match[1];

        if (!lastId) {
            lastId = id;
            console.log("Iniciado:", id);
            return;
        }

        if (id !== lastId) {
            lastId = id;

            console.log("NOVO ITEM:", id);

            await fetch(WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: `🚨 ITEM NOVO!\nhttps://www.pekora.zip/catalog/${id}`
                })
            });
        }

    } catch (err) {
        console.log("Erro:", err.message);
    }
}

setInterval(check, 3000);
