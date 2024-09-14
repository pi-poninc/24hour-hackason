from functools import lru_cache


@lru_cache
def read_text(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()
