import aiohttp
import requests


async def post_stable_diffusion(prompt: str, session: aiohttp.ClientSession, path="sdapi/v1/txt2img") -> str:
    url = f"http://localhost:7860/{path}"
    headers = {"Content-Type": "application/json"}
    data = {
        "prompt": prompt,
        "scheduler": "Simple",
        "steps": 25,
        "batch_size": 1,
        "cfg_scale": 1,
        "sampler_name": "Euler",
        "scheduler": "Simple",
        "seed": 42,
        "width": 512,
        "height": 512,
    }
    async with session.post(url, headers=headers, data=data) as res:
        content = await res.json()
        return content["images"][0]
