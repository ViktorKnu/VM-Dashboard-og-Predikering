from urllib.parse import urlparse

OFFICIAL_NORWEGIAN_BROADCASTERS = {
    "NRK",
    "NRK TV",
    "TV 2",
    "TV 2 Play",
    "TV 2 Direkte",
    "TV 2 Sport 1",
}


def is_official_broadcast_link(url: str | None, allowed_hosts: set[str]) -> bool:
    if not url:
        return True
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    return parsed.scheme == "https" and any(host == allowed or host.endswith(f".{allowed}") for allowed in allowed_hosts)

