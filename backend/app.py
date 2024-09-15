import json
from logging import getLogger
from typing import TypedDict

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from utils.claude import post_claude
from utils.file import read_text
from utils.stable_diffusion import post_stable_diffusion
from utils.generate_bubble import generate_page

logger = getLogger(__name__)

app = FastAPI()


class ImageRequest(BaseModel):
    prompt: str


@app.post("/image")
async def create_manga(request: ImageRequest):
    manga_script = await generate_manga_script(request.prompt)
    images = []
    for scene in manga_script:
        images.append(generate_manga(scene))

    return JSONResponse({"images": images})


class SceneScript(TypedDict):
    scene_number: str
    scene_content: str
    scene_type: str


async def generate_manga_script(document) -> list[SceneScript]:
    """漫画スクリプトを生成する関数"""

    async def _exe():
        return json.loads(
            await post_claude(
                read_text("prompt/setting.txt").replace(
                    "[ここに文書の内容を入力してください]", document
                )
            )
        )

    try:
        return await _exe()
    except json.decoder.JSONDecodeError:
        return await _exe()


def generate_manga(scene: 2) -> str:
    """漫画を生成する関数"""
    initial_prompt = (
        "anime:1.1, detailed, sharp focus, 4K, TV show, <lora:anime_lora:10>, "
    )
    male_actor = "charismatic male TV host, black swept back hair, dark suit, microphone, middle-aged, "
    female_actor = "cute Japanese female, brown short hair, pink dress, "
    if "オープニング" in scene["scene_type"]:
        prompt = (
            initial_prompt
            + "large screen, colorful quiz show set, audience in background, excited atmosphere,"
            + male_actor
            + "explaining quiz, standing at podium"
            + initial_prompt
            + female_actor
            + "standing pose, "
        )
    elif "クイズ問題" in scene["scene_type"]:
        prompt = (
            initial_prompt
            + "close-up of large screen displaying quiz question and options, "
            + male_actor
            + "cheering pose, "
            + initial_prompt
            + female_actor
            + "crossed arms, thinking expression, standing at podium"
        )
    elif "エンディング" in scene["scene_type"]:
        prompt = (
            initial_prompt
            + "contestant receiving trophy, celebratory atmosphere, "
            + male_actor
            + initial_prompt
            + female_actor
            + "happy expression"
        )
    else:
        prompt = (
            initial_prompt
            + male_actor
            + "speaking with microphone, "
            + initial_prompt
            + female_actor
            + "standing pose, "
        )

    image_data = post_stable_diffusion(prompt)
    manga_data = generate_page(image_data, scene.get("scene_content"))
    return manga_data


if __name__ == "__main__":
    """debug用"""
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
