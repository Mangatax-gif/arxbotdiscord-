const http = require("http");
const {
    Client,
    GatewayIntentBits,
    ActivityType,
    EmbedBuilder,
} = require("discord.js");
const fs = require("fs");

// =====================
// SERVIDOR (24/7)
// =====================
http.createServer((req, res) => {
    res.write("ArxBot activo");
    res.end();
}).listen(3000);

// =====================
// BOT DISCORD
// =====================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const prefix = "!";

// =====================
// ARCHIVO SORTEOS (OPTIMIZADO)
// =====================
const file = "./sorteos.json";

if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]));
}

let sorteos = JSON.parse(fs.readFileSync(file));

// =====================
// ARCHIVOS REGLAS
// =====================
const reglasFile = "./reglas.json";
const logFile = "./reglas_log.json";

if (!fs.existsSync(reglasFile)) {
    fs.writeFileSync(reglasFile, JSON.stringify([
        "El equipo de administración solo puede banear o kickear con una justificación válida. El aislamiento sí puede usarse como medida moderada.",
        "Se prohíbe tratar de forma agresiva, insultar o faltar el respeto a otros miembros, a menos que exista confianza entre ambas personas. Si es solo por insultar, especialmente a usuarios nuevos, será sancionado.",
        "No está permitido compartir contenido vulgar, inapropiado o NSFW. El incumplimiento de esta regla resultará en expulsión inmediata.",
        "Este servidor es para todos, por lo tanto se espera respeto y buena convivencia entre los miembros.",
        "El spam está prohibido sin excepción, incluyendo lider admin hasta arliano (todos). El envío de links está permitido solo en el canal multimedia y de forma moderada, principalmente de canales o videos, evitando enviar cada publicación o hacer spam.",
        "Respeto con los miembros del servidor.",
        "No menciones innecesariamente al propietario. Usa las menciones solo cuando sea realmente necesario.",
        "Las decisiones del owner son finales. Tiene la última palabra en cualquier situación y también sobre las reglas del servidor.",
        "Eviten estar pidiendo orbes constantemente. Si alguien puede ayudar, lo hará, pero no estén insistiendo en el servidor."
    ], null, 2));
}

if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, JSON.stringify([]));
}

// =====================
// TABLA COMIDA
// =====================
const foodData = {
    1: 20,2: 40,3: 80,4: 120,5: 140,6: 180,7: 200,8: 240,9: 260,10: 580,
    11: 920,12: 1240,13: 1560,14: 1900,15: 2220,16: 2540,17: 2860,18: 3200,19: 3520,
    20: 12760,21: 22020,22: 31260,23: 40520,24: 49760,25: 59000,26: 68260,27: 77500,
    28: 86760,29: 96000,30: 182400,31: 268800,32: 355200,33: 441600,34: 528000,
    35: 614400,36: 700800,37: 787200,38: 873600,39: 960000,40: 1230000,41: 1510000,
    42: 1780000,43: 2050000,44: 2320000,45: 2600000,46: 2870000,47: 3140000,
    48: 3410000,49: 3690000,50: 3720000,51: 3760000,52: 3800000,53: 3840000,
    54: 3880000,55: 3920000,56: 3960000,57: 3990000,58: 4030000,59: 4070000,
    60: 4110000,61: 4160000,62: 4200000,63: 4240000,64: 4290000,65: 4330000,
    66: 4380000,67: 4420000,68: 4460000,69: 4510000,
};

// =====================
// BOT READY
// =====================
client.once("ready", () => {
    console.log(`ArxBot encendido como ${client.user.tag}`);

    client.user.setActivity("ArxDraCiTy", {
        type: ActivityType.Watching,
    });
});

// =====================
// MESSAGE EVENT
// =====================
client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    let reglas = JSON.parse(fs.readFileSync(reglasFile));
    let reglasLog = JSON.parse(fs.readFileSync(logFile));

    // =====================
    // !ALIMENTAR
    // =====================
    if (msg.startsWith(prefix + "alimentar")) {
        const parts = msg.split(" ");
        const from = parseInt(parts[1]);
        const to = parseInt(parts[3]);

        if (!from || !to || from >= to) {
            return message.reply("❌ Usa: !alimentar 1 a 70");
        }

        let total = 0;

        for (let i = from; i < to; i++) {
            const value = foodData[i];
            if (value === undefined) {
                return message.reply(`❌ No tengo datos del nivel **${i}**`);
            }
            total += value;
        }

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
`:bar_chart:✦━━━━━ **CÁLCULO DE COMIDA** ━━━━━✦:bar_chart:

:chart_with_upwards_trend: Desde el nivel: **${from}**
:chart_with_downwards_trend: Hasta el nivel: **${to}**

━━━━━━━━━━━━━━━
:tomato: Comida estimada: **${total.toLocaleString("es-ES")}**
━━━━━━━━━━━━━━━`
            );

        return message.reply({ embeds: [embed] });
    }

    // =====================
    // !GRANJA
    // =====================
    const farmData = { 30: 25200, 40: 28800 };

    if (msg.startsWith(prefix + "granja")) {
        const args = msg.split(" ");
        const amount = parseInt(args[1]);
        const level = parseInt(args[2]);

        if (!amount || !level) {
            return message.reply("❌ Usa: !granja <cantidad> <nivel 30 o 40>");
        }

        const perCycle = farmData[level];

        if (!perCycle) {
            return message.reply("❌ Solo niveles 30 o 40");
        }

        const perCycleTotal = perCycle * amount;
        const perDay = perCycleTotal * 4;
        const perWeek = perDay * 7;

        let tip = level === 30 ? "\n💡 Tip: nivel 40 es más eficiente para farmeo a largo plazo" : "";

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setDescription(
`🌱✦━━━━━ **GRANJA DE NEGATIVOS/POSITIVOS** ━━━━━✦🌱

🐲 **Negativos:** ${amount}
⏱ **Producción:** cada 6 horas

━━━━━━━━━━━━━━━
📊 **NIVEL ${level}**
📦 Por ciclo (1 granja): ${perCycle.toLocaleString("es-ES")} 🍅
📦 Por ciclo (${amount} granjas): ${perCycleTotal.toLocaleString("es-ES")} 🍅

📊 **POR DÍA** (4 ciclos):
🍅 ${perDay.toLocaleString("es-ES")} comida

📊 **POR SEMANA**:
🍅 ${perWeek.toLocaleString("es-ES")} comida
━━━━━━━━━━━━━━━${tip}`
            );

        return message.reply({ embeds: [embed] });
    }

    // =====================
    // 🔵 REGLAS
    // =====================

    if (msg === prefix + "reglas") {
        let texto = `𝐑𝐄𝐆𝐋𝐀𝐒 𝐃𝐄𝐋 𝐒𝐄𝐑𝐕𝐈𝐃𝐎𝐑
━━━━━━━━━━━━━━━━━━━━━━
╭୨ Estas son las reglas básicas del servidor.
━━━━━━━━━━━━━━━━━━━━━━

`;

        reglas.forEach((r, i) => {
            texto += `**${i + 1}.** ${r}\n\n`;
        });

        texto += "━━━━━━━━━━━━━━━━━━━━━━\n╰୨ Cumplir estas reglas garantiza un mejor ambiente para todos.";

        return message.channel.send({
            embeds: [new EmbedBuilder().setColor(0x00115a).setDescription(texto)]
        });
    }

    if (msg.startsWith(prefix + "regla")) {
        const args = message.content.split(" ");
        const num = parseInt(args[1]);
        const accion = args[2];

        if (!reglas[num - 1]) return;

        if (!accion) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00115a)
                        .setTitle(`📜 REGLA ${num}`)
                        .setDescription(`**${num}.** ${reglas[num - 1]}`)
                ]
            });
        }

        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ Solo admins.");
        }

        if (accion === "edit") {
            const nuevo = args.slice(3).join(" ");
            reglas[num - 1] = nuevo;

            reglasLog.push({
                user: message.author.id,
                accion: "edit",
                regla: num,
                despues: nuevo,
                fecha: new Date().toLocaleString()
            });

            fs.writeFileSync(reglasFile, JSON.stringify(reglas, null, 2));
            fs.writeFileSync(logFile, JSON.stringify(reglasLog, null, 2));

            return message.reply("✏️ Regla editada");
        }

        if (accion === "add") {
            const nueva = args.slice(3).join(" ");
            reglas.push(nueva);

            reglasLog.push({
                user: message.author.id,
                accion: "add",
                regla: reglas.length,
                despues: nueva,
                fecha: new Date().toLocaleString()
            });

            fs.writeFileSync(reglasFile, JSON.stringify(reglas, null, 2));
            fs.writeFileSync(logFile, JSON.stringify(reglasLog, null, 2));

            return message.reply("➕ Regla añadida");
        }
    }

    if (msg === prefix + "reglas log") {
        let texto = "";

        reglasLog.slice(-5).reverse().forEach(log => {
            texto += `✏️ Regla ${log.regla}\n➤ ${log.despues}\n\n`;
        });

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x00115a)
                    .setTitle("📜 HISTORIAL")
                    .setDescription(texto || "Sin cambios aún.")
            ]
        });
    }

// =====================
// 🟠 SORTEOS
// =====================

function getRareza(r) {
    switch (r.toUpperCase()) {
        case "L": return "<:L_orbes:1491315618836648037>";
        case "M": return "<:M_orbes:1491315496216301678>";
        case "H": return "<:H_orbes:1491315422232842391>";
        case "C": return "💀";
        default: return r;
    }
}

const allowedRoleId = "1491196073065320458";
const hasRole = message.member.roles.cache.has(allowedRoleId);
const isAdmin = message.member.permissions.has("Administrator");

// LIST
if (msg.startsWith(prefix + "sorteo list")) {
    if (sorteos.length === 0) {
        return message.reply("❌ No hay sorteos activos.");
    }

    const grouped = {};
    let totalOrbes = 0;

    sorteos.forEach((item, index) => {
        if (!grouped[item.user]) grouped[item.user] = [];
        grouped[item.user].push({ ...item, id: index + 1 });
    });

    let text = "━━━━━━━━━━━━━━━\n\n";

    for (const user in grouped) {
        text += `┃ 🏆 <@${user}>\n`;

        grouped[user].forEach((item) => {
            totalOrbes += parseInt(item.cantidad);

            text += `┃ ╰୨₊˚︰ [${item.id}] 🐉 **${item.dragon}** ${getRareza(item.rareza)} — **${item.cantidad}** orbes ⟣\n`;
        });

        text += "\n";
    }

    text += "━━━━━━━━━━━━━━━\n";
    text += `📊 ***TOTAL DE ORBES***: **${totalOrbes.toLocaleString("es-ES")}**\n`;
    text += "━━━━━━━━━━━━━━━";

    const embed = new EmbedBuilder()
        .setColor(0xffa500)
        .setTitle("🎁 **SORTEOS ACTIVOS**")
        .setDescription(text);

    return message.channel.send({
        embeds: [embed],
        allowedMentions: { parse: [] },
    });
}

// ADD
if (msg.startsWith(prefix + "sorteo add")) {
    if (!hasRole && !isAdmin) {
        return message.reply("❌ No tienes permiso.");
    }

    const args = message.content.split(" ");
    const dragon = args[2];
    const cantidad = args[3];
    const rareza = args[4];

    if (!dragon || !cantidad || !rareza) {
        return message.reply("❌ Usa: !sorteo add <dragon> <cantidad> <L/M/H/C>");
    }

    sorteos.push({
        dragon,
        cantidad,
        rareza,
        user: message.author.id,
    });

    fs.writeFileSync(file, JSON.stringify(sorteos, null, 2));

    return message.reply(`✅ Añadido: 🐉 **${dragon}** ${getRareza(rareza)} — **${cantidad}**`);
}

// REMOVE
if (msg.startsWith(prefix + "sorteo remove")) {
    if (!hasRole && !isAdmin) {
        return message.reply("❌ No tienes permiso.");
    }

    const args = msg.split(" ");
    const id = parseInt(args[2]) - 1;

    if (isNaN(id) || !sorteos[id]) {
        return message.reply("❌ ID inválido.");
    }

    const removed = sorteos[id];

    sorteos.splice(id, 1);
    fs.writeFileSync(file, JSON.stringify(sorteos, null, 2));

    return message.reply(`🗑️ Eliminado: 🐉 ${removed.dragon}`);
}

});

// =====================
// LOGIN
// =====================
client.login(process.env.TOKEN);
