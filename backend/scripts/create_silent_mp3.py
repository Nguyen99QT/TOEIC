from pydub import AudioSegment
import sys

def create_silent_mp3(filename, duration_ms=1000):
    silent = AudioSegment.silent(duration=duration_ms)
    silent.export(filename, format="mp3")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_silent_mp3.py <output.mp3> [duration_ms]")
        sys.exit(1)
    filename = sys.argv[1]
    duration = int(sys.argv[2]) if len(sys.argv) > 2 else 1000
    create_silent_mp3(filename, duration)
