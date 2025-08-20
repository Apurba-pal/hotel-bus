const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const songsFolder = path.join(__dirname, "songs");
let songs = fs.readdirSync(songsFolder).filter(file =>
  file.endsWith(".mp3") || file.endsWith(".wav") || file.endsWith(".m4a")
);

if (!songs.length) {
  console.error("❌ No audio files found in /songs folder!");
  process.exit(1);
}

const randomSong = songs[Math.floor(Math.random() * songs.length)];
const songPath = path.join(songsFolder, randomSong);

console.log(`🎵 Now playing: ${randomSong} 🎵`);

// Start music (hidden)
const musicProcess = spawn("ffplay", ["-nodisp", "-autoexit", songPath], {
  stdio: "ignore",
  detached: true
});
musicProcess.unref();

// Start Next.js dev server
const nextDev = spawn("npm", ["run", "dev"], { stdio: "inherit", shell: true });

// Stop music when exiting
function stopMusic() {
  console.log("\n🛑 Stopping music...");
  try {
    process.kill(musicProcess.pid);
  } catch (e) {}
  process.exit(0);
}

process.on("SIGINT", stopMusic);
process.on("SIGTERM", stopMusic);

// When Next.js exits, also stop music
nextDev.on("close", stopMusic);
