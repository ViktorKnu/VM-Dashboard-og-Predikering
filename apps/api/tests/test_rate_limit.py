from fastapi import HTTPException

from app.services.rate_limit import InMemoryRateLimiter


def test_rate_limiter_blocks_after_limit():
    now = 1000.0
    limiter = InMemoryRateLimiter(clock=lambda: now)

    limiter.check("predictions:127.0.0.1", limit=2, window_seconds=60)
    limiter.check("predictions:127.0.0.1", limit=2, window_seconds=60)

    try:
        limiter.check("predictions:127.0.0.1", limit=2, window_seconds=60)
    except HTTPException as error:
        assert error.status_code == 429
        assert error.headers["Retry-After"] == "60"
    else:
        raise AssertionError("Expected rate limit to block the third request")


def test_rate_limiter_allows_after_window_moves():
    now = 1000.0
    limiter = InMemoryRateLimiter(clock=lambda: now)

    limiter.check("simulation:127.0.0.1", limit=1, window_seconds=60)
    now = 1061.0
    limiter.check("simulation:127.0.0.1", limit=1, window_seconds=60)
