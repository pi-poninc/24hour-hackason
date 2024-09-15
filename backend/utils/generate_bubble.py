import json
import re
import io
import base64
from PIL import Image, ImageDraw, ImageFont


def create_talk_scipt(comments):
    talk = re.findall(r"「(.*?)」", comments)
    return talk


def _write_buble(
    talk_script: list, y_position=40, width=512, max_chars_per_line=15, size=25
) -> list:
    dicts = []
    x = width - 25
    num_script = len(talk_script)
    y = y_position
    for i in range(num_script):
        if i == round(num_script / 2):
            x = 100 * i
            y = y_position
        else:
            col = len(talk_script[i]) // max_chars_per_line + 1
            x -= size
            x -= col * size + 20
            y += size
        dicts.append({"text": talk_script[i], "xy": (x, y)})
    return dicts


def _split_text(text, max_chars_per_line):
    """
    任意の文字数でテキストを改行する関数
    :param text: 元のテキスト
    :param max_chars_per_line: 1行あたりの最大文字数
    :return: 改行されたテキストリスト
    """
    return [
        text[i : i + max_chars_per_line]
        for i in range(0, len(text), max_chars_per_line)
    ]


def draw_speech_bubble_with_vertical_text(
    image,
    xy,
    text,
    font,
    color=(0, 0, 0),
    bubble_color=(255, 255, 255),
    line_spacing=5,
    max_chars_per_line=5,
):
    """
    吹き出し付きの縦書きテキストを画像に描画し、指定文字数ごとに改行する関数
    :param image: Pillowで開いた画像
    :param position: テキストを開始する座標 (x, y)
    :param text: 描画するテキスト
    :param font: テキストに使用するフォント (ImageFont)
    :param color: テキストの色 (R, G, B)
    :param bubble_color: 吹き出しの色 (R, G, B)
    :param line_spacing: 各文字間のスペース（デフォルトは5ピクセル）
    :param max_chars_per_line: 1行あたりの最大文字数
    """
    draw = ImageDraw.Draw(image)

    # テキストを指定された文字数で分割
    lines = _split_text(text, max_chars_per_line)
    if len(text) > max_chars_per_line:
        total_heights = len(text)
    else:
        total_heights = max_chars_per_line
    # 吹き出しのサイズを計算（テキスト全体の高さと幅）
    max_width = 0
    total_heights = []
    for line in lines:
        bbox = font.getbbox(line, direction="ttb")
        max_width += bbox[2]
        total_heights.append(bbox[3])
    # 吹き出しの枠を計算
    bubble_padding = 20
    bubble_left = xy[0] - bubble_padding
    bubble_top = xy[1] - bubble_padding
    bubble_right = xy[0] + max_width + bubble_padding
    bubble_bottom = xy[1] + max(total_heights) + bubble_padding

    # 吹き出し（楕円形）の描画
    draw.rectangle(
        [bubble_left, bubble_top, bubble_right, bubble_bottom],
        fill=bubble_color,
        outline=(0, 0, 0),
        width=2,
    )

    # 吹き出しの尾（三角形）の描画
    triangle = [
        (bubble_right - 30, bubble_bottom),
        (bubble_right - 10, bubble_bottom),
        (bubble_right - 20, bubble_bottom + 30),
    ]
    draw.polygon(triangle, fill=bubble_color, outline=(0, 0, 0))

    # 縦書きテキストを描画
    _, y_defult = xy
    x = bubble_right - bubble_padding * 2 - 5
    for line in lines:
        bbox = font.getbbox(line, direction="ttb")
        y = y_defult
        draw.text((x, y), line, font=font, fill=color, direction="ttb")
        x -= bbox[2]  # 行間のスペースを追加
    return image


def generate_page(base64_img, scene_content, show=False):
    # 画像を開く
    imgdata = base64.b64decode(str(base64_img))
    image = Image.open(io.BytesIO(imgdata))
    page_speech_bubble = create_talk_scipt(scene_content)
    size = 40
    # フォントを指定（.ttfファイルが必要、サイズも指定）
    font = ImageFont.truetype(
        "GenEiKoburiMin6-R.ttf", size=size, layout_engine=ImageFont.Layout.RAQM
    )
    # テキストの内容、位置、色を指定
    # 画像にテキストを描画
    bubles = _write_buble(
        page_speech_bubble, max_chars_per_line=20, width=image.size[0], size=size
    )

    for buble in bubles:
        # draw.text(**buble, direction="ttb", font=font)
        draw_speech_bubble_with_vertical_text(
            image,
            **buble,
            font=font,
            color=(0, 0, 0),
            line_spacing=5,
            max_chars_per_line=20,
        )
    if show:
        return image.show()
    # PILイメージをバイトストリームに変換
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")  # PNGフォーマットで保存

    # バイトストリームをbase64エンコードされた文字列に変換
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return img_str


# def main():
#     json_file = "output/stable_diffusion_prompts.json"
#     prompts = load_prompts(json_file)
#     comments = [prompt.get("scene_content")for prompt in prompts]

#     prompts = load_prompts(json_file)
#     comments = [prompt.get("scene_content")for prompt in prompts]
#     speech_bubbles = create_talk_scipt(comments)
#     for i in range(len(speech_bubbles)):
#         generate_page(
#             page_file_name = f'output/expanded_manga_images/expanded_scene_{i}.png',
#             page_speech_bubble=speech_bubbles[i],
#             show=True,)
# if __name__ == "__main__":
#     main()
