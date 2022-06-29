module.exports = async(client, ready) => {
    console.log(`${client.user.tag} is online!`);
    client.user.setActivity(``, {type: "WATCHING"});
}