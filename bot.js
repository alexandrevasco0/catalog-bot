import fetch from "node-fetch";

const WEBHOOK = "https://discord.com/api/webhooks/1492266488441340044/FNN_HZa7vbrB2ah5EgBFjKQELSSbqA76VJrakYPfwxlwVcJXCfUyI5Pjeg3O6Tp-i4e6";

const API = "https://www.pekora.zip/apisite/catalog/v1/search?sortType=3";

let lastId = null;

async function check() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        const item = data?.data?.[0];
        if (!item) return;

        if (!lastId) {
            lastId = item.id;
            console.log("Iniciado:", item.name);
            return;
        }

        if (item.id !== lastId) {
            lastId = item.id;

            console.log("NOVO:", item.name);

            await fetch(WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: `@everyone 🚨 ITEM NOVO!\n\n${item.name}\n💰 ${item.price}\nhttps://www.pekora.zip/catalog/${item.id}`
                })
            });
        }

    } catch (err) {
        console.log("Erro:", err.message);
    }
}

setInterval(check, 2000);
