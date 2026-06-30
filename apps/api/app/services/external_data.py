from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen

from app.core.config import settings


@dataclass(frozen=True)
class ExternalSource:
    key: str
    label: str
    purpose: str
    url: str
    requires_key: bool = False


def configured_sources() -> list[ExternalSource]:
    return [
        ExternalSource(
            "fifa_schedule",
            "OpenFootball World Cup 2026 (CC0)",
            "Komplett terminliste og daglig oppdaterte resultater",
            settings.fifa_schedule_url,
        ),
        ExternalSource(
            "world_football_elo",
            "World Football Elo Ratings",
            "Lagstyrke og historisk rating",
            settings.world_football_elo_url,
        ),
        ExternalSource(
            "fifa_rankings",
            "FIFA-rangeringer",
            "Rangering og rankingpoeng",
            settings.fifa_rankings_url,
        ),
        ExternalSource(
            "api_football_live",
            "API-Football/liveleverandør",
            "Livehendelser, statistikk og lagoppstillinger",
            settings.api_football_base_url,
            requires_key=True,
        ),
        ExternalSource(
            "world_bank",
            "World Bank",
            "BNP per innbygger og befolkning",
            settings.world_bank_base_url,
        ),
    ]


def cache_root() -> Path:
    root = Path(settings.external_data_cache_dir)
    if not root.is_absolute():
        root = Path(__file__).resolve().parents[4] / root
    root.mkdir(parents=True, exist_ok=True)
    return root


def safe_name(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_.-]+", "_", value).strip("_")


def source_cache_path(source_key: str) -> Path:
    source_dir = cache_root() / safe_name(source_key)
    source_dir.mkdir(parents=True, exist_ok=True)
    return source_dir / "latest.json"


def source_meta_path(source_key: str) -> Path:
    return source_cache_path(source_key).with_suffix(".meta.json")


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def cache_age_seconds(path: Path) -> float | None:
    if not path.exists():
        return None
    modified = datetime.fromtimestamp(path.stat().st_mtime, timezone.utc)
    return (utc_now() - modified).total_seconds()


def read_cached_payload(source_key: str) -> dict[str, Any] | None:
    path = source_cache_path(source_key)
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def write_cache(source_key: str, payload: Any, source_url: str) -> None:
    path = source_cache_path(source_key)
    meta_path = source_meta_path(source_key)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    meta_path.write_text(
        json.dumps(
            {
                "source_key": source_key,
                "source_url": source_url,
                "fetched_at": utc_now().isoformat(),
                "cache_ttl_seconds": settings.external_data_cache_ttl_seconds,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def fetch_json(source: ExternalSource, force: bool = False) -> dict[str, Any]:
    cache_path = source_cache_path(source.key)
    age = cache_age_seconds(cache_path)
    cache_is_fresh = age is not None and age <= settings.external_data_cache_ttl_seconds

    if not source.url:
        return {
            "source": source.key,
            "status": "not_configured",
            "message": "Sett provider-URL i miljøvariabler for å hente ekte data.",
            "cached": read_cached_payload(source.key) is not None,
            "cache_path": str(cache_path),
        }

    if source.requires_key and not settings.api_football_key:
        return {
            "source": source.key,
            "status": "missing_api_key",
            "message": "API-nøkkel mangler. Sett API_FOOTBALL_KEY i miljøvariabler.",
            "cached": read_cached_payload(source.key) is not None,
            "cache_path": str(cache_path),
        }

    if cache_is_fresh and not force:
        return {
            "source": source.key,
            "status": "cached",
            "cached": True,
            "cache_age_seconds": round(age or 0),
            "cache_path": str(cache_path),
            "payload": read_cached_payload(source.key),
        }

    headers = {"Accept": "application/json", "User-Agent": f"{settings.app_name}/0.2"}
    if source.requires_key and settings.api_football_key:
        headers["x-apisports-key"] = settings.api_football_key

    request = Request(source.url, headers=headers)
    try:
        with urlopen(request, timeout=settings.external_request_timeout_seconds) as response:
            payload = json.loads(response.read().decode("utf-8"))
            write_cache(source.key, payload, source.url)
            return {
                "source": source.key,
                "status": "fetched",
                "cached": False,
                "cache_path": str(cache_path),
                "payload": payload,
            }
    except (OSError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        cached = read_cached_payload(source.key)
        return {
            "source": source.key,
            "status": "error_using_cache" if cached is not None else "error",
            "message": str(exc),
            "cached": cached is not None,
            "cache_path": str(cache_path),
            "payload": cached,
        }


def source_statuses() -> list[dict[str, Any]]:
    statuses = []
    for source in configured_sources():
        path = source_cache_path(source.key)
        age = cache_age_seconds(path)
        statuses.append(
            {
                "key": source.key,
                "label": source.label,
                "purpose": source.purpose,
                "configured": bool(source.url),
                "requires_key": source.requires_key,
                "has_key": bool(settings.api_football_key) if source.requires_key else True,
                "cached": path.exists(),
                "cache_age_seconds": round(age) if age is not None else None,
                "cache_path": str(path),
            }
        )
    return statuses
