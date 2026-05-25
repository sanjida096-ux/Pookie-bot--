/cmd install uptime.js const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const os = require("os");

module.exports = {
  config: {
    name: "up",
    version: "1.0.0",
    author: "Vydron2233",
    countDown: 3,
    role: 0,
    shortDescription: "bot stats image",
    longDescription: "Uptime, server uptime, ping, CPU with canvas image",
    category: "image",
    guide: "{p}up"
  },

  onStart: async function ({ event, message, api }) {
    try {
      const pingMsg = await message.reply({
        body: "🌸 𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗨𝗽𝘁𝗶𝗺𝗲..."
      });

      // ── Bot Uptime ─────────────────────────────────────────────
      const botUp = process.uptime();
      const bh = Math.floor(botUp / 3600);
      const bm = Math.floor((botUp % 3600) / 60);
      const bs = Math.floor(botUp % 60);
      const botUptimeStr = `${bh}h ${bm}m ${bs}s`;

      // ── Server Uptime ──────────────────────────────────────────
      const srvUp = os.uptime();
      const sh = Math.floor(srvUp / 3600);
      const sm = Math.floor((srvUp % 3600) / 60);
      const ss = Math.floor(srvUp % 60);
      const srvUptimeStr = `${sh}h ${sm}m ${ss}s`;

      // ── Stats ──────────────────────────────────────────────────
      const ping     = Date.now() - event.timestamp;
      const cpuUsage = os.loadavg()[0].toFixed(2);
      const botName  = "Pookie Bot";

      // ── Canvas Setup ───────────────────────────────────────────
      const W = 1000, H = 560;
      const canvas = Canvas.createCanvas(W, H);
      const ctx    = canvas.getContext("2d");

      // Background — cover-fit, hard clipped to frame
      const bgImg = await Canvas.loadImage("https://files.catbox.moe/sky61w.jpg");
      const scale = Math.max(W / bgImg.width, H / bgImg.height);
      const bgW   = bgImg.width  * scale;
      const bgH   = bgImg.height * scale;
      const bgX   = (W - bgW) / 2;
      const bgY   = (H - bgH) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.clip();
      ctx.drawImage(bgImg, bgX, bgY, bgW, bgH);
      ctx.restore();

      // ── Soft pink/rose overlay ─────────────────────────────────
      const overlay = ctx.createLinearGradient(0, 0, 0, H);
      overlay.addColorStop(0,    "rgba(80,  20, 60, 0.18)");
      overlay.addColorStop(0.45, "rgba(50,  10, 40, 0.48)");
      overlay.addColorStop(1,    "rgba(20,   5, 20, 0.82)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, W, H);

      // ── Theme ──────────────────────────────────────────────────
      const PINK    = "#FFB3C6";
      const ROSE    = "#FF6B9D";
      const HOTPINK = "#FF3E8A";
      const WHITE   = "#FFF0F5";
      const LPINK   = "#FFD6E7";

      // ── Rounded rect path ──────────────────────────────────────
      function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      // ── Glowing border line ────────────────────────────────────
      function borderLine(y) {
        const lg = ctx.createLinearGradient(0, 0, W, 0);
        lg.addColorStop(0,    "transparent");
        lg.addColorStop(0.15, ROSE);
        lg.addColorStop(0.85, HOTPINK);
        lg.addColorStop(1,    "transparent");
        ctx.save();
        ctx.strokeStyle = lg;
        ctx.lineWidth   = 2.5;
        ctx.shadowColor = ROSE;
        ctx.shadowBlur  = 16;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        ctx.restore();
      }

      // ── Corner deco ────────────────────────────────────────────
      function cornerDeco(x, y, dx, dy) {
        ctx.save();
        ctx.strokeStyle = PINK;
        ctx.lineWidth   = 2;
        ctx.shadowColor = ROSE;
        ctx.shadowBlur  = 12;
        ctx.beginPath();
        ctx.moveTo(x, y + dy * 32);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * 32, y);
        ctx.stroke();
        ctx.fillStyle  = ROSE;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      borderLine(10);
      borderLine(H - 10);
      cornerDeco(18,      18,       1,  1);
      cornerDeco(W - 18,  18,      -1,  1);
      cornerDeco(18,      H - 18,   1, -1);
      cornerDeco(W - 18,  H - 18,  -1, -1);

      // ── Bot Name — double-layer glow ───────────────────────────
      ctx.save();
      ctx.textAlign   = "center";
      ctx.font        = "bold 70px Sans";
      ctx.shadowColor = HOTPINK;
      ctx.shadowBlur  = 45;
      ctx.fillStyle   = PINK;
      ctx.fillText(botName, W / 2, 84);
      ctx.shadowBlur  = 12;
      ctx.fillStyle   = WHITE;
      ctx.fillText(botName, W / 2, 84);
      ctx.restore();

      // ── Subtitle ───────────────────────────────────────────────
      ctx.save();
      ctx.textAlign = "center";
      ctx.font      = "18px Sans";
      ctx.fillStyle = "rgba(255,180,210,0.50)";
      ctx.fillText("~ ~ ~   BOT STATUS   ~ ~ ~", W / 2, 116);
      ctx.restore();

      // ── Dot row divider ────────────────────────────────────────
      ctx.save();
      const dotCount   = 38;
      const dotSpacing = (W - 110) / dotCount;
      for (let i = 0; i < dotCount; i++) {
        const dx = 55 + i * dotSpacing;
        ctx.beginPath();
        ctx.arc(dx, 132, i % 3 === 0 ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0
          ? "rgba(255,107,157,0.70)"
          : "rgba(255,180,210,0.35)";
        ctx.fill();
      }
      ctx.restore();

      // ── Stat Cards ─────────────────────────────────────────────
      const stats = [
        { label: "Bot Uptime",    value: botUptimeStr },
        { label: "Server Uptime", value: srvUptimeStr },
        { label: "Ping",          value: `${ping} ms`  },
        { label: "CPU Load",      value: cpuUsage      }
      ];

      const cardX   = 55;
      const cardW   = W - 110;
      const cardH   = 72;
      const cardGap = 14;
      let   cardY   = 150;

      stats.forEach((stat) => {
        // Card glass bg
        ctx.save();
        ctx.globalAlpha = 0.26;
        ctx.fillStyle   = "#2A0020";
        roundRect(cardX, cardY, cardW, cardH, 18);
        ctx.fill();
        ctx.restore();

        // Shimmer border
        ctx.save();
        const bg = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
        bg.addColorStop(0,   PINK);
        bg.addColorStop(0.5, ROSE);
        bg.addColorStop(1,   HOTPINK);
        ctx.strokeStyle = bg;
        ctx.lineWidth   = 1.8;
        ctx.shadowColor = ROSE;
        ctx.shadowBlur  = 12;
        roundRect(cardX, cardY, cardW, cardH, 18);
        ctx.stroke();
        ctx.restore();

        // Left glow pill
        ctx.save();
        const pill = ctx.createLinearGradient(0, cardY + 14, 0, cardY + cardH - 14);
        pill.addColorStop(0, ROSE);
        pill.addColorStop(1, HOTPINK);
        ctx.fillStyle   = pill;
        ctx.shadowColor = ROSE;
        ctx.shadowBlur  = 10;
        roundRect(cardX, cardY + 14, 5, cardH - 28, 3);
        ctx.fill();
        ctx.restore();

        // Label
        ctx.save();
        ctx.textAlign   = "left";
        ctx.font        = "bold 26px Sans";
        ctx.fillStyle   = LPINK;
        ctx.shadowColor = ROSE;
        ctx.shadowBlur  = 16;
        ctx.fillText(stat.label, cardX + 26, cardY + 46);
        const lw = ctx.measureText(stat.label).width;
        ctx.restore();

        // Separator
        ctx.save();
        ctx.font      = "bold 26px Sans";
        ctx.fillStyle = "rgba(255,150,190,0.45)";
        ctx.fillText("  -  ", cardX + 26 + lw, cardY + 46);
        const sw = ctx.measureText("  -  ").width;
        ctx.restore();

        // Value
        ctx.save();
        ctx.textAlign   = "left";
        ctx.font        = "bold 28px Sans";
        ctx.fillStyle   = WHITE;
        ctx.shadowColor = HOTPINK;
        ctx.shadowBlur  = 20;
        ctx.fillText(stat.value, cardX + 26 + lw + sw, cardY + 46);
        ctx.restore();

        cardY += cardH + cardGap;
      });

      // ── Save & reply ───────────────────────────────────────────
      const filePath = path.join(__dirname, "uptime.png");
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      const bodyText =
        `\n~ ❀ ══ [ ${botName} ] ══ ❀ ~\n` +
        `  Bot Uptime    -  ${botUptimeStr}\n` +
        `  Server Uptime -  ${srvUptimeStr}\n` +
        `  Ping          -  ${ping} ms\n` +
        `  CPU Load      -  ${cpuUsage}\n` +
        `~ ❀ ════════════════ ❀ ~`;

      await message.reply({
        body: bodyText,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => {
        api.unsendMessage(pingMsg.messageID).catch(() => {});
      }, 3000);

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error("Command error:", err);
      return message.reply("Error: Could not fetch stats.");
    }
  }
};
