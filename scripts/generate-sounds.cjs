const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the sounds directory exists
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Function to generate a simple beep sound
function generateSound(fileName, frequency = 440, duration = 0.5) {
  const filePath = path.join(soundsDir, fileName);
  
  // Use sox to generate a simple beep
  try {
    execSync(`sox -n -r 44100 -b 16 -c 1 ${filePath} synth ${duration} sine ${frequency} vol 0.5`);
    console.log(`Generated: ${filePath}`);
  } catch (error) {
    console.error(`Error generating ${filePath}:`, error.message);
    // Create empty file as fallback
    fs.writeFileSync(filePath, '');
  }
}

// Generate all required sound files
generateSound('turn-start.mp3', 523.25, 0.3);  // C5
setTimeout(() => generateSound('correct.mp3', 659.25, 0.2), 100);    // E5
setTimeout(() => generateSound('incorrect.mp3', 440, 0.5), 200);     // A4
setTimeout(() => generateSound('timeout.mp3', 349.23, 0.8), 300);    // F4
setTimeout(() => generateSound('victory.mp3', 1046.50, 1.0), 400);   // C6
