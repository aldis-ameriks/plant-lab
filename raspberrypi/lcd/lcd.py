import Adafruit_Nokia_LCD as LCD
import Adafruit_GPIO.SPI as SPI
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

# Hardware SPI
DC = 23
RST = 24
SPI_PORT = 0
SPI_DEVICE = 0


def initialize_lcd():
    display = LCD.PCD8544(DC, RST, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE, max_speed_hz=4000000))
    display.begin(contrast=60)
    display.clear()
    display.display()
    return display


def draw_text(display, texts):
    image = Image.new('1', (LCD.LCDWIDTH, LCD.LCDHEIGHT))
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, LCD.LCDWIDTH, LCD.LCDHEIGHT), outline=255, fill=255)
    font = ImageFont.truetype('dejavu/DejaVuSansMono-Bold.ttf', 9)
    line_height = 9
    line_num = 0
    for text in texts:
        draw.text((0, line_height * line_num), text, font=font)
        line_num += 1
    display.image(image)
    display.display()

