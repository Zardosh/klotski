export default class SoundEffectPlayer {
  constructor() {
    self.baseDir = 'assets/sound/';
    self.soundEffects = [
      new Audio(self.baseDir + 'move-1.mp3'),
      new Audio(self.baseDir + 'move-2.mp3'),
      new Audio(self.baseDir + 'move-3.mp3'),
      new Audio(self.baseDir + 'move-4.mp3'),
      new Audio(self.baseDir + 'move-5.mp3'),
      new Audio(self.baseDir + 'move-6.mp3'),
      new Audio(self.baseDir + 'move-7.mp3'),
      new Audio(self.baseDir + 'move-8.mp3'),
      new Audio(self.baseDir + 'move-9.mp3'),
    ];
  }

  playRandomSoundEffect() {
    self.soundEffects[
      Math.floor(Math.random() * self.soundEffects.length)
    ].play();
  }
}
