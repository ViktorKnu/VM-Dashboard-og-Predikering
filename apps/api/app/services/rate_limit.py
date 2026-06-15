from __future__ import annotations

import time
from collections import defaultdict, deque
from collections.abc import Callable

from fastapi import HTTPException, Request, status


class InMemoryRateLimiter:
    def __init__(self, clock: Callable[[], float] | None = None) -> None:
        self.clock = clock or time.monotonic
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str, limit: int, window_seconds: int) -> None:
        now = self.clock()
        hits = self._hits[key]
        cutoff = now - window_seconds

        while hits and hits[0] <= cutoff:
            hits.popleft()

        if len(hits) >= limit:
            retry_after = max(1, int(window_seconds - (now - hits[0])))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="For mange forespørsler. Prøv igjen litt senere.",
                headers={"Retry-After": str(retry_after)},
            )

        hits.append(now)

    def reset(self) -> None:
        self._hits.clear()


limiter = InMemoryRateLimiter()


def client_identifier(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", maxsplit=1)[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


def enforce_rate_limit(request: Request, scope: str, limit: int, window_seconds: int) -> None:
    limiter.check(f"{scope}:{client_identifier(request)}", limit, window_seconds)
