import json
from logging import getLogger
from typing import TypedDict

import asyncio
import aiohttp
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
    async with aiohttp.ClientSession() as session:
        tasks = [generate_manga(scene, session) for x in manga_script]
        images = await asyncio.gather(*tasks)
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


async def generate_manga(scene: SceneScript, session: aiohttp.ClientSession) -> str:
    """漫画を生成する関数"""
    prompt = "manga style, anime style, comic book style, high quality, detailed, sharp focus, "
    if "オープニング" in scene["scene_type"]:
        prompt = (
            prompt
            + "bright TV studio, large screen, colorful quiz show set, audience in background, excited atmosphere, charismatic male TV host, suit, microphone, friendly smile, middle-aged, confident pose, average Japanese person, casual clothes, curious expression, slightly nervous, standing at podium"
        )
    elif "クイズ問題" in scene["scene_type"]:
        prompt = (
            prompt
            + "close-up of large screen displaying quiz question and options, TV studio background, charismatic male TV host, suit, microphone, average Japanese person, casual clothes, curious expression, slightly nervous, standing at podium"
        )
    elif "エンディング" in scene["scene_type"]:
        prompt = (
            prompt
            + "contestant receiving trophy, host shaking hands, celebratory atmosphere, studio audience applauding, charismatic male TV host, suit, microphone, friendly smile, average Japanese person, casual clothes, happy expression"
        )

    image_data = post_stable_diffusion(prompt, session)
    manga_data = generate_page(image_data, scene.get("scene_content"))
    return manga_data


if __name__ == "__main__":
    """debug用"""
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
