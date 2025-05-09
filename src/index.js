import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { config } from "dotenv";
import fetch from "node-fetch";

config();

const { DISCORD_TOKEN, CLIENT_ID } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID) {
  throw new Error(
    "Missing DISCORD_TOKEN or CLIENT_ID in environment variables"
  );
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "generate",
    description: "Generates a random fact!",
  },
  {
    name: "cry",
    description: "Replies with a sad emoji.",
  },
];

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for slash commands
    GatewayIntentBits.GuildMessages, // For message-related events
    GatewayIntentBits.MessageContent, // If you need to read message content
  ],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
    console.log("Pong!");
  }

  if (commandName === "generate") {
    console.log("Generating fact...");
    const fact = await fetch(
      "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
    );
    const data = await fact.json();
    await interaction.reply(data.text);
    console.log("Generated fact:", data.text);
  }

  if (commandName === "cry") {
    await interaction.reply("😔😔😔😔😔😔");
    console.log("Crying emoji sent.");
  }
});

client.login(DISCORD_TOKEN);
