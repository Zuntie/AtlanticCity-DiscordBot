// Imports | Requires | Consts \\
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_BANS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_WEBHOOKS'], partials: ['CHANNEL', 'MESSAGE'] });
const Config = require('./config.json');
const Keys = require('./keys.json');
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { Modal, TextInputComponent, SelectMenuComponent } = require('discord-modals'); // Import all
const discordModals = require('discord-modals') // Define the discord-modals package!
discordModals(client); // discord-modals needs your client in order to interact with modals

// Variables \\
const logo = 'https://i.imgur.com/IDWrddQ.png'
const StaffRole = Config.dev_role || Config.stjerne_role

// Auto Status \\
function autoStatus() {
    client.user.setActivity('Administrerer Atlantic City', { type: 'WATCHING' })
}

// Commands \\
client.on('interactionCreate', async (interaction) => {
    const { commandName, options } = interaction;
    if (!interaction.isCommand()) return;

    if (commandName == 'ping') {
        interaction.reply('Pong!');
    }

    if (commandName == 'ansøgcreate') {
        if (interaction.member.roles.cache.has(StaffRole)) {
            const channel = client.channels.cache.get(Config.ansøgning_channel);
            const ansøgningsEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('__Atlantic City 2.0 Ansøgninger__')
                .setDescription('*Du kan ansøge nedenfor.*\n\n**Politi 👮**\nVær en del af politistyrken, og stop kriminelitet.\n\n**EMS 🚑**\nVær en del af EMS, for at medicinere og genoplive folk.\n\n**Advokat 💼**\nVær en advokat, og deltag i retsager.\n\n**Firma 👷**\nOpret og administrer dit eget firma.\n\n**Staff 👤**\n Vær en del af staff teamet, og hjælp til med at moderere på serveren.\n\n**Whitelist Modtager 📝**\nVær en whitelist modtager, for at svare på whitelist ansøgninger samt samtalerne.')
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
        }
        
    }

})

// Select Menuer \\
client.on('interactionCreate', interaction => {
    if (!interaction.isSelectMenu()) return;
    // Ansøgninger \\
    if (interaction.customId === 'ansøgning_type') {
        const value = interaction.values;
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
    // Ansøgninger \\
})

// Modal Submits \\
client.on('modalSubmit', async (modal) => {
    // Ansøgninger \\
    if(modal.customId === 'politi_ansøgning') {
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
            }
        })
    } else if (modal.customId === 'ems_ansøgning') {
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
            }
        })
    } else if (modal.customId === 'advokat_ansøgning') {
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
            }
        })
    } else if (modal.customId === 'firma_ansøgning') {
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
            }
        })
    } else if (modal.customId === 'staff_ansøgning') {
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
            }
        })
    } else if (modal.customId === 'whitelistmodtager_ansøgning') {
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
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
                }

                setTimeout(() => {
                    subChannel.delete();
                }, 5000)
            }
        })
    } // Ansøgninger \\
});

// Startup \\
client.on('ready', () => {
    console.log(`Logget ind som ${client.user.tag}`)
    autoStatus();
    
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
        name: 'ansøgcreate',
        description: 'Opretter ansøgningerne.',
    })
})

// Login \\
client.login(Keys.token);