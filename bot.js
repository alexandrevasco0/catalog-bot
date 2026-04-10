import fetch from "node-fetch";

const WEBHOOK = "https://discord.com/api/webhooks/1492273168163930126/vZ81o3RxgsI1knLYVveX_J5DSd0Wcp0olW3QHNQ67NxSHwz0m4wpS-GG-gWw9R1Te8YH";

const COOKIE = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzZXNzaW9uSWQiOiJhNzE2ZDEwZS1mNzQyLTQ5OTEtYTEyMS1hOGVhNzFlNjFjNjciLCJjcmVhdGVkQXQiOjE3NzU4NjIxMzZ9.H5MMwSoXOxkVdnRxPctT96JiZhMuF9NH5UAAag8VD1hpIUSqtIv2hJwfKA7jZ7tYVHoPe1TPyP20VR-1exA8pw";

const URL = "https://www.pekora.zip/apisite/catalog/v3/search/items?category=All&sortType=3&limit=30";

let ultimoId = null;

async function check() {
    try {
        console.log("🔍 verificando catálogo...");

        const res = await fetch(URL, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/json",
                "Referer": "https://www.pekora.zip/",
                "Origin": "https://www.pekora.zip",
                "Cookie": COOKIE
            }
        });

        if (!res.ok) {
            console.log("❌ erro:", res.status);
            return;
        }

        const data = await res.json();

        const item = data.data[0];

        if (!item) {
            console.log("❌ sem item");
            return;
        }

        if (item.id !== ultimoId) {
            ultimoId = item.id;

            console.log("🔥 ITEM NOVO:", item.name);

            await fetch(WEBHOOK, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: `🚨 NOVO ITEM!\n${item.name}\nhttps://www.pekora.zip/catalog/${item.id}`
                })
            });

        } else {
            console.log("⏳ nada novo");
        }

    } catch (err) {
        console.log("❌ erro:", err.message);
    }
}

setInterval(check, 3000);

console.log("🚀 Bot com cookie iniciado");
