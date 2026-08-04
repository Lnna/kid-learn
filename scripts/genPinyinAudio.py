"""Generate 声母/韵母 first-tone 呼读 mp3 via edge-tts (zh-CN neural)."""
from __future__ import annotations

import asyncio
import os
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "audio" / "pinyin"
VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-25%"

# 声母 → 传统呼读拼音（带正确声调；不用汉字，避免 德=dé、特=tè）
INITIALS: dict[str, str] = {
    "b": "bō",
    "p": "pō",
    "m": "mō",
    "f": "fó",
    "d": "dē",
    "t": "tē",
    "n": "nè",
    "l": "lè",
    "g": "gē",
    "k": "kē",
    "h": "hē",
    "j": "jī",
    "q": "qī",
    "x": "xī",
    "zh": "zhī",
    "ch": "chī",
    "sh": "shī",
    "r": "rì",
    "z": "zī",
    "c": "cī",
    "s": "sī",
    "y": "yī",
    "w": "wū",
}

# 单韵母：用一声汉字生成（这些字本身就是一声，不同于德/特）
FINALS: dict[str, str] = {
    "a": "阿",
    "o": "喔",
    "e": "婀",
    "i": "衣",
    "u": "乌",
    "v": "淤",
}


async def synth(text: str, path: Path) -> None:
    await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(path))


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    only = os.environ.get("ONLY", "").strip()
    items = {**INITIALS, **FINALS}
    if only:
        keys = {k.strip() for k in only.split(",") if k.strip()}
        items = {k: v for k, v in items.items() if k in keys}
    for key, text in items.items():
        path = OUT / f"{key}.mp3"
        try:
            await synth(text, path)
            size = path.stat().st_size
            if size < 500:
                raise RuntimeError(f"audio too small: {size}")
            print(f"{key} <- {text} ({size} bytes)")
        except Exception as exc:  # noqa: BLE001
            print(f"{key} FAIL {text}: {exc}")
            if path.exists() and path.stat().st_size < 500:
                path.unlink(missing_ok=True)


if __name__ == "__main__":
    asyncio.run(main())
