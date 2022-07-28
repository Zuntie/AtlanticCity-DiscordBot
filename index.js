// Imports | Requires | Consts \\
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_BANS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_WEBHOOKS'], partials: ['CHANNEL', 'MESSAGE'] });
const Config = require('./config.json');
const Keys = require('./keys.json');
const { MessageEmbed } = require('discord.js');
const { Client } = require('twitchrequest');
const { YouTube } = require("@livecord/notify");
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { Modal, TextInputComponent, SelectMenuComponent } = require('discord-modals');
const FiveM = require("fivem") // Import the npm package.
const srv = new FiveM.Server(`${Config.ip}:${Config.port}`) // Set the IP with port.
var fivereborn = require("fivereborn-query")
const discordModals = require('discord-modals')
const exec = require('child_process').exec;
discordModals(client);

// Variables \\
const logo = 'https://i.imgur.com/IDWrddQ.png'
const StaffRole = Config.dev_role || Config.stjerne_role
const options = {
    channels: ["zunt1e_"],
    client_id: Keys.twitch_clientid,
    client_secret: Keys.twitch_clientsecret,
    interval: 3
};

// SoMe \\
const twitchclient = new Client(options);
const youtube = new YouTube({
    interval: 1000,
    useDatabase: true
});


// Auto Status \\
function autoStatus() {
    const server = client.guilds.cache.get(Config.guild)
    log('Starter Rich Presence.')
    setInterval(() => {
        fivereborn.query(Config.ip, Config.port, (err, data) => {
            if (err) {
                log(`Fejl opstod under opdatering af rich presence.\n**Fivereborn-query NPM Module Error**`, 'error')
                client.user.setActivity(`Server Connection Error ⚠️`, { type: 'WATCHING'})
            } else {
                client.user.setActivity(`${data.clients}/${data.maxclients} i byen 🏙️`, { type: 'WATCHING' })
            }
        })
        setTimeout(() => {
            let memberCount = client.guilds.cache.get(Config.guild).memberCount
            client.user.setActivity(`${memberCount} discord brugere 👤`, { type: 'WATCHING' })
            setTimeout(() => {
                const channel = server.channels.cache.filter((channel) => channel.id === Config.whitelist_category);
                const ansøgere = channel.reduce((acc, channel) => channel.children.size, 0)
                client.user.setActivity(`${ansøgere} whitelist ansøgere 📬`, { type: 'WATCHING' });
                setTimeout(() => {
                    const channel2 = server.channels.cache.filter((channel) => channel.id === Config.ticket_category);
                    const tickets = channel2.reduce((acc, channel) => channel.children.size, 0)
                    client.user.setActivity(`${tickets}  åbne tickets ✉️`, { type: 'WATCHING' });
                }, 3000)
            }, 3000)
        }, 3000)
    }, 12000)
}

// Logs \\
function log(message, type) {
    const channel = client.channels.cache.get(Config.log_channel);
    const embed = new MessageEmbed()
        .setTitle('Atlantic City 2.0 - Logs')
        .setDescription(message)
        .setTimestamp()
        .setFooter({text: 'Atlantic City 2.0 - Logs', iconURL: logo})

        if (!type) {
            embed.setColor('#0099ff')
        } else if (type === 'error') {
            embed.setColor('#ff0000')
        }

    channel.send({
        embeds: [embed]
    })

}

// Kontrolpanel Status Module \\
async function kontrolpanel_status() {
    const channel = client.channels.cache.get(Config.kontrolpanel_channel);
    const defaultEmbed = new MessageEmbed()
        .setTitle('Status')
        .setDescription('**LOADING...** :gear:')
        .setTimestamp()
        .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
        .setColor('#0099ff')
    const message = await channel.send({
        embeds: [defaultEmbed]
    })
    setInterval(() => {
        try {
            srv.getServerStatus().then(data => {
                if (data.online == true) {
                    const statusEmbed = new MessageEmbed()
                        .setTitle('Status')
                        .setDescription('**Status**: Online 🟢')
                        .setTimestamp()
                        .setFooter({text: 'ac_panel by Zuntie 🟢', iconURL: logo})
                        .setColor('#0099ff')
                    message.edit({
                        embeds: [statusEmbed]
                    })
                } else if (data.online == false) {
                    const statusEmbed = new MessageEmbed()
                        .setTitle('Status')
                        .setDescription('**Status**: Offline 🔴')
                        .setTimestamp()
                        .setFooter({text: 'ac_panel by Zuntie 🔴', iconURL: logo})
                        .setColor('#0099ff')
                    message.edit({
                        embeds: [statusEmbed]
                    })
                } else {
                    const statusEmbed = new MessageEmbed()
                        .setTitle('Status')
                        .setDescription('**Status**: Kan ikke kontakte serveren ⚠️')
                        .setTimestamp()
                        .setFooter({text: 'ac_panel by Zuntie ⚠️', iconURL: logo})
                        .setColor('#0099ff')
                    message.edit({
                        embeds: [statusEmbed]
                    })
                }
            })
        } catch (err) {
            const statusEmbed = new MessageEmbed()
                .setTitle('Status')
                .setDescription('**Status**: Kan ikke kontakte serveren ⚠️')
                .setTimestamp()
                .setFooter({text: 'ac_panel by Zuntie ⚠️', iconURL: logo})
                .setColor('#0099ff')
            message.edit({
                embeds: [statusEmbed]
            })
            log('Fejl opstod under forbindelse til FiveM serveren', 'error')
        }
    }, 3000)
    

}
// Kontrolpanel Spillerliste Module \\
async function kontrolpanel_spillerliste() {
    const channel = client.channels.cache.get(Config.kontrolpanel_channel);
    const defaultEmbed = new MessageEmbed()
        .setTitle('Spillerliste')
        .setDescription('**LOADING...** :gear:')
        .setTimestamp()
        .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
        .setColor('#0099ff')

    const message = await channel.send({
        embeds: [defaultEmbed]
    })

    try {
        setInterval(() => {
            srv.getServerStatus().then(data => {
                if (data.online == true) {
                    srv.getPlayersAll().then(data => {
                        const embed = new MessageEmbed()
                            .setTitle('Spillerliste')
                            .setDescription('[**ID**] Spillernavn - **Ping**(ms)')
                            .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                            .setColor('#0099ff')
                            .setTimestamp()

                        const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId("advanced")
                                .setEmoji("🔎")
                                .setStyle("PRIMARY")
                                .setLabel("Advanced"),
                        )

                        if (data.length == 0) {
                            embed.addField('** **', 'Ingen spillere online ❌', true)
                        } else {
                            embed.addField('** **', '> ' + data.map(player => `[**${player.id}**] ${player.name} - **${player.ping}**ms`).join('\n'), true)
                        }
                        message.edit({
                            embeds: [embed],
                            components: [row]
                        })

                        const filter = ( button ) => button.clicker;
                        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

                        collector.on('collect', async (button) => {
                            if (button.customId == "advanced") {
                                const advancedEmbed = new MessageEmbed()
                                    .setTitle('Spillerliste')
                                    .setDescription('[**ID**] Spillernavn - **Ping**(ms)')
                                    .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                                    .setColor('#0099ff')
                                    .setTimestamp()

                                const row = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId("advanced")
                                        .setEmoji("🔎")
                                        .setStyle("PRIMARY")
                                        .setLabel("Advanced"),
                                )

                                if (data.length == 0) {
                                    advancedEmbed.addField('** **', 'Ingen spillere online ❌', true)
                                } else {
                                    advancedEmbed.addField('** **', '> ' + data.map(player => `[**${player.id}**] ${player.name} - **${player.ping}**ms\n> *${player.identifiers[0]}*\n> *${player.identifiers[3]}*\n> *${player.identifiers[4]}*`).join('\n'), true)
                                }
                                message.edit({
                                    embeds: [advancedEmbed],
                                    components: [row]
                                })
                                log(`${button.user} brugte advanced mode på spillerlisten under kontrolpanelet.`)
                            }
                        })

                    })
                } else if (data.online == false) {
                    const statusEmbed = new MessageEmbed()
                        .setTitle('Spillerliste')
                        .setTimestamp()
                        .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                        .setColor('#0099ff')
                        .addField('** **', 'Ingen spillere online ❌')
                    message.edit({
                        embeds: [statusEmbed]
                    })
                } else {
                    const statusEmbed = new MessageEmbed()
                        .setTitle('Spillerliste')
                        .setTimestamp()
                        .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                        .setColor('#0099ff')
                        .addField('** **', 'Kan ikke kontakte serveren ⚠️.')
                    message.edit({
                        embeds: [statusEmbed]
                    })  
                }
            })
        }, 3000)
    } catch (err) {
        const statusEmbed = new MessageEmbed()
            .setTitle('Spillerliste')
            .setTimestamp()
            .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
            .setColor('#0099ff')
            .addField('** **', 'Kan ikke kontakte serveren ⚠️.')
        message.edit({
            embeds: [statusEmbed]
        })
        log('Fejl opstod under forbindelse til FiveM serveren', 'error')
    }
}
// Kontrolpanel Ping Module \\
async function kontrolpanel_ping() {
    const channel = client.channels.cache.get(Config.kontrolpanel_channel);
    const defaultEmbed = new MessageEmbed()
        .setTitle('Ping')
        .setDescription('**LOADING...** :gear:')
        .setTimestamp()
        .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
        .setColor('#0099ff')
    const message = await channel.send({
        embeds: [defaultEmbed]
    })
    setInterval(() => {
        const pingEmbed = new MessageEmbed()
            .setTitle('Ping')
            .setDescription(`**Bottens Ping**: ${client.ws.ping}ms`)
            .setTimestamp()
            .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
            .setColor('#0099ff')

        message.edit({
            embeds: [pingEmbed]
        })
    }, 3000)
}
// Kontrolpanel \\
async function kontrolPanel() {
    log('Loaded Kontrolpanel.')
    const channel = client.channels.cache.get(Config.kontrolpanel_channel);

    const embed = new MessageEmbed()
        .setTitle('Atlantic City 2.0 - Kontrolpanel')
        .setDescription('Dette er Atlantic Citys kontrolpanel, til FiveM serveren.\nHer kan ud administrere ingame serveren, og udføre administrative formål.')
        .setTimestamp()
        .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
        .setColor('#0099ff')

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("startServer")
                .setEmoji("✔️")
                .setStyle("SUCCESS")
                .setLabel("Start"),
            new MessageButton()
                .setCustomId("genstartServer")
                .setEmoji("🔄")
                .setStyle("PRIMARY")
                .setLabel("Genstart"),
            new MessageButton()
                .setCustomId("stopServer")
                .setEmoji("✖️")
                .setStyle("DANGER")
                .setLabel("Stop"),
            new MessageButton()
                .setCustomId("forcekillServer")
                .setEmoji("⚠️")
                .setStyle("DANGER")
                .setLabel("Forcekill"),
        )

        try {
            channel.messages.fetch().then(messages => {
                messages.forEach(message => {
                    message.delete()
                })
            })
        } catch (err) {
            log(`Fejl opstod under sletning af beskeder vedr. kontrolpanelet\n\n**${err.name}**: ${err.message}`, 'error')
        }
        
        const message = await channel.send({
            embeds: [embed],
            components: [row]
        })

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'startServer') {
                srv.getServerStatus().then(data => {
                    if (data.online == true) {
                        log(`${button.user} prøvede at starte FiveM serveren, men den er allerede online.`)
                        const embed = new MessageEmbed()
                            .setTitle('Atlantic City 2.0 - Kontrolpanel')
                            .setDescription('FiveM serveren er allerede online.')
                            .setTimestamp()
                            .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                            .setColor('#0099ff')
                        try {
                            button.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                        } catch (err) {
                            log(`Fejl opstod under besked sendt til ${button.user}\n\n**${err.name}**: ${err.message}`, 'error')
                        }
                    } else if (data.online == false) {
                        const curPath = __dirname;
                        const embed = new MessageEmbed()
                            .setTitle('Atlantic City 2.0 - Kontrolpanel')
                            .setDescription('FiveM serveren vil nu starte op.\nTjek på statusen på serveren, for at se, hvornår den er online.')
                            .setTimestamp()
                            .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                            .setColor('#0099ff')


                        log(`${button.user} starter FiveM serveren, fra kontrolpanelet.`)
                        exec(`start ${curPath}\\${Config.kontrolpanel_startcmd}`)
                        log(`Åbner cmd/starter.py`)
                        log(`Åbner start_5562_default.bat`)
                        log(`Starter server`)

                        button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                })
                
            } else if (button.customId == "stopServer") {
                srv.getServerStatus().then(data => {
                    if (data.online == true) {
                        const curPath = __dirname;
                        const embed = new MessageEmbed()
                            .setTitle('Atlantic City 2.0 - Kontrolpanel')
                            .setDescription('FiveM serveren vil nu stoppe.\nTjek på statusen på serveren, for at se, hvornår den er offline.')
                            .setTimestamp()
                            .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                            .setColor('#0099ff')

                        log(`${button.user} stopper FiveM serveren, fra kontrolpanelet.`)
                        exec(`start ${curPath}\\${Config.kontrolpanel_stopcmd}`)
                        log('**Process Killed:** ' + Config.kontrolpanel_title + ' **-** ' + Config.kontrolpanel_fxserver)
                        log('**Setting Process Title:** ' + Config.kontrolpanel_killingtitle)
                        setTimeout(() => {
                            log('**Process Killed:** ' + Config.kontrolpanel_killingtitle)
                        }, 1000)

                        button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } else if (data.online == false) {
                        const embed = new MessageEmbed()
                            .setTitle('Atlantic City 2.0 - Kontrolpanel')
                            .setDescription('FiveM serveren er allerede offline.')
                            .setTimestamp()
                            .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                            .setColor('#0099ff')

                        button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                        log(`${button.user} prøvede at stoppe FiveM serveren, men den er allerede offline`)
                    }
                })
            } else if (button.customId == "genstartServer") {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Kontrolpanel')
                    .setDescription('FiveM serveren vil nu genstarte.\nTjek på statusen på serveren, for at se, hvornår den er online.')
                    .setTimestamp()
                    .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                    .setColor('#0099ff')

                log(`${button.user} genstarter FiveM serveren, fra kontrolpanelet.`)
                button.reply({
                    embeds: [embed],
                    ephemeral: true
                })

                try {
                    srv.getServerStatus().then(data => {
                        if (data.online == true) {
                            button.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            exec(`start ${curPath}\\${Config.kontrolpanel_stopcmd}`)
                            log('**Process Killed:** ' + Config.kontrolpanel_title + ' **-** ' + Config.kontrolpanel_fxserver)
                            log('**Setting Process Title:** ' + Config.kontrolpanel_killingtitle)
                            setTimeout(() => {
                                log('**Process Killed:** ' + Config.kontrolpanel_killingtitle)
                            }, 1000)

                            setTimeout(() => {
                                exec(`start ${curPath}\\${Config.kontrolpanel_startcmd}`)
                                log(`Åbner cmd/starter.py`)
                                log(`Åbner start_5562_default.bat`)
                                log(`Starter server`)
                            }, 1000)
                        } else if (data.online == false) {
                            exec(`start ${curPath}\\${Config.kontrolpanel_startcmd}`)
                            log(`Åbner cmd/starter.py`)
                            log(`Åbner start_5562_default.bat`)
                            log(`Starter server`)
                            button.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                        }
                    })
                } catch (err) {
                    log(`Fejl opstod under genstartning af FiveM serveren`, 'error')
                }
            } else if (button.customId == "forcekillServer") {
                const curPath = __dirname;
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Kontrolpanel')
                    .setDescription('FiveM serveren vil nu blive forcekilled.\nTjek på statusen på serveren, for at se, hvornår den er offline.')
                    .setTimestamp()
                    .setFooter({text: 'ac_panel by Zuntie', iconURL: logo})
                    .setColor('#0099ff')

                log(`${button.user} forcekilled FiveM serveren, fra kontrolpanelet.`)
                button.reply({
                    embeds: [embed],
                    ephemeral: true
                })
                
                exec(`start ${curPath}\\${Config.kontrolpanel_stopcmd}`)
                log('**Process Killed:** ' + Config.kontrolpanel_title + ' **-** ' + Config.kontrolpanel_fxserver)
                log('**Setting Process Title:** ' + Config.kontrolpanel_killingtitle)
                setTimeout(() => {
                    log('**Process Killed:** ' + Config.kontrolpanel_killingtitle)
                }, 1000)
            }
        })
    kontrolpanel_ping()
    log(`Kontrolpanelets Ping Modul blev startet.`)
    kontrolpanel_status()
    log(`Kontrolpanelets Status Modul blev startet.`)
    kontrolpanel_spillerliste()
    log(`Kontrolpanelets Spillerliste Modul blev startet.`)
    
        



// the `data` event is fired every time data is
// output from the command 
/*var count = 1
command.stdout.on('data', output => {
    // the output data is captured and printed in the callback
    var output = output.toString()
    // remove [38;5;218m and 
    output = output.replace(/\u001b\[38;5;218m/g, '')
    // remove  [0m[32m
    output = output.replace(/\u001b\[0m\u001b\[32m/g, '')
    // remove [38;5;161m
    output = output.replace(/\u001b\[38;5;161m/g, '')
    // remove [0m
    output = output.replace(/\u001b\[0m/g, '')
    // remove  [93m
    output = output.replace(/\u001b\[93m/g, '')
    // remove [32m
    output = output.replace(/\u001b\[32m/g, '')
    // remove ]0;
    output = output.replace(/\u001b\]0;/g, '')
    // everything between [ ] should be capitalized
    output = output.replace(/\[(.*?)\]/g, function(match, p1) {
        return `[**${p1}**]`
    })

    // remove the first line
    if (count === 1 || count === 2 || count === 3 || count === 4) {
        count++
        return
    }



    console.log(output)
    
})*/

}

// Start Systems \\
async function startWhitelist() {
    log(`**[startSystems Function]** Whitelist Modul blev startet.`)
    const channel = client.channels.cache.get(Config.whitelist_channel);
            const whitelistEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Whitelist__')
                .setDescription(
                '**Her kan du ansøge om whitelist.**\n' +
                'Først skal du ansøge om whitelist, det gør du ved at skrive **/ansøg**.\n'+
                'Er din ansøgning godkendt, skal du til en whitelist samtale, når der er åbent.'
                )
                .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })

            const modal = new Modal()
                .setCustomId('whitelist_ansøgning')
                .setTitle('Whitelist Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('whitelist_karakter')
                        .setLabel('Information om karakter [Navn, Baggrund, etc]')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_hvorfor')
                        .setLabel('Hvorfor vil du gerne spille på Atlantic City?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_lave')
                        .setLabel('Hvad regner du med at lave på Atlantic City?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_steam')
                        .setLabel('Hvad er det link til din steam profil?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('SHORT'),
            )

            try {
                channel.messages.fetch({ limit: 100 }).then(messages => {
                    messages.forEach(message2 => {
                        setTimeout(() => {
                            if (message2.author.id == client.user.id) {
                                message2.delete()
                            } else {
                            }
                        }, 100)
                    });
                }).catch(console.error);
            } catch (err) {
                log(`Fejl ved sletning af besked.\n\n**${err.name}**: ${err.message}`, 'error');
            }
            await channel.send({
                embeds: [whitelistEmbed],
            })

            // for every message that gets sent in the channel
            setInterval(() => {
                channel.messages.cache.forEach(async (message) => {
                    try {
                        if (message.author.id == client.user.id) {
                            return;
                        } else {
                            await message.delete();
                            log(`Slettede besked i <#${Config.ansøgning_channel}>\nSendt af <@${message.author.id}>\nIndhold: \n${message.content}`);
                        }    
                    } catch (err) {
                        log(`Fejl ved sletning af besked.\n\n**${err.name}**: ${err.message}`, 'error');
                    }
                    
                })
            }, 1000)
}
async function startAnsøgninger() {
    log(`**[startSystems Function]** Ansøgninger Modul blev startet.`)
            const channel = client.channels.cache.get(Config.ansøgning_channel);
            const ansøgningsEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Ansøgninger__')
                .setDescription('*Du kan ansøge nedenfor.*\n\n**Politi 👮**\nVær en del af politistyrken, og stop kriminelitet.\n\n**EMS 🚑**\nVær en del af EMS, for at medicinere og genoplive folk.\n\n**Advokat 💼**\nVær en advokat, og deltag i retsager.\n\n**Firma 👷**\nOpret og administrer dit eget firma.\n\n**Staff 👤**\n Vær en del af staff teamet, og hjælp til med at moderere på serveren.\n\n**Beta Tester ⚙️**\nHjælp med at finde fejl, og teste ting på vores dev server.\n\n**Whitelist Modtager 📝**\nVær en whitelist modtager, for at svare på whitelist ansøgninger samt samtalerne.')
                .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('ansøgning_type')
                        .setPlaceholder('Vælg Ansøgning')
                        .addOptions([
                            {
                                label: 'Politi 👮',
                                description: 'Tryk for at oprette en politi ansøgning.',
                                value: 'politi'
                            },
                            {
                                label: 'EMS 🚑',
                                description: 'Tryk for at oprette en EMS ansøgning.',
                                value: 'ems'
                            },
                            {
                                label: 'Advokat 💼',
                                description: 'Tryk for at oprette en advokat ansøgning.',
                                value: 'advokat'
                            },
                            {
                                label: 'Firma 👷',
                                description: 'Tryk for at oprette en firma ansøgning.',
                                value: 'firma'
                            },
                            {
                                label: 'Staff 👤',
                                description: 'Tryk for at oprette en staff ansøgning.',
                                value: 'staff'
                            },
                            {
                                label: 'Beta Tester ⚙️',
                                description: 'Tryk for at oprette en beta tester ansøgning.',
                                value: 'betatester'
                            },
                            {
                                label: 'Whitelist Modtager 📝',
                                description: 'Tryk for at oprette en whitelist modtager ansøgning.',
                                value: 'whitelistmodtager'
                            }
                        ])
                )
            try {
                channel.messages.fetch({ limit: 100 }).then(messages => {
                    messages.forEach(message2 => {
                        setTimeout(() => {
                            if (message2.author.id == client.user.id) {
                                message2.delete()
                            } else {
                            }
                        }, 100)
                    });
                }).catch(console.error);
            } catch (err) {
                log(`Fejl ved sletning af besked.\n\n**${err.name}**: ${err.message}`, 'error');
            }
            
            // Reply to user
            channel.send({
                embeds: [ansøgningsEmbed],
                components: [row]
            })
}
async function startPing() {
    log(`**[startSystems Function]** Ping Modul blev startet.`)
    const channel = client.channels.cache.get(Config.pingrolle_channel);

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Ping__')
                .setDescription(`Kunne du godt tænke dig at blive pinget, når der kommer nogle nyheder?\nSå tryk på knappen nedenfor, for at modtage <@&${Config.ping_role}> rollen.\nVil du ikke have den længere, kan du bare trykke på knappen igen.`)
                .setFooter({ text: 'Atlantic City 2.0 - Ping', iconURL: logo })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("modtag")
                        .setEmoji("📝")
                        .setStyle("SUCCESS")
                        .setLabel("Modtag"),
                )
                try {
                    channel.messages.fetch({ limit: 100 }).then(messages => {
                        messages.forEach(message2 => {
                            setTimeout(() => {
                                if (message2.author.id == client.user.id) {
                                    message2.delete()
                                } else {
                                }
                            }, 100)
                        });
                    }).catch(console.error);
                } catch (err) {
                    log(`Fejl ved sletning af besked.\n\n**${err.name}**: ${err.message}`, 'error');
                }
            
            const message = await channel.send({
                embeds: [embed],
                components: [row]
            })

            const filter = ( button ) => button.clicker;
            const collector = message.createMessageComponentCollector(filter, { time: 120000 });

            collector.on('collect', async (button) => {
                if (button.customId == "modtag") {
                    const replyEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 Ping__')
                        .setDescription(`Du modtog <@&${Config.ping_role}> rollen.`)
                        .setFooter({ text: 'Atlantic City 2.0 - Ping', iconURL: logo })
                    const replyEmbed2 = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 Ping__')
                        .setDescription(`Du fik fjernet <@&${Config.ping_role}> rollen.`)
                        .setFooter({ text: 'Atlantic City 2.0 - Ping', iconURL: logo })
                    const targetUser = button.user;
                    var guild = client.guilds.cache.get(Config.guild)
                    const member = await guild.members.fetch(targetUser.id)
                    const role = await guild.roles.fetch(Config.ping_role)
                    // check if user has role
                    if (member.roles.cache.has(role.id)) {
                        member.roles.remove(role.id)
                        await button.reply({
                            embeds: [replyEmbed2],
                            ephemeral: true
                        })
                    } else {
                        member.roles.add(role.id)
                        await button.reply({
                            embeds: [replyEmbed],
                            ephemeral: true
                        })
                    }
                }
            })
}
async function startServerDrift() {
    log(`**[startSystems Function]** Server Drift Modul blev startet.`)
    const channel = client.channels.cache.get(Config.serverdrift_channel);

            const loading = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Serverdrift__')
                .setDescription('Loading serverdata ⚙️...')
                .setFooter({ text: 'Atlantic City 2.0 - Serverdrift', iconURL: logo })
                .setTimestamp()

                try {
                    channel.messages.fetch({ limit: 100 }).then(messages => {
                        messages.forEach(message2 => {
                            setTimeout(() => {
                                if (message2.author.id == client.user.id) {
                                    message2.delete()
                                } else {
                                }
                            }, 100)
                        });
                    }).catch(console.error);
                } catch (err) {
                    log(`Fejl ved sletning af besked.\n\n**${err.name}**: ${err.message}`, 'error');
                }

            const message = await channel.send({
                embeds: [loading]
            })
            
            setInterval(() => {
                try {
                    srv.getServerStatus().then(data => {
                        if (data.online == true) {
                            srv.getPlayersAll().then(data => {
                                const embed =   new MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle('__Atlantic City 2.0 Serverdrift__')
                                    .setFooter({ text: 'Atlantic City 2.0 - Serverdrift', iconURL: logo })
                                    .setTimestamp()

                                const row = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                        .setEmoji("🚀")
                                        .setURL('https://discord.gg/2J8yzcJg2z')
                                        .setStyle("LINK")
                                        .setLabel("Tilslut")
                                    )
                                

                                if (data.length == 0) {
                                    embed.addField('**Spillerliste**', 'Ingen spillere online ❌', true)
                                    embed.addField('Status', 'Online 🟢', true)
                                } else {
                                    embed.addField('**Spillerliste**', '> ' + data.map(player => `[**${player.id}**] ${player.name} - **${player.ping}**ms`).join('\n'), true)
                                    embed.addField('Status', 'Online 🟢', true)
                                }

                                message.edit({
                                    embeds: [embed],
                                    components: [row]
                                })
                            })
                        } else if (!data.online) {
                            console.log('offline')
                            const embed =   new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('__Atlantic City 2.0 Serverdrift__')
                                .setFooter({ text: 'Atlantic City 2.0 - Serverdrift', iconURL: logo })
                                .setTimestamp()
                                .addField('**Spillerliste**', 'Ingen spillere online ❌', true)
                                .addField('Status', 'Offline ❌', true)
                            message.edit({
                                embeds: [embed]
                            })
                            } else {
                            console.log('error')
                            const embed =   new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('__Atlantic City 2.0 Serverdrift__')
                                .setFooter({ text: 'Atlantic City 2.0 - Serverdrift', iconURL: logo })
                                .setTimestamp()
                                .addField('**Spillerliste**', 'Kunne ikke loade spillerdata ⚠️.', true)
                                .addField('Status', 'Connection Error ⚠️', true)
                            message.edit({
                                embeds: [embed]
                            })

                        }
                    })
                } catch (err) {
                    console.log(err)
                }
            }, 2000)
}
async function startFAQ() {
    log(`**[startSystems Function]** FAQ Modul blev startet.`)
    const channel = client.channels.cache.get(Config.faq_channel);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 FAQ__')
                .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                .setDescription(
                'Nedenfor kan du vælge, hvad du vil have svar på.\n\n' +
                '1️⃣ **Hvad framework bruger i?**\n\n' +
                '2️⃣ **Hvordan ansøger jeg?**\n\n' +
                '3️⃣ **Hvad er aldersgrænsen?**\n\n' +
                '4️⃣ **Information om Atlantic City?**\n\n' +
                '5️⃣ **Hvornår svarer i på ansøgninger?**\n\n' +
                '6️⃣ **Er det realistisk roleplay?**\n\n' +
                '7️⃣ **Hvor mange karaktere har man?**\n\n' +
                '8️⃣ **Hvor mange slots har i?**\n\n'
                )
                
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("1")
                        .setEmoji("1️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("2")
                        .setEmoji("2️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("3")
                        .setEmoji("3️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("4")
                        .setEmoji("4️⃣")
                        .setStyle("SECONDARY"),
                )

            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("5")
                        .setEmoji("5️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("6")
                        .setEmoji("6️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("7")
                        .setEmoji("7️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("8")
                        .setEmoji("8️⃣")
                        .setStyle("SECONDARY"),

                )

                try {
                    channel.messages.fetch({ limit: 100 }).then(messages => {
                        messages.forEach(message2 => {
                            setTimeout(() => {
                                if (message2.author.id == client.user.id) {
                                    message2.delete()
                                } else {
                                }
                            }, 100)
                        });
                    }).catch(console.error);
                } catch (err) {
                    log(`Fejl ved sletning af besked.\n\n**${err.name}**: ${err.message}`, 'error');
                }
            channel.send({
                embeds: [embed],
                components: [row, row2]
            })

            const filter = ( button ) => button.clicker;
            const collector = channel.createMessageComponentCollector(filter, { time: 120000 });
            collector.on('collect', async (button) => {
                if (button.customId == '1') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription(`Atlantic City benytter sig af ESX Legacy (**v1.7.5**) frameworked.`)
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                } else if (button.customId == '2') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription(`Du kan ansøge om de forskellige jobs, og om at blive en del af teamet, inde i <#${Config.ansøgning_channel}> `)
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                } else if (button.customId == '3') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription(`Der er ingen aldersgrænse på whitelist ansøgningerne, her handler det om ens timer og erfaring i FiveM.\nMen på visse whitelisted jobs og ansøgninger, kan en aldersgrænse forekomme.`)
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    catch (error) {
                        return
                    }
                } else if (button.customId == '4') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription(
                            '**Baggrunds Historie**\n' +
                            '> Atlantic City var en vRP server, der kørte tilbage i 2019.\n' +
                            '> Grundlaget for serverens lukning, var at ledelsen blev nød til at forlade, grundet økonomiske årsager.\n' +
                            '> Dengang lå Atlantic City på gennemsnitligt 60 spiller dagligt, efter at have været oppe i 2 uger.\n\n' +
                            '**Moto & Info**\n' +
                            '> Dengang blev Atlantic City kendt for deres udvikling, det var unikt og der var mange ting man ikke havde set før. ' +
                            'Det førte også til et forhøjet RP niveau.\n' +
                            '> Der var også god support, og et godt community. Det gjorde de ved at der ikke var nogen aldersgrænse, men at de kiggede på timerne, og erfaring.\n' +
                            '> Der var dog en aldersgrænse på visse jobs, og ting i teamet.\n\n' +
                            '**Formål med at åbne op igen.**\n' +
                            '> 2.0 har været i <@' + Config.odin_id + '> baghovedet længe. Han har længe gået og tænkt på at starte Atlantic City op igen.\n' +
                            '> Han mener at det danske FiveM mangler nye servere, som ikke efterligner andre, og er unikke.\n' +
                            '> Han har dog taget sagen i sin egen hånd, og har fået penge til at betale det hele.\n\n' +
                            '**Fremtid for Atlantic City**\n' +
                            '> Vi håber på at blive ved med at være på udviklingen, og bygge et af de bedste RP communities i Danmark.\n' +
                            '> Så vi en dag kan kaldes os nogle af de bedste i dag.'
                        )
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    catch (error) {
                        return
                    }
                } else if (button.customId == '5') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription('Det er forskelligt fra område til område, da der er forskellige ansvarlige.')
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    catch (error) {
                        return
                    }
                } else if (button.customId == '6') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription('På Atlantic City kører vi med realistisk roleplay.')
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                } else if (button.customId == '7') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription('Vi har valgt, at man skal have 2 karaktere.')
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                } else if (button.customId == '8') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription('Vi har valgt at køre med 64 slots.')
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                }
            })
}
async function startTickets() {
    log(`**[startSystems Function]** Tickets Modul blev startet.`)
    const channel = client.channels.cache.get(Config.ticket_channel);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Tickets__')
                .setDescription(
                    '*Du kan vælge tickettens type nedenfor.*' +
                    '\n\n' +
                    '**✉️ Generel Ticket**\n' + 
                    '> Hvis du har brug for hjælp, eller hvis du har et spørgsmål.\n\n' +
                    '**⚙️ Dev Ticket**\n' +
                    '> Hvis du har brug for en developers hjælp, eller du har fundet en fejl.\n\n' +
                    '**👤 Ledelse Ticket**\n' +
                    '> Hvis du har brug for at kontakte en fra ledelsen.'
                )
                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('ticket_type')
                        .setPlaceholder('Vælg Ticket Type')
                        .addOptions([
                            {
                                label: '✉️ Generel Ticket',
                                description: 'Tryk for at oprette en generel ticket.',
                                value: 'generelticket'
                            },
                            {
                                label: '⚙️ Dev Ticket',
                                description: 'Tryk for at oprette en dev ticket.',
                                value: 'devticket'
                            },
                            {
                                label: '👤 Ledelse Ticket',
                                description: 'Tryk for at oprette en ledelse ticket.',
                                value: 'ledelseticket'
                            },
                        ])
                )

                try {
                    channel.messages.fetch({ limit: 100 }).then(messages => {
                        messages.forEach(message2 => {
                            setTimeout(() => {
                                if (message2.author.id == client.user.id) {
                                    message2.delete()
                                } else {
                                }
                            }, 100)
                        });
                    }).catch(console.error);
                } catch (err) {
                    log(`Fejl ved sletning af besked.\n\n**${err.name}**: ${err.message}`, 'error');
                }
            channel.send({
                embeds: [embed],
                components: [row],
            })
}
async function startSystems() {
    startWhitelist()
    startAnsøgninger()
    startPing()
    startServerDrift()
    startFAQ()
    startTickets()
}

// User Join \\
client.on('guildMemberAdd', member => {
    log(`<@${member.user.id}> tilsluttede sig serveren.`)
})
// User Leave \\
client.on('guildMemberRemove', member => {
    log(`<@${member.user.id}> forlod serveren.`)
})
// User Ban \\
client.on('guildBanAdd', (user) => {
    log(`<@${user.user.id}> blev bannet fra serveren.`)
})
// User Unban \\
client.on('guildBanRemove', (user) => {
    log(`<@${user.user.id}> blev unbannet fra serveren.`)
})

// Twitch Live \\
twitchclient.on('live', (streamData) => {
    const channel = client.channels.cache.get(Config.twitch_channel);
    const logChannel = client.channels.cache.get(Config.log_channel);
    const embed = new MessageEmbed()
        .setAuthor('Atlantic City 2.0 - Twitch', streamData.profile)
        .setTitle(streamData.title)
        .setImage(streamData.thumbnail)
        .setDescription(`@**${streamData.name}** er nu live igen og spiller **${streamData.game}**!`)
        .setURL(`https://twitch.tv/${streamData.raw.user_login}`)
        .setTimestamp()
        .setFooter({text: 'Atlantic City 2.0 - Twitch'})
        .setColor('#9146ff')

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setEmoji('📺')
                .setStyle("LINK")
                .setURL(`https://twitch.tv/${streamData.raw.user_login}`)
                .setLabel('Se nu')
                    
    )
    channel.send({
        embeds: [embed],
        components: [row]
    })
    logChannel.send({
        embeds: [embed]
    })
});
// Twitch Going Offline \\
twitchclient.on('unlive', (streamData) => {
    const logChannel = client.channels.cache.get(Config.log_channel);
    const embed = new MessageEmbed()
        .setAuthor('Atlantic City 2.0 - Twitch', streamData.profile)
        .setTitle(streamData.title)
        .setImage(streamData.thumbnail)
        .setDescription(`@**${streamData.name}** er ikke længere live.`)
        .setTimestamp()
        .setFooter({text: 'Atlantic City 2.0 - Twitch'})
        .setColor('#9146ff')

    logChannel.send({
        embeds: [embed]
    })
});
// Youtube New Upload \\
youtube.on("upload", video => {
    console.log(video)
    const channel = client.channels.cache.get(Config.youtube_channel);
    const logChannel = client.channels.cache.get(Config.log_channel);
    const link = video.link
    const thumbnail = link.split('=')[1]

    const embed = new MessageEmbed()
        .setAuthor('Atlantic City 2.0 - Youtube', logo)
        .setTitle(video.title)
        .setURL(video.link)
        .setImage(`https://img.youtube.com/vi/${thumbnail}/hqdefault.jpg`)
        .setDescription(`@**${video.author}** har lige uploadet en ny video.`)
        .setTimestamp()
        .setFooter({text: 'Atlantic City 2.0 - Youtube'})
        .setColor('#ff0000')

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setEmoji('📺')
                .setStyle("LINK")
                .setURL(link)
                .setLabel('Se nu')
        )
    channel.send({
        embeds: [embed],
        components: [row]
    })
    logChannel.send({
        embeds: [embed]
    })

})


// Commands \\
client.on('interactionCreate', async (interaction) => {
    const { commandName, options } = interaction;
    if (!interaction.isCommand()) return;

    if (commandName == 'ping') {
        log('<@' + interaction.user.id + '> brugte kommandoen **/ping**.')
        interaction.reply('Pong!')
    }

    if (commandName == 'ansøgcreate') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            log('<@' + interaction.user.id + '> brugte kommandoen **/ansøgcreate**.')
            const channel = client.channels.cache.get(Config.ansøgning_channel);
            const ansøgningsEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Ansøgninger__')
                .setDescription('*Du kan ansøge nedenfor.*\n\n**Politi 👮**\nVær en del af politistyrken, og stop kriminelitet.\n\n**EMS 🚑**\nVær en del af EMS, for at medicinere og genoplive folk.\n\n**Advokat 💼**\nVær en advokat, og deltag i retsager.\n\n**Firma 👷**\nOpret og administrer dit eget firma.\n\n**Staff 👤**\n Vær en del af staff teamet, og hjælp til med at moderere på serveren.\n\n**Beta Tester ⚙️**\nHjælp med at finde fejl, og teste ting på vores dev server.\n\n**Whitelist Modtager 📝**\nVær en whitelist modtager, for at svare på whitelist ansøgninger samt samtalerne.')
                .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('ansøgning_type')
                        .setPlaceholder('Vælg Ansøgning')
                        .addOptions([
                            {
                                label: 'Politi 👮',
                                description: 'Tryk for at oprette en politi ansøgning.',
                                value: 'politi'
                            },
                            {
                                label: 'EMS 🚑',
                                description: 'Tryk for at oprette en EMS ansøgning.',
                                value: 'ems'
                            },
                            {
                                label: 'Advokat 💼',
                                description: 'Tryk for at oprette en advokat ansøgning.',
                                value: 'advokat'
                            },
                            {
                                label: 'Firma 👷',
                                description: 'Tryk for at oprette en firma ansøgning.',
                                value: 'firma'
                            },
                            {
                                label: 'Staff 👤',
                                description: 'Tryk for at oprette en staff ansøgning.',
                                value: 'staff'
                            },
                            {
                                label: 'Beta Tester ⚙️',
                                description: 'Tryk for at oprette en beta tester ansøgning.',
                                value: 'betatester'
                            },
                            {
                                label: 'Whitelist Modtager 📝',
                                description: 'Tryk for at oprette en whitelist modtager ansøgning.',
                                value: 'whitelistmodtager'
                            }
                        ])
                )

            // Reply to user
            channel.send({
                embeds: [ansøgningsEmbed],
                components: [row]
            })
            interaction.reply({
                content: 'Opretter ansøgningerne...',
                ephemeral: true
            })
            log('<@' + interaction.user.id + '> oprettede ansøgningerne.')
        }
        
    }

    if (commandName == 'whitelistcreate') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            log('<@' + interaction.user.id + '> brugte kommandoen **/whitelistcreate**.')
            const channel = client.channels.cache.get(Config.whitelist_channel);
            const whitelistEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Whitelist__')
                .setDescription(
                '**Her kan du ansøge om whitelist.**\n' +
                'Først skal du ansøge om whitelist, det gør du ved at skrive **/ansøg**.\n'+
                'Er din ansøgning godkendt, skal du til en whitelist samtale, når der er åbent.'
                )
                .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })

            const modal = new Modal()
                .setCustomId('whitelist_ansøgning')
                .setTitle('Whitelist Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('whitelist_karakter')
                        .setLabel('Information om karakter [Navn, Baggrund, etc]')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_hvorfor')
                        .setLabel('Hvorfor vil du gerne spille på Atlantic City?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_lave')
                        .setLabel('Hvad regner du med at lave på Atlantic City?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_steam')
                        .setLabel('Hvad er det link til din steam profil?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('SHORT'),
            )

            await channel.send({
                embeds: [whitelistEmbed],
            })

            interaction.reply({
                content: 'Opretter ansøgningen...',
                ephemeral: true
            })
            log('<@' + interaction.user.id + '> oprettede whitelist ansøgningen.')

            // for every message that gets sent in the channel
            setInterval(() => {
                channel.messages.cache.forEach(async (message) => {
                    try {
                        if (message.author.id == client.user.id) {
                            return;
                        } else {
                            await message.delete();
                            log(`Slettede besked i <#${Config.ansøgning_channel}>\nSendt af <@${message.author.id}>\nIndhold: \n${message.content}`);
                        }    
                    } catch (err) {
                        log(`Fejl ved sletning af besked.\n\n**${err.name}**: ${err.message}`, 'error');
                    }
                    
                })
            }, 1000)
        }
    }

    if (commandName == 'whitelistadd') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            log(`<@${interaction.user.id}> bruger kommandoen **/whitelistadd**.`)
            const targetUser = interaction.options.getUser('user');
            var guild = client.guilds.cache.get(Config.guild)
            const member = await guild.members.fetch(targetUser.id)
            const role = await guild.roles.fetch(Config.whitelist_role)

            member.roles.add(role)

            log(`<@${targetUser.id}> fik whitelist af <@${interaction.user.id}>.`)
            const dmEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Whitelist__')
                .setDescription(
                'Du har nu modtaget whitelist på Atlantic City af en staff.\n' +
                'Du kan hermed tilslutte dig serveren.\n'
                )
                .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })
            
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Whitelist__')
                .setDescription(`Du gav <@${targetUser.id}> whitelist.`)
                .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })
            
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

            if (Config.dms == true) {
                try {
                    const dm = await targetUser.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${targetUser.id}>`)
                } catch (err) {
                    log(`Fejl ved DM send.\n\n**${err.name}**: ${err.message}`, 'error');
                }
            }
            
        }
    }

    if (commandName == 'whitelistremove') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            log(`<@${interaction.user.id}> bruger kommandoen **/whitelistremove**.`)
            const targetUser = interaction.options.getUser('user');
            var guild = client.guilds.cache.get(Config.guild)
            const member = await guild.members.fetch(targetUser.id)
            const role = await guild.roles.fetch(Config.whitelist_role)

            member.roles.remove(role)

            log(`<@${targetUser.id}> fik frataget sit whitelist af <@${interaction.user.id}>.`)
            const dmEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Whitelist__')
                .setDescription(
                'Du har fået frataget dit whitelist, af en staff hos Atlantic City.\n' +
                'Du kan ikke længere tilslutte dig serveren.\n'
                )
                .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })
            
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Whitelist__')
                .setDescription(`Du fratog <@${targetUser.id}> whitelist.`)
                .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })
            
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

            if (Config.dms == true) {
                try {
                    const dm = await targetUser.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${targetUser.id}>`)
                } catch (err) {
                    log(`Fejl ved DM send.\n\n**${err.name}**: ${err.message}`, 'error');
                }
            }
            
        }
    }

    if (commandName == 'ansøg') {
        log('<@' + interaction.user.id + '> brugte kommandoen **/ansøg**.')
        const channel = client.channels.cache.get(Config.whitelist_channel);
        const user = interaction.member;
        if (user.roles.cache.has(Config.whitelist_role)) {
            interaction.reply({
                content: 'Du har allerede whitelist.',
                ephemeral: true
            });
            log('<@' + interaction.user.id + '> brugte kommandoen **/ansøg**, men har allerede whitelist.')
        } else {
            if (interaction.channel == channel) {
                const modal = new Modal()
                    .setCustomId('whitelist_ansøgning')
                    .setTitle('Whitelist Ansøgning')
                    .addComponents(
                    new TextInputComponent()
                        .setCustomId('whitelist_karakter')
                        .setLabel('Information om karakter [Navn, Baggrund, etc]')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_hvorfor')
                        .setLabel('Hvorfor vil du gerne spille på Atlantic City?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_lave')
                        .setLabel('Hvad regner du med at lave på Atlantic City?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('LONG'),

                    new TextInputComponent()
                        .setCustomId('whitelist_steam')
                        .setLabel('Link til din steam profil?')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('SHORT'),
                    )

                discordModals.showModal(modal, {
                    client: client,
                    interaction: interaction,
                })
                log('<@' + interaction.user.id + '> ansøger om whitelist.')
            }
        }
    }

    if (commandName == 'clear') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            log('<@' + interaction.user.id + '> brugte kommandoen **/clear**.')
            const amount = interaction.options.getInteger('amount');
            const channel = interaction.channel;
            log('<@' + interaction.user.id + '> slettede ' + amount + ' beskeder.')

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Administration__')
                .setDescription('**' + amount + '** beskeder blev slettet af en staff.')
                .setFooter({ text: 'Atlantic City 2.0 - Administration', iconURL: logo })
                .setTimestamp()

            if (amount > 100) {
                interaction.reply({
                    content: 'Disords API tillader maks. 100 beskeder pr. gang.',
                    ephemeral: true,
                })
                log('<@' + interaction.user.id + '> forsøgte at slette ' + amount + ' beskeder, men grænsen ligger på 100 pr. gang.')
            } else {
                channel.messages.fetch({ limit: amount }).then(messages => {
                    messages.forEach(message => {
                        setTimeout(() => {
                            message.delete();
                        }, 100)
                    });
                }).catch(console.error);
                await interaction.reply({
                    content: 'Sletning af ' + amount + ' beskeder er nu udført.',
                    ephemeral: true,
                })
                log('Slettede **' + amount + '** beskeder i <#' + channel.id + '>.')
                channel.send({
                    embeds: [embed]
                })
            }
        }
    }

    if (commandName == 'test') {
    }

    if (commandName == 'serverdrift') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            log('<@' + interaction.user.id + '> brugte kommandoen **/serverdrift**.')
            const channel = client.channels.cache.get(Config.serverdrift_channel);

            const loading = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Serverdrift__')
                .setDescription('Loading serverdata ⚙️...')
                .setFooter({ text: 'Atlantic City 2.0 - Serverdrift', iconURL: logo })
                .setTimestamp()

            const message = await channel.send({
                embeds: [loading]
            })
            
            setInterval(() => {
                try {
                    srv.getServerStatus().then(data => {
                        if (data.online == true) {
                            srv.getPlayersAll().then(data => {
                                const embed =   new MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle('__Atlantic City 2.0 Serverdrift__')
                                    .setFooter({ text: 'Atlantic City 2.0 - Serverdrift', iconURL: logo })
                                    .setTimestamp()

                                const row = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                        .setEmoji("🚀")
                                        .setURL('https://cfx.re/join/qvaqlz')
                                        .setStyle("LINK")
                                        .setLabel("Tilslut")
                                    )
                                

                                if (data.length == 0) {
                                    embed.addField('**Spillerliste**', 'Ingen spillere online ❌', true)
                                    embed.addField('Status', 'Online 🟢', true)
                                } else {
                                    embed.addField('**Spillerliste**', '> ' + data.map(player => `[**${player.id}**] ${player.name} - **${player.ping}**ms`).join('\n'), true)
                                    embed.addField('Status', 'Online 🟢', true)
                                }

                                message.edit({
                                    embeds: [embed],
                                    components: [row]
                                })
                            })
                        } else if (!data.online) {
                            console.log('offline')
                            const embed =   new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('__Atlantic City 2.0 Serverdrift__')
                                .setFooter({ text: 'Atlantic City 2.0 - Serverdrift', iconURL: logo })
                                .setTimestamp()
                                .addField('**Spillerliste**', 'Ingen spillere online ❌', true)
                                .addField('Status', 'Offline ❌', true)
                            message.edit({
                                embeds: [embed]
                            })
                            } else {
                            console.log('error')
                            const embed =   new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('__Atlantic City 2.0 Serverdrift__')
                                .setFooter({ text: 'Atlantic City 2.0 - Serverdrift', iconURL: logo })
                                .setTimestamp()
                                .addField('**Spillerliste**', 'Kunne ikke loade spillerdata ⚠️.', true)
                                .addField('Status', 'Connection Error ⚠️', true)
                            message.edit({
                                embeds: [embed]
                            })

                        }
                    })
                } catch (err) {
                    console.log(err)
                }
            }, 2000)
        }
    }

    if (commandName == 'pingcreate') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            log('<@' + interaction.user.id + '> brugte kommandoen **/pingcreate**.')
            const channel = client.channels.cache.get(Config.pingrolle_channel);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Ping__')
                .setDescription(`Kunne du godt tænke dig at blive pinget, når der kommer nogle nyheder?\nSå tryk på knappen nedenfor, for at modtage <@&${Config.ping_role}> rollen.\nVil du ikke have den længere, kan du bare trykke på knappen igen.`)
                .setFooter({ text: 'Atlantic City 2.0 - Ping', iconURL: logo })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("modtag")
                        .setEmoji("📝")
                        .setStyle("SUCCESS")
                        .setLabel("Modtag"),
                )
            const message = await channel.send({
                embeds: [embed],
                components: [row]
            })

            const filter = ( button ) => button.clicker;
            const collector = message.createMessageComponentCollector(filter, { time: 120000 });

            collector.on('collect', async (button) => {
                if (button.customId == "modtag") {
                    const replyEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 Ping__')
                        .setDescription(`Du modtog <@&${Config.ping_role}> rollen.`)
                        .setFooter({ text: 'Atlantic City 2.0 - Ping', iconURL: logo })
                    const replyEmbed2 = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 Ping__')
                        .setDescription(`Du fik fjernet <@&${Config.ping_role}> rollen.`)
                        .setFooter({ text: 'Atlantic City 2.0 - Ping', iconURL: logo })
                    const targetUser = button.user;
                    var guild = client.guilds.cache.get(Config.guild)
                    const member = await guild.members.fetch(targetUser.id)
                    const role = await guild.roles.fetch(Config.ping_role)
                    // check if user has role
                    if (member.roles.cache.has(role.id)) {
                        member.roles.remove(role.id)
                        await button.reply({
                            embeds: [replyEmbed2],
                            ephemeral: true
                        })
                    } else {
                        member.roles.add(role.id)
                        await button.reply({
                            embeds: [replyEmbed],
                            ephemeral: true
                        })
                    }
                }
            })
                    

        }
    }

    if (commandName == 'faq') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            const channel = client.channels.cache.get(Config.faq_channel);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 FAQ__')
                .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                .setDescription(
                'Nedenfor kan du vælge, hvad du vil have svar på.\n\n' +
                '1️⃣ **Hvad framework bruger i?**\n\n' +
                '2️⃣ **Hvordan ansøger jeg?**\n\n' +
                '3️⃣ **Hvad er aldersgrænsen?**\n\n' +
                '4️⃣ **Information om Atlantic City?**\n\n' +
                '5️⃣ **Hvornår svarer i på ansøgninger?**\n\n' +
                '6️⃣ **Er det realistisk roleplay?**\n\n' +
                '7️⃣ **Hvor mange karaktere har man?**\n\n' +
                '8️⃣ **Hvor mange slots har i?**\n\n'
                )
                
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("1")
                        .setEmoji("1️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("2")
                        .setEmoji("2️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("3")
                        .setEmoji("3️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("4")
                        .setEmoji("4️⃣")
                        .setStyle("SECONDARY"),
                )

            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("5")
                        .setEmoji("5️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("6")
                        .setEmoji("6️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("7")
                        .setEmoji("7️⃣")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("8")
                        .setEmoji("8️⃣")
                        .setStyle("SECONDARY"),

                )

            channel.send({
                embeds: [embed],
                components: [row, row2]
            })

            const filter = ( button ) => button.clicker;
            const collector = channel.createMessageComponentCollector(filter, { time: 120000 });
            collector.on('collect', async (button) => {
                if (button.customId == '1') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription(`Atlantic City benytter sig af ESX Legacy (**v1.7.5**) frameworked.`)
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                } else if (button.customId == '2') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription(`Du kan ansøge om de forskellige jobs, og om at blive en del af teamet, inde i <#${Config.ansøgning_channel}> `)
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                } else if (button.customId == '3') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription(`Der er ingen aldersgrænse på whitelist ansøgningerne, her handler det om ens timer og erfaring i FiveM.\nMen på visse whitelisted jobs og ansøgninger, kan en aldersgrænse forekomme.`)
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    catch (error) {
                        return
                    }
                } else if (button.customId == '4') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription(
                            '**Baggrunds Historie**\n' +
                            '> Atlantic City var en vRP server, der kørte tilbage i 2019.\n' +
                            '> Grundlaget for serverens lukning, var at ledelsen blev nød til at forlade, grundet økonomiske årsager.\n' +
                            '> Dengang lå Atlantic City på gennemsnitligt 60 spiller dagligt, efter at have været oppe i 2 uger.\n\n' +
                            '**Moto & Info**\n' +
                            '> Dengang blev Atlantic City kendt for deres udvikling, det var unikt og der var mange ting man ikke havde set før. ' +
                            'Det førte også til et forhøjet RP niveau.\n' +
                            '> Der var også god support, og et godt community. Det gjorde de ved at der ikke var nogen aldersgrænse, men at de kiggede på timerne, og erfaring.\n' +
                            '> Der var dog en aldersgrænse på visse jobs, og ting i teamet.\n\n' +
                            '**Formål med at åbne op igen.**\n' +
                            '> 2.0 har været i <@' + Config.odin_id + '> baghovedet længe. Han har længe gået og tænkt på at starte Atlantic City op igen.\n' +
                            '> Han mener at det danske FiveM mangler nye servere, som ikke efterligner andre, og er unikke.\n' +
                            '> Han har dog taget sagen i sin egen hånd, og har fået penge til at betale det hele.\n\n' +
                            '**Fremtid for Atlantic City**\n' +
                            '> Vi håber på at blive ved med at være på udviklingen, og bygge et af de bedste RP communities i Danmark.\n' +
                            '> Så vi en dag kan kaldes os nogle af de bedste i dag.'
                        )
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    catch (error) {
                        return
                    }
                } else if (button.customId == '5') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription('Det er forskelligt fra område til område, da der er forskellige ansvarlige.')
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    catch (error) {
                        return
                    }
                } else if (button.customId == '6') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription('På Atlantic City kører vi med realistisk roleplay.')
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                } else if (button.customId == '7') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription('Vi har valgt, at man skal have 2 karaktere.')
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                } else if (button.customId == '8') {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('__Atlantic City 2.0 FAQ__')
                        .setDescription('Vi har valgt at køre med 64 slots.')
                        .setFooter({ text: 'Atlantic City 2.0 - FAQ', iconURL: logo })
                    try {
                        await button.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } catch (error) {
                        return
                    }
                }
            })
        }
    }

    if (commandName == 'ticketcreate') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            const channel = client.channels.cache.get(Config.ticket_channel);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Tickets__')
                .setDescription(
                    '*Du kan vælge tickettens type nedenfor.*' +
                    '\n\n' +
                    '**✉️ Generel Ticket**\n' + 
                    '> Hvis du har brug for hjælp, eller hvis du har et spørgsmål.\n\n' +
                    '**⚙️ Dev Ticket**\n' +
                    '> Hvis du har brug for en developers hjælp, eller du har fundet en fejl.\n\n' +
                    '**👤 Ledelse Ticket**\n' +
                    '> Hvis du har brug for at kontakte en fra ledelsen.'
                )
                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('ticket_type')
                        .setPlaceholder('Vælg Ticket Type')
                        .addOptions([
                            {
                                label: '✉️ Generel Ticket',
                                description: 'Tryk for at oprette en generel ticket.',
                                value: 'generelticket'
                            },
                            {
                                label: '⚙️ Dev Ticket',
                                description: 'Tryk for at oprette en dev ticket.',
                                value: 'devticket'
                            },
                            {
                                label: '👤 Ledelse Ticket',
                                description: 'Tryk for at oprette en ledelse ticket.',
                                value: 'ledelseticket'
                            },
                        ])
                )

            channel.send({
                embeds: [embed],
                components: [row],
            })
        }
    }

    if (commandName == 'ticketadd') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            const channel = interaction.channel;
            if (channel.parentId == Config.ticket_category) {
                const targetUser = interaction.options.getUser('user');
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('__Atlantic City 2.0 Tickets__')
                    .setDescription('Du tilføjede <@' + targetUser + '> til denne ticket.')
                    .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                const ticketEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('__Atlantic City 2.0 Tickets__')  
                    .setDescription('<@' + interaction.user + '> tilføjede <@' + targetUser + '> til denne ticket.')
                    .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

                channel.send({
                    embeds: [ticketEmbed],
                })
                try {
                    channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                        VIEW_CHANNEL: false,
                        SEND_MESSAGES: false,
                    });
                    
                    channel.permissionOverwrites.create(targetUser, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                    }).catch(console.error);
                    log(`${interaction.user} tilføjede ${targetUser} til **${channel.name}**.`)
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    if (commandName == 'ticketremove') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            const channel = interaction.channel;
            if (channel.parentId == Config.ticket_category) {
                const targetUser = interaction.options.getUser('user');
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('__Atlantic City 2.0 Tickets__')
                    .setDescription('Du fjernede <@' + targetUser + '> fra denne ticket.')
                    .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                const ticketEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('__Atlantic City 2.0 Tickets__')  
                    .setDescription('<@' + interaction.user + '> fjernede <@' + targetUser + '> fra denne ticket.')
                    .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

                channel.send({
                    embeds: [ticketEmbed],
                })
                try {
                    channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                        VIEW_CHANNEL: false,
                        SEND_MESSAGES: false,
                    });
                    
                    channel.permissionOverwrites.create(targetUser, {
                        VIEW_CHANNEL: false,
                        SEND_MESSAGES: false,
                        READ_MESSAGE_HISTORY: false,
                    }).catch(console.error);

                    log(`${interaction.user} fjernede ${targetUser} fra **${channel.name}**.`)
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
})

// Select Menuer \\
client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;
    const value = interaction.values;
    // Ansøgninger \\
    if (interaction.customId === 'ansøgning_type') {
        if (value == 'politi') {
            const modal = new Modal()
                .setCustomId('politi_ansøgning')
                .setTitle('Politi Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('politi_navn')
                        .setLabel('Navn & Alder [IRL]')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('SHORT'),

                    new TextInputComponent()
                        .setCustomId('politi_hvorfor')
                        .setLabel('Hvorfor ansøger du?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('politi_vælgedig')
                        .setLabel('Hvorfor skal vi vælge dig?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('politi_erfaringer')
                        .setLabel('Hvad er dine erfaringer?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                )
            discordModals.showModal(modal, {
                client: client,
                interaction: interaction,
            })
        } else if (value == 'ems') {
            const modal = new Modal()
                .setCustomId('ems_ansøgning')
                .setTitle('EMS Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('ems_navn')
                        .setLabel('Navn & Alder [IRL]')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('SHORT'),

                    new TextInputComponent()
                        .setCustomId('ems_hvorfor')
                        .setLabel('Hvorfor ansøger du?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('ems_vælgedig')
                        .setLabel('Hvorfor skal vi vælge dig?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('ems_erfaringer')
                        .setLabel('Hvad er dine erfaringer?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                )
            discordModals.showModal(modal, {
                client: client,
                interaction: interaction,
            })
        } else if (value == 'advokat') {
            const modal = new Modal()
                .setCustomId('advokat_ansøgning')
                .setTitle('Advokat Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('advokat_navn')
                        .setLabel('Navn & Alder [IRL]')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true)
                        .setStyle('SHORT'),

                    new TextInputComponent()
                        .setCustomId('advokat_hvorfor')
                        .setLabel('Hvorfor ansøger du?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('advokat_vælgedig')
                        .setLabel('Hvorfor skal vi vælge dig?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('advokat_erfaringer')
                        .setLabel('Hvad er dine erfaringer?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                )
            discordModals.showModal(modal, {
                client: client,
                interaction: interaction,
            })
        } else if (value == 'firma') {
            const modal = new Modal()
                .setCustomId('firma_ansøgning')
                .setTitle('Firma Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('firma_navn')
                        .setLabel('Navn & Alder [IRL]')
                        .setStyle('SHORT')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),
                    
                    new TextInputComponent()
                        .setCustomId('firma_om')
                        .setLabel('Hvad skal dit firma hedde?')
                        .setStyle('SHORT')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('firma_lave')
                        .setLabel('Hvad laver dit firma?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('firma_medarbejdere')
                        .setLabel('Liste af firmaets medarbejdere? [3+]')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('firma_rådighed')
                        .setLabel('Hvad skal vi stille dit firma til rådighed?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),
                )
            discordModals.showModal(modal, {
                client: client,
                interaction: interaction,
            })
        } else if (value == 'staff') {
            const modal = new Modal()
                .setCustomId('staff_ansøgning')
                .setTitle('Staff Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('staff_navn')
                        .setLabel('Navn & Alder [IRL]')
                        .setStyle('SHORT')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('staff_hvorfor')
                        .setLabel('Hvorfor ansøger du?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('staff_erfaringer')
                        .setLabel('Hvad er dine erfaringer?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('staff_vælgedig')
                        .setLabel('Hvorfor skal vi vælge dig?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),
                )
            discordModals.showModal(modal, {
                client: client,
                interaction: interaction,
            })
        } else if (value == 'betatester') {
            const modal = new Modal()
                .setCustomId('betatester_ansøgning')
                .setTitle('Beta Tester Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('beta_timer')
                        .setLabel('Timer i FiveM? [Inkl. bevis]')
                        .setStyle('SHORT')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('beta_tit')
                        .setLabel('Hvor tit kan du være aktiv, som beta tester?')
                        .setStyle('SHORT')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('beta_hvorfor')
                        .setLabel('Hvorfor vil du gerne være beta tester?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),
                )
            discordModals.showModal(modal, {
                client: client,
                interaction: interaction,
            })
        } else if (value == 'whitelistmodtager') {
            const modal = new Modal()
                .setCustomId('whitelistmodtager_ansøgning')
                .setTitle('Whitelist Modtager Ansøgning')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('whitelistmodtager_navn')
                        .setLabel('Navn & Alder [IRL]')
                        .setStyle('SHORT')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('whitelistmodtager_hvorfor')
                        .setLabel('Hvorfor ansøger du?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId('whitelistmodtager_vælgedig')
                        .setLabel('Hvorfor skal vi vælge dig?')
                        .setStyle('LONG')
                        .setPlaceholder('Indtast dit svar.')
                        .setRequired(true),
                )
            discordModals.showModal(modal, {
                client: client,
                interaction: interaction,
            })
        }
    }
    // Ticket System \\
    if (interaction.customId === 'ticket_type') {
        if (value == 'generelticket') {
            log(`<@${interaction.user.id}> oprettede en generel ticket.`)
            const channel = client.channels.cache.get(Config.ticket_channel);
            const subChannel = await channel.guild.channels.create(`generel-${interaction.user.username}`);
            subChannel.setParent(Config.ticket_category);
            log(`Subchannel ${subChannel.name} oprettet.`)
            const user = interaction.user

            subChannel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
            });

            subChannel.permissionOverwrites.create(user, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
            }).catch(console.error);

            const embed = new MessageEmbed()
                .setTitle('__Atlantic City 2.0 Tickets__')
                .setDescription(`Oprettede Generel Ticket <#${subChannel.id}>`)
                .setColor('#0099ff')
                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })
                
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            const channelEmbed = new MessageEmbed()
                .setTitle('__Atlantic City 2.0 Tickets__')
                .setDescription(`Det her er din ticket. Hvis du ønsker at få tilføjet folk til ticketten, skal du bare skrive det her. Derefter vil en staff tilføje personen.`)
                .setColor('#0099ff')
                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ticket_close')
                        .setLabel('Luk')
                        .setStyle('DANGER')
                        .setEmoji('✖️')
                )

            const subMessage = await subChannel.send({
                embeds: [channelEmbed],
                content: `${interaction.user}`,
                components: [row]
            })

            const filter = ( button ) => button.clicker;
            const collector = subMessage.createMessageComponentCollector(filter, { time: 120000 });
    
            collector.on('collect', async (button) => {
                if (button.customId == 'ticket_close') {
                    const embed = new MessageEmbed()
                        .setTitle('__Atlantic City 2.0 Tickets__')
                        .setDescription(`Er du sikker på, du vil lukke ticketten?`)
                        .setColor('#0099ff')
                        .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('ticket_close_yes')
                                .setLabel('Ja')
                                .setStyle('SUCCESS')
                                .setEmoji('✔️'),
                            new MessageButton()
                                .setCustomId('ticket_close_no')
                                .setLabel('Nej')
                                .setStyle('DANGER')
                                .setEmoji('✖️'),
                        )
                    
                    const ticket_closeMessage = await subChannel.send({
                        embeds: [embed],
                        components: [row]
                    })

                    const filter = ( button ) => button.clicker;
                    const collector = ticket_closeMessage.createMessageComponentCollector(filter, { time: 120000 });
                    collector.on('collect', async (button) => {
                        if (button.customId == 'ticket_close_yes') {
                            const embed = new MessageEmbed()
                                .setTitle('__Atlantic City 2.0 Tickets__')
                                .setDescription(`**Ticketten er nu lukket.**\n*Kanalen bliver slettet om 5 sekunder.*`)
                                .setColor('#0099ff')
                                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                            button.reply({
                                embeds: [embed],
                            })

                            setTimeout(() => {
                                log(`${button.user} lukkede en ticket (**${subChannel.name}**).`)
                                log(`Subchannel ${subChannel.name} slettet.`)
                                try {
                                    if (subChannel != null) {
                                        subChannel.delete().catch(console.error);
                                    } else {
                                        return
                                    }
                                } catch (error) {
                                    log(`Kunne ikke slette subchannel ${subChannel.name}.`)
                                }
                            }, 5000)
                        } else if (button.customId == 'ticket_close_no') {
                            const embed = new MessageEmbed()
                                .setTitle('__Atlantic City 2.0 Tickets__')
                                .setDescription(`**Genåbner ticketten.**`)
                                .setColor('#0099ff')
                                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                            button.reply({
                                embeds: [embed],
                            })

                            setTimeout(() => {
                                ticket_closeMessage.delete();
                                log(`${button.user} genåbnede en ticket (**${subChannel.name}**).`)
                            }, 1000)
                        }
                    })
                }
            })

        } else if (value == 'devticket') {
            log(`<@${interaction.user.id}> oprettede en dev ticket.`)
            const channel = client.channels.cache.get(Config.ticket_channel);
            const subChannel = await channel.guild.channels.create(`dev-${interaction.user.username}`);
            subChannel.setParent(Config.ticket_category);
            log(`Subchannel ${subChannel.name} oprettet.`)
            const user = interaction.user

            subChannel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
            });

            subChannel.permissionOverwrites.create(user, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
            }).catch(console.error);

            const embed = new MessageEmbed()
                .setTitle('__Atlantic City 2.0 Tickets__')
                .setDescription(`Oprettede Dev Ticket <#${subChannel.id}>`)
                .setColor('#0099ff')
                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })
                
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            const channelEmbed = new MessageEmbed()
                .setTitle('__Atlantic City 2.0 Tickets__')
                .setDescription(`Det her er din ticket. Hvis du ønsker at få tilføjet folk til ticketten, skal du bare skrive det her. Derefter vil en staff tilføje personen.`)
                .setColor('#0099ff')
                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ticket_close')
                        .setLabel('Luk')
                        .setStyle('DANGER')
                        .setEmoji('✖️')
                )

            const subMessage = await subChannel.send({
                embeds: [channelEmbed],
                content: `${interaction.user}`,
                components: [row]
            })

            const filter = ( button ) => button.clicker;
            const collector = subMessage.createMessageComponentCollector(filter, { time: 120000 });
    
            collector.on('collect', async (button) => {
                if (button.customId == 'ticket_close') {
                    const embed = new MessageEmbed()
                        .setTitle('__Atlantic City 2.0 Tickets__')
                        .setDescription(`Er du sikker på, du vil lukke ticketten?`)
                        .setColor('#0099ff')
                        .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('ticket_close_yes')
                                .setLabel('Ja')
                                .setStyle('SUCCESS')
                                .setEmoji('✔️'),
                            new MessageButton()
                                .setCustomId('ticket_close_no')
                                .setLabel('Nej')
                                .setStyle('DANGER')
                                .setEmoji('✖️'),
                        )
                    
                    const ticket_closeMessage = await subChannel.send({
                        embeds: [embed],
                        components: [row]
                    })

                    const filter = ( button ) => button.clicker;
                    const collector = ticket_closeMessage.createMessageComponentCollector(filter, { time: 120000 });
                    collector.on('collect', async (button) => {
                        if (button.customId == 'ticket_close_yes') {
                            const embed = new MessageEmbed()
                                .setTitle('__Atlantic City 2.0 Tickets__')
                                .setDescription(`**Ticketten er nu lukket.**\n*Kanalen bliver slettet om 5 sekunder.*`)
                                .setColor('#0099ff')
                                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                            button.reply({
                                embeds: [embed],
                            })

                            setTimeout(() => {
                                log(`${button.user} lukkede en ticket (**${subChannel.name}**).`)
                                log(`Subchannel ${subChannel.name} slettet.`)
                                try {
                                    if (subChannel != null) {
                                        subChannel.delete().catch(console.error);
                                    } else {
                                        return
                                    }
                                } catch (error) {
                                    log(`Kunne ikke slette subchannel ${subChannel.name}.`)
                                }
                            }, 5000)
                        } else if (button.customId == 'ticket_close_no') {
                            const embed = new MessageEmbed()
                                .setTitle('__Atlantic City 2.0 Tickets__')
                                .setDescription(`**Genåbner ticketten.**`)
                                .setColor('#0099ff')
                                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                            button.reply({
                                embeds: [embed],
                            })

                            setTimeout(() => {
                                ticket_closeMessage.delete();
                                log(`${button.user} genåbnede en ticket (**${subChannel.name}**).`)
                            }, 1000)
                        }
                    })
                }
            })
        } else if (value == 'ledelseticket') {
            log(`<@${interaction.user.id}> oprettede en ledelse ticket.`)
            const channel = client.channels.cache.get(Config.ticket_channel);
            const subChannel = await channel.guild.channels.create(`ledelse-${interaction.user.username}`);
            subChannel.setParent(Config.ticket_category);
            log(`Subchannel ${subChannel.name} oprettet.`)
            const user = interaction.user

            subChannel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
            });

            subChannel.permissionOverwrites.create(user, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
            }).catch(console.error);

            const embed = new MessageEmbed()
                .setTitle('__Atlantic City 2.0 Tickets__')
                .setDescription(`Oprettede Ledelse Ticket <#${subChannel.id}>`)
                .setColor('#0099ff')
                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })
                
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            const channelEmbed = new MessageEmbed()
                .setTitle('__Atlantic City 2.0 Tickets__')
                .setDescription(`Det her er din ticket. Hvis du ønsker at få tilføjet folk til ticketten, skal du bare skrive det her. Derefter vil en staff tilføje personen.`)
                .setColor('#0099ff')
                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ticket_close')
                        .setLabel('Luk')
                        .setStyle('DANGER')
                        .setEmoji('✖️')
                )

            const subMessage = await subChannel.send({
                embeds: [channelEmbed],
                content: `${interaction.user}`,
                components: [row]
            })

            const filter = ( button ) => button.clicker;
            const collector = subMessage.createMessageComponentCollector(filter, { time: 120000 });
    
            collector.on('collect', async (button) => {
                if (button.customId == 'ticket_close') {
                    const embed = new MessageEmbed()
                        .setTitle('__Atlantic City 2.0 Tickets__')
                        .setDescription(`Er du sikker på, du vil lukke ticketten?`)
                        .setColor('#0099ff')
                        .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('ticket_close_yes')
                                .setLabel('Ja')
                                .setStyle('SUCCESS')
                                .setEmoji('✔️'),
                            new MessageButton()
                                .setCustomId('ticket_close_no')
                                .setLabel('Nej')
                                .setStyle('DANGER')
                                .setEmoji('✖️'),
                        )
                    
                    const ticket_closeMessage = await subChannel.send({
                        embeds: [embed],
                        components: [row]
                    })

                    const filter = ( button ) => button.clicker;
                    const collector = ticket_closeMessage.createMessageComponentCollector(filter, { time: 120000 });
                    collector.on('collect', async (button) => {
                        if (button.customId == 'ticket_close_yes') {
                            const embed = new MessageEmbed()
                                .setTitle('__Atlantic City 2.0 Tickets__')
                                .setDescription(`**Ticketten er nu lukket.**\n*Kanalen bliver slettet om 5 sekunder.*`)
                                .setColor('#0099ff')
                                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                            button.reply({
                                embeds: [embed],
                            })

                            setTimeout(() => {
                                log(`${button.user} lukkede en ticket (**${subChannel.name}**).`)
                                log(`Subchannel ${subChannel.name} slettet.`)
                                try {
                                    if (subChannel != null) {
                                        subChannel.delete().catch(console.error);
                                    } else {
                                        return
                                    }
                                } catch (error) {
                                    log(`Kunne ikke slette subchannel ${subChannel.name}.`)
                                }
                            }, 5000)
                        } else if (button.customId == 'ticket_close_no') {
                            const embed = new MessageEmbed()
                                .setTitle('__Atlantic City 2.0 Tickets__')
                                .setDescription(`**Genåbner ticketten.**`)
                                .setColor('#0099ff')
                                .setFooter({ text: 'Atlantic City 2.0 - Tickets', iconURL: logo })

                            button.reply({
                                embeds: [embed],
                            })

                            setTimeout(() => {
                                ticket_closeMessage.delete();
                                log(`${button.user} genåbnede en ticket (**${subChannel.name}**).`)
                            }, 1000)
                        }
                    })
                }
            })
        }
    }
})

// Modal Submits \\
client.on('modalSubmit', async (modal) => {
    // Ansøgninger \\
    if(modal.customId === 'politi_ansøgning') {
        log(`<@${modal.user.id}> har ansøgt om politi.`)
        const politi_navn = modal.getTextInputValue('politi_navn');
        const politi_hvorfor = modal.getTextInputValue('politi_hvorfor');
        const politi_vælgedig = modal.getTextInputValue('politi_vælgedig');
        const politi_erfaringer = modal.getTextInputValue('politi_erfaringer');
        const channel = client.channels.cache.get(Config.ansøgning_channel);
        
        const embed = new MessageEmbed()
            .setTitle('__Politi Ansøgning__')
            .setDescription(
            '*Denne ansøgning kan besvares nedenfor*\n\n' +
            '> **Indsendt af:** \n<@' + modal.user.id  +'>\n\n' + 
            '> **Navn & Alder:** \n' + politi_navn + '\n\n' +
            '> **Hvorfor ansøger du?:** \n' + politi_hvorfor + '\n\n' +
            '> **Hvorfor skal vi vælge dig?:** \n' + politi_vælgedig + '\n\n' +
            '> **Hvad er dine erfaringer?:** \n' + politi_erfaringer + '\n\n'
            )
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const replyEmbed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Ansøgninger')
            .setDescription('Din ansøgning er nu blevet sendt, til de ansvarlige for ansøgningerne.\nDen vil blive svaret på snarest.')
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setEmoji("✔️")
                    .setStyle("SUCCESS")
                    .setLabel("Accepter"),
                new MessageButton()
                    .setCustomId("decline")
                    .setEmoji("✖️")
                    .setStyle("DANGER")
                    .setLabel("Afvis")   
            );

        const subChannel = await channel.guild.channels.create(`politi-${modal.user.username}`);
        subChannel.setParent(Config.ansøgning_category);
        log(`Subchannel ${subChannel.name} oprettet.`)
    
        modal.reply({
            embeds: [replyEmbed],
            ephemeral: true,
        })

        const message = await subChannel.send({
            embeds: [embed],
            components: [row],
        });

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'accept') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Accepterede ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din politi ansøgning er blevet accepteret.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> politi ansøgningen.`)
            } else if (button.customId == 'decline') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Afviste ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din politi ansøgning er blevet afvist.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> afviste <@${modal.user.id}> politi ansøgningen.`)
            }
        })
    } else if (modal.customId == 'ems_ansøgning') {
        log(`<@${modal.user.id}> har ansøgt om EMS.`)
        const politi_navn = modal.getTextInputValue('ems_navn');
        const politi_hvorfor = modal.getTextInputValue('ems_hvorfor');
        const politi_vælgedig = modal.getTextInputValue('ems_vælgedig');
        const politi_erfaringer = modal.getTextInputValue('ems_erfaringer');
        const channel = client.channels.cache.get(Config.ansøgning_channel);
        
        const embed = new MessageEmbed()
            .setTitle('__EMS Ansøgning__')
            .setDescription(
            '*Denne ansøgning kan besvares nedenfor*\n\n' +
            '> **Indsendt af:** \n<@' + modal.user.id  +'>\n\n' + 
            '> **Navn & Alder:** \n' + politi_navn + '\n\n' +
            '> **Hvorfor ansøger du?:** \n' + politi_hvorfor + '\n\n' +
            '> **Hvorfor skal vi vælge dig?:** \n' + politi_vælgedig + '\n\n' +
            '> **Hvad er dine erfaringer?:** \n' + politi_erfaringer + '\n\n'
            )
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const replyEmbed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Ansøgninger')
            .setDescription('Din ansøgning er nu blevet sendt, til de ansvarlige for ansøgningerne.\nDen vil blive svaret på snarest.')
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setEmoji("✔️")
                    .setStyle("SUCCESS")
                    .setLabel("Accepter"),
                new MessageButton()
                    .setCustomId("decline")
                    .setEmoji("✖️")
                    .setStyle("DANGER")
                    .setLabel("Afvis")   
            );

        const subChannel = await channel.guild.channels.create(`ems-${modal.user.username}`);
        subChannel.setParent(Config.ansøgning_category);
        log(`Subchannel ${subChannel.name} oprettet.`)
    
        modal.reply({
            embeds: [replyEmbed],
            ephemeral: true,
        })

        const message = await subChannel.send({
            embeds: [embed],
            components: [row],
        });

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'accept') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Accepterede ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din EMS ansøgning er blevet accepteret.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> EMS ansøgning.`)
            } else if (button.customId == 'decline') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Afviste ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din EMS ansøgning er blevet afvist.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${modal.user.id}> afviste EMS ansøgningen.`)
            }
        })
    } else if (modal.customId == 'advokat_ansøgning') {
        log(`<@${modal.user.id}> har ansøgt om advokat.`)
        const politi_navn = modal.getTextInputValue('advokat_navn');
        const politi_hvorfor = modal.getTextInputValue('advokat_hvorfor');
        const politi_vælgedig = modal.getTextInputValue('advokat_vælgedig');
        const politi_erfaringer = modal.getTextInputValue('advokat_erfaringer');
        const channel = client.channels.cache.get(Config.ansøgning_channel);
        
        const embed = new MessageEmbed()
            .setTitle('__Advokat Ansøgning__')
            .setDescription(
            '*Denne ansøgning kan besvares nedenfor*\n\n' +
            '> **Indsendt af:** \n<@' + modal.user.id  +'>\n\n' + 
            '> **Navn & Alder:** \n' + politi_navn + '\n\n' +
            '> **Hvorfor ansøger du?:** \n' + politi_hvorfor + '\n\n' +
            '> **Hvorfor skal vi vælge dig?:** \n' + politi_vælgedig + '\n\n' +
            '> **Hvad er dine erfaringer?:** \n' + politi_erfaringer + '\n\n'
            )
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const replyEmbed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Ansøgninger')
            .setDescription('Din ansøgning er nu blevet sendt, til de ansvarlige for ansøgningerne.\nDen vil blive svaret på snarest.')
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setEmoji("✔️")
                    .setStyle("SUCCESS")
                    .setLabel("Accepter"),
                new MessageButton()
                    .setCustomId("decline")
                    .setEmoji("✖️")
                    .setStyle("DANGER")
                    .setLabel("Afvis")   
            );

        const subChannel = await channel.guild.channels.create(`advokat-${modal.user.username}`);
        subChannel.setParent(Config.ansøgning_category);
        log(`Subchannel ${subChannel.name} oprettet.`)
    
        modal.reply({
            embeds: [replyEmbed],
            ephemeral: true,
        })

        const message = await subChannel.send({
            embeds: [embed],
            components: [row],
        });

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'accept') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Accepterede ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din advokat ansøgning er blevet accepteret.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> advokat ansøgningen.`)
            } else if (button.customId == 'decline') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Afviste ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din advokat ansøgning er blevet afvist.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> politi ansøgningen.`)
            }
        })
    } else if (modal.customId == 'firma_ansøgning') {
        log(`<@${modal.user.id}> har ansøgt om at oprette et firma.`)
        const politi_navn = modal.getTextInputValue('firma_navn');
        const politi_hvorfor = modal.getTextInputValue('firma_om');
        const politi_vælgedig = modal.getTextInputValue('firma_lave');
        const politi_erfaringer = modal.getTextInputValue('firma_medarbejdere');
        const firma_rådighed = modal.getTextInputValue('firma_rådighed');
        const channel = client.channels.cache.get(Config.ansøgning_channel);
        
        const embed = new MessageEmbed()
            .setTitle('Firma Ansøgning__')
            .setDescription(
            '*Denne ansøgning kan besvares nedenfor*\n\n' +
            '> **Indsendt af:** \n<@' + modal.user.id  +'>\n\n' + 
            '> **Navn & Alder:** \n' + politi_navn + '\n\n' +
            '> **Hvad skal dit firma hedde?:** \n' + politi_hvorfor + '\n\n' +
            '> **Hvad laver dit firma?:** \n' + politi_vælgedig + '\n\n' +
            '> **Liste af firmaets medarbejdere? [3+]:** \n' + politi_erfaringer + '\n\n' +
            '> **Hvad skal vi stille dit firma til rådighed?:** \n' + firma_rådighed + '\n\n'
            )
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const replyEmbed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Ansøgninger')
            .setDescription('Din ansøgning er nu blevet sendt, til de ansvarlige for ansøgningerne.\nDen vil blive svaret på snarest.')
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setEmoji("✔️")
                    .setStyle("SUCCESS")
                    .setLabel("Accepter"),
                new MessageButton()
                    .setCustomId("decline")
                    .setEmoji("✖️")
                    .setStyle("DANGER")
                    .setLabel("Afvis")   
            );

        const subChannel = await channel.guild.channels.create(`firma-${modal.user.username}`);
        subChannel.setParent(Config.ansøgning_category);
        log(`Subchannel ${subChannel.name} oprettet.`)
    
        modal.reply({
            embeds: [replyEmbed],
            ephemeral: true,
        })

        const message = await subChannel.send({
            embeds: [embed],
            components: [row],
        });

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'accept') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Accepterede ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din firma ansøgning er blevet accepteret.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> firma ansøgning.`)
            } else if (button.customId == 'decline') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Afviste ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din firma ansøgning er blevet afvist.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> afviste <@${modal.user.id}> firma ansøgning.`)
            }
        })
    } else if (modal.customId == 'staff_ansøgning') {
        log(`<@${modal.user.id}> har ansøgt om staff.`)
        const politi_navn = modal.getTextInputValue('staff_navn');
        const politi_hvorfor = modal.getTextInputValue('staff_hvorfor');
        const politi_vælgedig = modal.getTextInputValue('staff_vælgedig');
        const politi_erfaringer = modal.getTextInputValue('staff_erfaringer');
        const channel = client.channels.cache.get(Config.ansøgning_channel);
        
        const embed = new MessageEmbed()
            .setTitle('__Staff Ansøgning__')
            .setDescription(
            '*Denne ansøgning kan besvares nedenfor*\n\n' +
            '> **Indsendt af:** \n<@' + modal.user.id  +'>\n\n' + 
            '> **Navn & Alder:** \n' + politi_navn + '\n\n' +
            '> **Hvorfor ansøger du?:** \n' + politi_hvorfor + '\n\n' +
            '> **Hvorfor skal vi vælge dig?:** \n' + politi_vælgedig + '\n\n' +
            '> **Hvad er dine erfaringer?:** \n' + politi_erfaringer + '\n\n'
            )
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const replyEmbed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Ansøgninger')
            .setDescription('Din ansøgning er nu blevet sendt, til de ansvarlige for ansøgningerne.\nDen vil blive svaret på snarest.')
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setEmoji("✔️")
                    .setStyle("SUCCESS")
                    .setLabel("Accepter"),
                new MessageButton()
                    .setCustomId("decline")
                    .setEmoji("✖️")
                    .setStyle("DANGER")
                    .setLabel("Afvis")   
            );

        const subChannel = await channel.guild.channels.create(`staff-${modal.user.username}`);
        subChannel.setParent(Config.ansøgning_category);
        log(`Subchannel ${subChannel.name} oprettet.`)
    
        modal.reply({
            embeds: [replyEmbed],
            ephemeral: true,
        })

        const message = await subChannel.send({
            embeds: [embed],
            components: [row],
        });

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'accept') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Accepterede ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din staff ansøgning er blevet accepteret.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> staff ansøgning.`)
            } else if (button.customId == 'decline') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Afviste ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din staff ansøgning er blevet afvist.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> afviste <@${modal.user.id}> staff ansøgning.`)
            }
        })
    } else if (modal.customId == 'betatester_ansøgning') {
        log(`<@${modal.user.id}> har ansøgt om beta tester.`)
        const politi_timer = modal.getTextInputValue('beta_timer');
        const politi_tit = modal.getTextInputValue('beta_tit');
        const politi_hvorfor = modal.getTextInputValue('beta_hvorfor');
        const channel = client.channels.cache.get(Config.ansøgning_channel);
        
        const embed = new MessageEmbed()
            .setTitle('__Beta Tester Ansøgning__')
            .setDescription(
            '*Denne ansøgning kan besvares nedenfor*\n\n' +
            '> **Indsendt af:** \n<@' + modal.user.id  +'>\n\n' + 
            '> **Timer i FiveM [Inkl. Bevis]:** \n' + politi_timer + '\n\n' +
            '> **Hvor tit kan du være aktiv, som beta tester?:** \n' + politi_tit + '\n\n' +
            '> **Hvorfor vil du gerne være beta tester?:** \n' + politi_hvorfor + '\n\n'
            )
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const replyEmbed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Ansøgninger')
            .setDescription('Din ansøgning er nu blevet sendt, til de ansvarlige for ansøgningerne.\nDen vil blive svaret på snarest.')
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setEmoji("✔️")
                    .setStyle("SUCCESS")
                    .setLabel("Accepter"),
                new MessageButton()
                    .setCustomId("decline")
                    .setEmoji("✖️")
                    .setStyle("DANGER")
                    .setLabel("Afvis")   
            );

        const subChannel = await channel.guild.channels.create(`beta-${modal.user.username}`);
        subChannel.setParent(Config.ansøgning_category);
        log(`Subchannel ${subChannel.name} oprettet.`)
    
        modal.reply({
            embeds: [replyEmbed],
            ephemeral: true,
        })

        const message = await subChannel.send({
            embeds: [embed],
            components: [row],
        });

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'accept') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Accepterede ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din beta tester ansøgning er blevet accepteret.\nEn besked vil blive sendt til <@249894737870454784>, vedr. en tid til samtale.\nDerefter vil du få en besked af botten, om du kan på det tidspunkt eller ej.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> beta tester ansøgning.`)

                // Besked til Odin \\
                const odinEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription(`<@${modal.user.id}> beta tester ansøgning er blevet accepteret.\nKlik nedenfor for at aftale en tid.`)
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                    .setTimestamp()

                const odinRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("aftalTid")
                            .setEmoji("⏰")
                            .setStyle("SUCCESS")
                            .setLabel("Aftal Tid"),
                    )

                const odinDM = await client.users.cache.get(Config.odin_id).createDM();
                const odinMessage = await odinDM.send({
                    embeds: [odinEmbed],
                    components: [odinRow],
                })
                log(`DM sendt til <@${Config.odin_id}>`)
                const user = client.users.cache.get(modal.user.id);
                const odinFilter = ( button ) => button.clicker;
                const odinCollector = odinMessage.createMessageComponentCollector(odinFilter, { time: 120000 });
                odinCollector.on('collect', async (button) => {
                    if (button.customId == 'aftalTid') {
                        const odinModal = new Modal()
                            .setCustomId('beta_aftale')
                            .setTitle('Beta Tester Ansøgning')
                            .addComponents(
                                new TextInputComponent()
                                    .setCustomId('beta_aftaltDato')
                                    .setLabel('Dato [DD/MM]')
                                    .setStyle('SHORT')
                                    .setPlaceholder('Indtast dit svar.')
                                    .setRequired(true),
                                new TextInputComponent()
                                    .setCustomId('beta_aftaltTid')
                                    .setLabel('Klokken [HH:MM]')
                                    .setStyle('SHORT')
                                    .setPlaceholder('Indtast dit svar.')
                                    .setRequired(true),
                            )

                        discordModals.showModal(odinModal, {
                            client: client,
                            interaction: button,
                        })
                    }
                })
                client.on('modalSubmit', async (modal) => {
                    if(modal.customId === 'beta_aftale') {
                        const targetDM = await client.users.cache.get(user.id).createDM();
                        const odinDM = await client.users.cache.get(Config.odin_id).createDM();
                        const targetDato = modal.getTextInputValue('beta_aftaltDato');
                        const targetTid = modal.getTextInputValue('beta_aftaltTid');
                        const targetEmbed = new MessageEmbed()
                            .setTitle('Atlantic City 2.0 - Ansøgninger')
                            .setDescription(`<@${user.id}> har lavet en tid til dig.\n> **Dato:** ${targetTid}\n> **Tid:** ${targetDato}\n\nHar du tid til en samtale på dette tidspunkt?`)
                            .setColor('#0099ff')
                            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                            .setTimestamp()
                        
                        const targetRow = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId("accept")
                                    .setEmoji("✔️")
                                    .setStyle("SUCCESS")
                                    .setLabel("Ja"),
                                new MessageButton()
                                    .setCustomId("decline")
                                    .setEmoji("✖️")
                                    .setStyle("DANGER")
                                    .setLabel("Nej"),
                            )
                            
                        const targetMessage = await targetDM.send({
                            embeds: [targetEmbed],
                            components: [targetRow],
                        })
                        log(`DM sendt til <@${user.id}>`)

                        const replyMessage = new MessageEmbed()
                            .setTitle('Atlantic City 2.0 - Ansøgninger')
                            .setDescription(`Satte Tidspunkt.\n> **Dato:** ${targetTid}\n> **Tid:** ${targetDato}`)
                            .setColor('#0099ff')
                            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                            .setTimestamp()

                        odinDM.send({
                            embeds: [replyMessage],
                        })

                        const targetFilter = ( button ) => button.clicker;
                        const targetCollector = targetMessage.createMessageComponentCollector(targetFilter, { time: 120000 });
                        targetCollector.on('collect', async (button) => {
                            if (button.customId == 'accept') {
                                const targetEmbed = new MessageEmbed()
                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                    .setDescription(`<@${user.id}> har tid til en samtale på det bestemte tidspunket.\n> **Dato:** ${targetTid}\n> **Tid:** ${targetDato}`)
                                    .setColor('#0099ff')
                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                    .setTimestamp()

                                const embed = new MessageEmbed()
                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                    .setDescription(`Sender besked til <@${Config.odin_id}>`)
                                    .setColor('#0099ff')
                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                    .setTimestamp()

                                button.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                })
            
                                odinDM.send({
                                    embeds: [targetEmbed],
                                })
                            } else if (button.customId == 'decline') {
                                const targetModal = new Modal()
                                    .setCustomId('beta_decline')
                                    .setTitle('Forslå ny Tidspunkt')
                                    .addComponents(
                                        new TextInputComponent()
                                            .setCustomId('beta_aftaltDato')
                                            .setLabel('Dato [DD/MM]')
                                            .setStyle('SHORT')
                                            .setPlaceholder('Indtast dit svar.')
                                            .setRequired(true),
                                        new TextInputComponent()
                                            .setCustomId('beta_aftaltTid')
                                            .setLabel('Klokken [HH:MM]')
                                            .setStyle('SHORT')
                                            .setPlaceholder('Indtast dit svar.')
                                            .setRequired(true),
                                    )
                                discordModals.showModal(targetModal, {
                                    client: client,
                                    interaction: button,
                                })

                                client.on('modalSubmit', async (modal) => {
                                    if (modal.customId == 'beta_decline') {
                                        const targetInput = modal.getTextInputValue('beta_aftaltDato');
                                        const targetInput2 = modal.getTextInputValue('beta_aftaltTid');
                                        const odinEmbed = new MessageEmbed()
                                            .setTitle('Atlantic City 2.0 - Ansøgninger')
                                            .setDescription(`<@${user.id}> har ikke tid til en samtale på det bestemte tidspunkt.\nPersonen har forslået et nyt tidspunkt.\n> **Dato:** ${targetInput}\n> **Tid:** ${targetInput2}\n\nHar du tid til en samtale på dette tidspunkt?`)
                                            .setColor('#0099ff')
                                            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                            .setTimestamp()
                                        const row = new MessageActionRow()
                                            .addComponents(
                                                new MessageButton()
                                                    .setCustomId("accept")
                                                    .setEmoji("✔️")
                                                    .setStyle("SUCCESS")
                                                    .setLabel("Ja"),
                                                new MessageButton()
                                                    .setCustomId("decline")
                                                    .setEmoji("✖️")
                                                    .setStyle("DANGER")
                                                    .setLabel("Opret Ticket"),
                                            )
                                        const odinMessage = await odinDM.send({
                                            embeds: [odinEmbed],
                                            components: [row],
                                        })

                                        const embed = new MessageEmbed()
                                            .setTitle('Atlantic City 2.0 - Ansøgninger')
                                            .setDescription(`Sender besked til <@${Config.odin_id}>`)
                                            .setColor('#0099ff')
                                            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                            .setTimestamp()

                                        targetDM.send({
                                            embeds: [embed],
                                            ephemeral: true
                                        })

                                        const odinFilter = ( button ) => button.clicker;
                                        const odinCollector = odinMessage.createMessageComponentCollector(odinFilter, { time: 120000 });
                                        odinCollector.on('collect', async (button) => {
                                            if (button.customId == 'accept') {
                                                const targetEmbed = new MessageEmbed()
                                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                                    .setDescription(`<@${Config.odin_id}> har tid til en samtale på det bestemte tidspunket.`)
                                                    .setColor('#0099ff')
                                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                                    .setTimestamp()
                                                
                                                const odinEmbed = new MessageEmbed()
                                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                                    .setDescription(`Sender besked til <@${user.id}>`)
                                                    .setColor('#0099ff')
                                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                                    .setTimestamp()

                                                targetDM.send({
                                                    embeds: [targetEmbed],
                                                })
                                                odinDM.send({
                                                    embeds: [odinEmbed],
                                                })
                                            } else if (button.customId == 'decline') {
                                                // make new channel in specific guild
                                                const guild = client.guilds.cache.get(Config.guild);
                                                const subchannel = await guild.channels.create(`${user.username}-aftaltid`);
                                                // get the subchannel
                                                const subchannel2 = guild.channels.cache.get(subchannel.id);
                                                const everyone = guild.roles.cache.find(role => role.name === '@everyone');

                                                const odinEmbed = new MessageEmbed()
                                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                                    .setDescription(`Der er nu blevet opret en ticket (<#${subchannel.id}>), så i kan finde et tidspunkt, der passer jer bedst.`)
                                                    .setColor('#0099ff')
                                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                                    .setTimestamp()

                                                odinDM.send({
                                                    embeds: [odinEmbed],
                                                })

                                                targetDM.send({
                                                    embeds: [odinEmbed],
                                                })

                                                subchannel.permissionOverwrites.create(everyone, {
                                                    VIEW_CHANNEL: false,
                                                    SEND_MESSAGES: false,
                                                });

                                                subchannel.permissionOverwrites.create(user, { // Rettigheder for alle.
                                                    VIEW_CHANNEL: true,
                                                    SEND_MESSAGES: true,
                                                });

                                                const channelEmbed = new MessageEmbed()
                                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                                    .setDescription('Her kan i beslutte, hvad for et tidspunkt der passer jer begge bedst.\nNår i er færdige, skal der bare trykkes på knappen nedenfor, og skrive tidspunket.')
                                                    .setColor('#0099ff')
                                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                                    .setTimestamp()
                                                
                                                const subChannelRow = new MessageActionRow()
                                                    .addComponents(
                                                        new MessageButton()
                                                            .setCustomId("færdig")
                                                            .setEmoji("✔️")
                                                            .setStyle("SUCCESS")
                                                            .setLabel("Færdig"),
                                                    )

                                                const subChannelMessage = await subchannel2.send({
                                                    embeds: [channelEmbed],
                                                    components: [subChannelRow],
                                                    content: `> **__<@${user.id}> • <@${Config.odin_id}>__**`
                                                })

                                                const subChannelFilter = ( button ) => button.clicker;
                                                const subChannelCollector = subChannelMessage.createMessageComponentCollector(subChannelFilter, { time: 120000 });
                                                subChannelCollector.on('collect', async (button) => {
                                                    if (button.customId == 'færdig') {
                                                        const subChannelModal = new Modal()
                                                            .setCustomId('beta_færdig')
                                                            .setTitle('Forslå ny Tidspunkt')
                                                            .addComponents(
                                                                new TextInputComponent()
                                                                    .setCustomId('beta_aftaltDato')
                                                                    .setLabel('Dato [DD/MM]')
                                                                    .setStyle('SHORT')
                                                                    .setPlaceholder('Indtast dit svar.')
                                                                    .setRequired(true),
                                                                new TextInputComponent()
                                                                    .setCustomId('beta_aftaltTid')
                                                                    .setLabel('Klokken [HH:MM]')
                                                                    .setStyle('SHORT')
                                                                    .setPlaceholder('Indtast dit svar.')
                                                                    .setRequired(true),
                                                            )

                                                        discordModals.showModal(subChannelModal, {
                                                            client: client,
                                                            interaction: button,
                                                        })

                                                        client.on('modalSubmit', async (modal) => {
                                                            if (modal.customId == 'beta_færdig') {
                                                                const targetDato = modal.getTextInputValue('beta_aftaltDato');
                                                                const targetTid = modal.getTextInputValue('beta_aftaltTid');
                                                                const targetEmbed = new MessageEmbed()
                                                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                                                    .setDescription(`Der er nu blevet aftalt et tidspunkt.\n> **Dato**: ${targetDato}\n> **Tid:** ${targetTid}`)
                                                                    .setColor('#0099ff')
                                                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                                                    .setTimestamp()

                                                                const odinEmbed = new MessageEmbed()
                                                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                                                    .setDescription(`Du har nu aftalt en tid med <@${user.id}>.\n> **Dato:** ${targetDato}\n> **Tid:** ${targetTid}`)
                                                                    .setColor('#0099ff')
                                                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                                                    .setTimestamp()

                                                                const embed = new MessageEmbed()
                                                                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                                                                    .setDescription(`Der er nu blevet aftalt et tidspunkt.\n> **Dato:** ${targetDato}\n> **Tid:** ${targetTid}\n\n*Kanalen vil blive slettet om 5 sekunder.*`)
                                                                    .setColor('#0099ff')
                                                                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })
                                                                    .setTimestamp()
                                                                    
                                                                subchannel2.send({
                                                                    embeds: [embed],
                                                                })
                                                                targetDM.send({
                                                                    embeds: [targetEmbed],
                                                                })
                                                                odinDM.send({
                                                                    embeds: [odinEmbed],
                                                                })

                                                                setTimeout(() => {
                                                                    subchannel2.delete();
                                                                }, 5000)
                                                            }
                                                        })
                                                            
                                                    }
                                                })
                                            }
                                        })

                                    }
                                })
                                
                            }
                        })
                    }
                })

            } else if (button.customId == 'decline') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Afviste ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din beta tester ansøgning er blevet afvist.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> afviste <@${modal.user.id}> beta tester ansøgning.`)
            }
        }) 
    } else if (modal.customId == 'whitelistmodtager_ansøgning') {
        log(`<@${modal.user.id}> har ansøgt om at blive whitelist modtager.`)
        const politi_navn = modal.getTextInputValue('whitelistmodtager_navn');
        const politi_hvorfor = modal.getTextInputValue('whitelistmodtager_hvorfor');
        const politi_vælgedig = modal.getTextInputValue('whitelistmodtager_vælgedig');
        const channel = client.channels.cache.get(Config.ansøgning_channel);
        
        const embed = new MessageEmbed()
            .setTitle('__Whitelist Modtager Ansøgning__')
            .setDescription(
            '*Denne ansøgning kan besvares nedenfor*\n\n' +
            '> **Indsendt af:** \n<@' + modal.user.id  +'>\n\n' + 
            '> **Navn & Alder:** \n' + politi_navn + '\n\n' +
            '> **Hvorfor ansøger du?:** \n' + politi_hvorfor + '\n\n' +
            '> **Hvorfor skal vi vælge dig?:** \n' + politi_vælgedig + '\n\n'
            )
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const replyEmbed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Ansøgninger')
            .setDescription('Din ansøgning er nu blevet sendt, til de ansvarlige for ansøgningerne.\nDen vil blive svaret på snarest.')
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setEmoji("✔️")
                    .setStyle("SUCCESS")
                    .setLabel("Accepter"),
                new MessageButton()
                    .setCustomId("decline")
                    .setEmoji("✖️")
                    .setStyle("DANGER")
                    .setLabel("Afvis")   
            );

        const subChannel = await channel.guild.channels.create(`wm-${modal.user.username}`);
        subChannel.setParent(Config.ansøgning_category);
        log(`Subchannel ${subChannel.name} oprettet.`)
    
        modal.reply({
            embeds: [replyEmbed],
            ephemeral: true,
        })

        const message = await subChannel.send({
            embeds: [embed],
            components: [row],
        });

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'accept') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Accepterede ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din whitelist modtager ansøgning er blevet accepteret.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> whitelist modtager ansøgning.`)
            } else if (button.customId == 'decline') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Afviste ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Ansøgninger')
                    .setDescription('Din whitelist modtager ansøgning er blevet afvist.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Ansøgninger', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> afviste <@${modal.user.id}> whitelist modtager ansøgning.`)
            }
        })
    } else if (modal.customId == 'whitelist_ansøgning') {
        log(`<@${modal.user.id}> har ansøgt om whitelist.`)
        const channel = client.channels.cache.get(Config.whitelist_channel);
        const whitelist_karakter = modal.getTextInputValue('whitelist_karakter');
        const whitelist_hvorfor = modal.getTextInputValue('whitelist_hvorfor');
        const whitelist_lave = modal.getTextInputValue('whitelist_lave');
        const whitelist_steam = modal.getTextInputValue('whitelist_steam');
        const embed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Whitelist')
            .setDescription('Din whitelist ansøgning er nu blevet sendt til whitelist modtager teamet.\nWhitelist ansøgningen vil blive svaret på snarest.')
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })

        const infoEmbed = new MessageEmbed()
            .setTitle('Atlantic City 2.0 - Whitelist')
            .setDescription(
            '*Denne ansøgning kan besvares nedenfor.*\n\n' +
            '> **Indsendt af**\n' + `<@${modal.user.id}>\n\n` +
            '> **Information om karakter [Navn, Baggrund, etc]**\n' + `${whitelist_karakter}\n\n` +
            '> **Hvorfor vil du gerne spille på Atlantic City?**\n' + `${whitelist_hvorfor}\n\n` +
            '> **Hvad regner du med at lave på Atlantic City?**\n' + `${whitelist_lave}\n\n` +
            '> **Link til din steam profil?**\n' + `${whitelist_steam}`
            )
            .setColor('#0099ff')
            .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setEmoji("✔️")
                    .setStyle("SUCCESS")
                    .setLabel("Accepter"),
                new MessageButton()
                    .setCustomId("decline")
                    .setEmoji("✖️")
                    .setStyle("DANGER")
                    .setLabel("Afvis")
            );

        modal.reply({
            embeds: [embed],
            ephemeral: true,
        })

        const subChannel = await channel.guild.channels.create(`${modal.user.username}`);
        subChannel.setParent(Config.whitelist_category);
        log(`Subchannel ${subChannel.name} oprettet.`)

        const message = await subChannel.send({
            embeds: [infoEmbed],
            components: [row]
        })

        const filter = ( button ) => button.clicker;
        const collector = message.createMessageComponentCollector(filter, { time: 120000 });

        collector.on('collect', async (button) => {
            if (button.customId == 'accept') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Whitelist')
                    .setDescription('Accepterede ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })

                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Whitelist')
                    .setDescription('Din whitelist ansøgning er blevet accepteret.\nLæs <#998663798242152538> for yderligere information.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                var guild = client.guilds.cache.get(Config.guild)
                const member = await guild.members.fetch(modal.user.id)
                const role = await guild.roles.fetch(Config.whitelist_afventerRole)
                member.roles.add(role)
                log(`<@${modal.user.id}> fik rollen <@&${role.id}>`)

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> accepterede <@${modal.user.id}> whitelist ansøgning.`)

            } else if (button.customId == 'decline') {
                const embed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Whitelist')
                    .setDescription('Afviste ansøgningen, og sender DM til ansøgeren.\nKanalen vil blive slettet om 5 sekunder.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })
                const dmEmbed = new MessageEmbed()
                    .setTitle('Atlantic City 2.0 - Whitelist')
                    .setDescription('Din whitelist ansøgning er blevet afvist.\nLæs <#998663798242152538> for yderligere information.')
                    .setColor('#0099ff')
                    .setFooter({ text: 'Atlantic City 2.0 - Whitelist', iconURL: logo })

                subChannel.send({
                    embeds: [embed],
                })

                if (Config.dms == true) {
                    const dm = await modal.user.createDM();
                    dm.send({
                        embeds: [dmEmbed],
                    })
                    log(`DM sendt til <@${modal.user.id}>`)
                }

                setTimeout(() => {
                    subChannel.delete();
                    log(`Subchannel ${subChannel.name} slettet.`)
                }, 5000)
                log(`<@${button.user.id}> afviste <@${modal.user.id}> whitelist ansøgning.`)
            }
        })
    }
});
// Youtube Ready \\
youtube.on("ready", (ready) => {
    youtube.subscribe(Config.youtube_id);
    console.log("Youtube connected at: ", ready);
});

// Error Handler \\
client.on("error", (error) => {
    try {
        log(`**ERROR RECIEVED**\n\n**${err.name}**: ${err.message}`, 'error');
        console.log(error);
    } catch (err) {
        console.log(err);
        log(`**ERROR RECIEVED**\n\n**${err.name}**: ${err.message}`, 'error');
    }
})

// Startup \\
client.on('ready', () => {
    console.log(`Logget ind som ${client.user.tag}`)
    autoStatus();
    log(`Logget ind som ${client.user.tag}`)
    
    const guild = client.guilds.cache.get(Config.guildID);
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    // Commands \\
    commands?.create({
        name: 'ping',
        description: 'Ping Command ⚙️.',
    })

    commands?.create({
        name: 'faq',
        description: 'Opretter FAQ system. DEV ONLY.',
    })

    commands?.create({
        name: 'pingcreate',
        description: 'Opretter valgfri ping rolle. DEV ONLY.',
    })

    commands?.create({
        name: 'ticketcreate',
        description: 'Opretter ticket system. DEV ONLY.',
    })

    commands?.create({
        name: 'ticketadd',
        description: 'Tilføjer en bruger til en ticket. STAFF ONLY.',
        options: [
            {
                name: 'user',
                description: 'Brugeren',
                type: 6,
                required: true,
            }
        ]
    })

    commands?.create({
        name: 'ticketremove',
        description: 'Fjerner en bruger fra en ticket. STAFF ONLY.',
        options: [
            {
                name: 'user',
                description: 'Brugeren',
                type: 6,
                required: true,
            }
        ]
    })

    commands?.create({
        name: 'ansøgcreate',
        description: 'Opretter ansøgningerne. DEV ONLY.',
    })

    commands?.create({
        name: 'whitelistcreate',
        description: 'Opretter whitelist ansøgningerne. DEV ONLY.',
    })

    commands?.create({
        name: 'ansøg',
        description: 'Ansøg om whitelist.',
    })

    commands?.create({
        name: 'test',
        description: 'Test Command ⚙️.',
    })

    commands?.create({
        name: 'clear',
        description: 'Sletter et bestemt antal beskeder. STAFF ONLY.',
        options: [
            {
                name: 'amount',
                description: 'Antal beskeder der skal fjernes.',
                type: 4,
                required: true,
            },
        ]
    })

    commands?.create({
        name: 'whitelistadd',
        description: 'Tilføjer whitelist til en bruger. STAFF ONLY.',
        options: [
            {
                name: 'user',
                description: 'Brugeren',
                type: 6,
                required: true,
            }
        ]
    })

    commands?.create({
        name: 'whitelistremove',
        description: 'Fjerner whitelist fra en bruger. STAFF ONLY.',
        options: [
            {
                name: 'user',
                description: 'Brugeren',
                type: 6,
                required: true,
            }
        ]
    })

    commands?.create({
        name: 'serverdrift',
        description: 'Tjekker serverens drift. DEV ONLY.',
    })

    log('Loadede alle kommandoer.')
    kontrolPanel()
    log('Loading kontrolpanel...')
    startSystems()
    log('Starter systemer...')	
})

// Login \\
client.login(Keys.token);