from PIL import Image, ImageDraw, ImageFont
import pika
import json
import base64
from io import BytesIO
import time
import datetime

connection = pika.BlockingConnection()

storageChannel = connection.channel()
storageChannel.queue_declare(queue="storage", durable=True)


def on_message(channel, method_frame, header_frame, body):
    text = json.loads(body)["data"]
    print(
        f"[{method_frame.routing_key}] Received message # {method_frame.delivery_tag}: '{text}'"
    )

    im = Image.open("image.jpeg")
    top = ImageFont.truetype("comic.ttf", 16)
    bottom = ImageFont.truetype("arial.ttf", 26)
    draw = ImageDraw.Draw(im)
    draw.text((20, 140), f"{text}", font=bottom, fill=(0, 0, 0))
    draw.text(
        (20, 20),
        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        font=top,
        fill=(30, 30, 30),
    )
    draw.rectangle((0, 0, 640, 480), outline=(0, 0, 0))
    buffered = BytesIO()
    buffered = BytesIO()
    im.save(buffered, format="PNG")
    buffered.seek(0)
    img_byte = buffered.getvalue()
    img_str = "data:image/png;base64," + base64.b64encode(img_byte).decode()
    storageChannel.basic_publish(
        exchange="",
        routing_key="storage",
        body=json.dumps(
            {
                "data": img_str,
                "name": f"{text}_{int(time.time())}.png",
            }
        ),
        properties=pika.BasicProperties(delivery_mode=2),
    )
    channel.basic_ack(delivery_tag=method_frame.delivery_tag)


channel = connection.channel()
channel.basic_consume("jobs", on_message)
try:
    channel.start_consuming()
except KeyboardInterrupt:
    channel.stop_consuming()
connection.close()
