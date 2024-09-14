import ast
from enum import Enum

from anthropic import AsyncAnthropic

from conf import Config

config = Config()


# モデルの定義
class ClaudeModel(str, Enum):
    SONNET = "claude-3-sonnet-20240229"
    OPUS = "claude-3-opus-20240229"
    HAIKU = "claude-3-haiku-20240307"


client = AsyncAnthropic(api_key=config.claude.api_key)


async def post_claude(content: str, model: ClaudeModel = ClaudeModel.SONNET) -> str:
    res = await client.messages.create(
        model=model,
        max_tokens=4000,
        temperature=0.7,
        messages=[{"role": "user", "content": content}],
    )
    return res.content[0].text
