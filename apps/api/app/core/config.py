import os
from functools import lru_cache

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:  # Lets pure prediction tests run before optional API deps are installed.
    BaseSettings = object  # type: ignore[assignment]
    SettingsConfigDict = None  # type: ignore[assignment]


class Settings(BaseSettings):  # type: ignore[misc, valid-type]
    app_name: str = "World Cup Insights"
    database_url: str = "sqlite:///./world_cup_insights.sqlite3"
    redis_url: str = "redis://localhost:6379/0"
    model_version: str = "wc-v0.2-norway"
    live_data_provider: str = "seeded"
    live_poll_interval_seconds: int = 30
    allowed_broadcaster_hosts: str = "nrk.no,tv.nrk.no,tv2.no,play.tv2.no"

    if SettingsConfigDict:
        model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def __init__(self, **values):
        if BaseSettings is object:
            for key, default in {
                "app_name": self.app_name,
                "database_url": self.database_url,
                "redis_url": self.redis_url,
                "model_version": self.model_version,
                "live_data_provider": self.live_data_provider,
                "live_poll_interval_seconds": self.live_poll_interval_seconds,
                "allowed_broadcaster_hosts": self.allowed_broadcaster_hosts,
            }.items():
                setattr(self, key, values.get(key, os.getenv(key.upper(), default)))
        else:
            super().__init__(**values)

    @property
    def broadcaster_hosts(self) -> set[str]:
        return {host.strip().lower() for host in self.allowed_broadcaster_hosts.split(",") if host}


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
