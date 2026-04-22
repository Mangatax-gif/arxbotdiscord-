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
// ARCHIVO SORTEOS
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
        "Se prohíbe tratar de forma agresiva, insultar o faltar el respeto a otros miembros.",
        "No está permitido compartir contenido vulgar, inapropiado o NSFW.",
        "Este servidor es para todos, se espera respeto.",
        "El spam está prohibido.",
        "Respeto con los miembros del servidor.",
        "No menciones innecesariamente al propietario.",
        "Las decisiones del owner son finales.",
        "Eviten estar pidiendo orbes constantemente."
    ], null, 2));
}

if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, JSON.stringify([]));
}

// =====================
// TABLA COMIDA
// =====================
const foodData = {
    1:20,2:40,3:80,4:120,5:140,6:180,7:200,8:240,9:260,10:580,
    11:920,12:1240,13:1560,14:1900,15:2220,16:2540,17:2860,18:3200,19:3520,
    20:12760,21:22020,22:31260,23:40520,24:49760,25:59000,26:68260,27:77500,
    28:86760,29:96000,30:182400,31:268800,32:355200,33:441600,34:528000,
    35:614400,36:700800,37:787200,38:873600,39:960000,40:1230000,41:1510000,
    42:1780000,43:2050000,44:2320000,45:2600000,46:2870000,47:3140000,
    48:3410000,49:3690000,50:3720000,51:3760000,52:3800000,53:3840000,
    54:3880000,55:3920000,56:3960000,57:3990000,58:4030000,59:4070000,
    60:4110000,61:4160000,62:4200000,63:4240000,64:4290000,65:4330000,
    66:4380000,67:4420000,68:4460000,69:4510000
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
    // 🔴 !ALIMENTAR
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
    // 🟢 !GRANJA
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
        if (!perCycle) return message.reply("❌ Solo niveles 30 o 40");

        const perCycleTotal = perCycle * amount;
        const perDay = perCycleTotal * 4;
        const perWeek = perDay * 7;

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setDescription(
`🌱✦━━━━━ **GRANJA DE NEGATIVOS/POSITIVOS** ━━━━━✦🌱

🐲 **Negativos:** ${amount}

📊 Nivel ${level}
🍅 Por ciclo: ${perCycleTotal.toLocaleString("es-ES")}
🍅 Por día: ${perDay.toLocaleString("es-ES")}
🍅 Por semana: ${perWeek.toLocaleString("es-ES")}`
            );

        return message.reply({ embeds: [embed] });
    }

    // =====================
    // 🔵 !REGLAS (FIJO)
    // =====================
    if (msg === prefix + "reglas") {

        const texto = `𝐑𝐄𝐆𝐋𝐀𝐒 𝐃𝐄𝐋 𝐒𝐄𝐑𝐕𝐄𝐑
━━━━━━━━━━━━━━━━━━━━━━
╭୨ Estas son las reglas básicas del servidor. Con el tiempo se irán actualizando con normas más específicas.
━━━━━━━━━━━━━━━━━━━━━━

**1.** El equipo de administración solo puede banear o kickear con una justificación válida. El aislamiento sí puede usarse como medida moderada.
**2.** Se prohíbe tratar de forma agresiva, insultar o faltar el respeto a otros miembros, a menos que exista confianza entre ambas personas. Si es solo por insultar, especialmente a usuarios nuevos, será sancionado.
**3.** No está permitido compartir contenido vulgar, inapropiado o NSFW. El incumplimiento de esta regla resultará en expulsión inmediata.
**4.** Este servidor es para todos, por lo tanto se espera respeto y buena convivencia entre los miembros.
**5.**El spam está prohibido sin excepción, incluyendo lider admin hasta arliano (todos). El envío de links está permitido solo en el canal multimedia y de forma moderada, principalmente de canales o videos, evitando enviar cada publicación o hacer spam.
**6.** Respeto con los miembros del servidor.
**7.**No menciones innecesariamente al propietario. Usa las menciones solo cuando sea realmente necesario.
**8.** Las decisiones del owner son finales. Tiene la última palabra en cualquier situación y también sobre las reglas del servidor.
**9.** Eviten estar pidiendo orbes constantemente. Si alguien puede ayudar, lo hará, pero no estén insistiendo en el servidor.
━━━━━━━━━━━━━━━━━━━━━━
╰୨ Cumplir estas reglas garantiza un mejor ambiente para todos.`;

        const embed = new EmbedBuilder()
            .setColor(0x00115a)
            .setDescription(texto);

        return message.channel.send({ embeds: [embed] });
    }

    // =====================
    // 🔵 !REGLA
    // =====================
    if (msg.startsWith(prefix + "regla")) {

        const args = message.content.split(" ");
        const num = parseInt(args[1]);
        const accion = args[2];

        if (!reglas[num - 1]) return;

        if (!accion) {
            const embed = new EmbedBuilder()
                .setColor(0x00115a)
                .setTitle(`📜 REGLA ${num}`)
                .setDescription(`**${num}.** ${reglas[num - 1]}`);

            return message.reply({ embeds: [embed] });
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

            return message.reply({ embeds: [new EmbedBuilder().setColor(0x00115a).setDescription(`✏️ **Regla ${num} editada**`)] });
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

            return message.reply({ embeds: [new EmbedBuilder().setColor(0x00115a).setDescription(`➕ **Regla añadida**`)] });
        }
    }

    // =====================
    // 🔵 !REGLAS LOG
    // =====================
    if (msg === prefix + "reglas log") {

        let texto = "";

        reglasLog.slice(-5).reverse().forEach(log => {
            texto += `✏️ Regla ${log.regla}\n➤ ${log.despues}\n\n`;
        });

        const embed = new EmbedBuilder()
            .setColor(0x00115a)
            .setTitle("📜 HISTORIAL")
            .setDescription(texto || "Sin cambios aún.");

        return message.channel.send({ embeds: [embed] });
    }

});

// =====================
// LOGIN
// =====================
client.login(process.env.TOKEN);
