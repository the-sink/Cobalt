module.exports = (client, message) => {
    if (message.author.bot) return;
    if (client.inspectRestricted != null && client.inspectRestricted(message)){return;}
};
 