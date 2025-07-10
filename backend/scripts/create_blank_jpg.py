from PIL import Image
import sys

def create_blank_jpg(filename, width=100, height=100, color=(255,255,255)):
    img = Image.new('RGB', (width, height), color)
    img.save(filename, 'JPEG')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_blank_jpg.py <output.jpg> [width] [height]")
        sys.exit(1)
    filename = sys.argv[1]
    width = int(sys.argv[2]) if len(sys.argv) > 2 else 100
    height = int(sys.argv[3]) if len(sys.argv) > 3 else 100
    create_blank_jpg(filename, width, height)
