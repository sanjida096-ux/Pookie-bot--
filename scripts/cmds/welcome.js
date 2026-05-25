module.exports = {
  config: {
    name: "welcome",
    version: "1.0",
    author: "ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Welcome new members",
    longDescription: "Send welcome message with photo",
    category: "events"
  },

  onStart: async function ({ event, api }) {
    if (event.logMessageType !== "log:subscribe") return;

    const threadID = event.threadID;
    const added = event.logMessageData.addedParticipants;

    for (const user of added) {
      const userName = user.fullName;

      const msg = `╭┈┈┈୨♡୧┈┈┈╮
ʜᴇʟʟᴏ, ${userName} 🌷
ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴘᴏᴏᴋɪᴇ ɢʀᴏᴜᴘ 🫶🏼
ᴡᴇ’ʀᴇ ɢʟᴀᴅ ʏᴏᴜ ᴊᴏɪɴᴇᴅ ᴜs ✨
ʜᴏᴘᴇ ʏᴏᴜ ᴇɴᴊᴏʏ ʏᴏᴜʀ ᴛɪᴍᴇ ʜᴇʀᴇ 🌙
ʜᴀᴠᴇ ᴀ ʟᴏᴠᴇʟʏ ᴇᴠᴇɴɪɴɢ 🤍
╰┈┈┈୨♡୧┈┈┈╯`;

      api.sendMessage(msg, threadID);
    }
  }
};