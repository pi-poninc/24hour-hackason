import random
import requests
import json


def post_stable_diffusion(prompt: str, path="sdapi/v1/txt2img") -> str:
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
        "seed": random.randint(0, 10000),
        "width": 512,
        "height": 512,
    }
    response = requests.post(url, headers=headers, json=data)
    content = response.json()
    return content["images"][0]
