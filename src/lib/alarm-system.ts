
class AlarmSystem {
  private audioInstance: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  // Initialize with the sound URL
  constructor(private soundUrl: string = 'https://www.soundjay.com/buttons/sounds/beep-08b.mp3') {}

  // Start the alarm sound
  startAlarm(): void {
    if (this.isPlaying) return;
    
    try {
      // Create a new audio element
      this.audioInstance = new Audio(this.soundUrl);
      // Loop the sound
      this.audioInstance.loop = true;
      // Play the sound
      this.audioInstance.play()
        .then(() => {
          this.isPlaying = true;
          console.log('Alarm started');
        })
        .catch(error => {
          console.error('Error playing alarm:', error);
        });
    } catch (error) {
      console.error('Error creating audio element:', error);
    }
  }

  // Stop the alarm sound
  stopAlarm(): void {
    if (!this.isPlaying || !this.audioInstance) return;
    
    try {
      this.audioInstance.pause();
      this.audioInstance.currentTime = 0;
      this.isPlaying = false;
      console.log('Alarm stopped');
    } catch (error) {
      console.error('Error stopping alarm:', error);
    }
  }

  // Check if the alarm is currently playing
  isAlarmPlaying(): boolean {
    return this.isPlaying;
  }
}

// Export a singleton instance
export const alarmSystem = new AlarmSystem();
