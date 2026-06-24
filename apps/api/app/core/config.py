import os
from functools import lru_cache

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:  # Lets pure prediction tests run before optional API deps are installed.
    BaseSettings = object  # type: ignore[assignment]
    SettingsConfigDict = None  # type: ignore[assignment]


class Settings(BaseSettings):  # type: ignore[misc, valid-type]
    app_name: str = "VM Dashboard og Predikering"
    database_url: str = "sqlite:///./world_cup_insights.sqlite3"
    redis_url: str = "redis://localhost:6379/0"
    model_version: str = "wc-v0.2-country-features"
    live_data_provider: str = "seeded"
    live_poll_interval_seconds: int = 30
    allowed_broadcaster_hosts: str = "nrk.no,tv.nrk.no,tv2.no,play.tv2.no"
    allowed_origins: str = (
        "http://localhost:3000,http://127.0.0.1:3000,"
        "https://vm-dashboard-og-predikering.vercel.app"
    )
    rate_limit_window_seconds: int = 60
    prediction_rate_limit: int = 20
    simulation_rate_limit: int = 12
    external_data_cache_dir: str = "data/raw"
    external_data_cache_ttl_seconds: int = 300
    external_request_timeout_seconds: int = 15
    fifa_schedule_url: str = ""
    world_football_elo_url: str = ""
    fifa_rankings_url: str = ""
    world_bank_base_url: str = "https://api.worldbank.org/v2"
    api_football_base_url: str = ""
    api_football_key: str = ""

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
                "allowed_origins": self.allowed_origins,
                "rate_limit_window_seconds": self.rate_limit_window_seconds,
                "prediction_rate_limit": self.prediction_rate_limit,
                "simulation_rate_limit": self.simulation_rate_limit,
                "external_data_cache_dir": self.external_data_cache_dir,
                "external_data_cache_ttl_seconds": self.external_data_cache_ttl_seconds,
                "external_request_timeout_seconds": self.external_request_timeout_seconds,
                "fifa_schedule_url": self.fifa_schedule_url,
                "world_football_elo_url": self.world_football_elo_url,
                "fifa_rankings_url": self.fifa_rankings_url,
                "world_bank_base_url": self.world_bank_base_url,
                "api_football_base_url": self.api_football_base_url,
                "api_football_key": self.api_football_key,
            }.items():
                setattr(self, key, values.get(key, os.getenv(key.upper(), default)))
        else:
            super().__init__(**values)

    @property
    def broadcaster_hosts(self) -> set[str]:
        return {host.strip().lower() for host in self.allowed_broadcaster_hosts.split(",") if host}

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def sqlalchemy_database_url(self) -> str:
        if self.database_url.startswith("postgres://"):
            return self.database_url.replace("postgres://", "postgresql+psycopg://", 1)
        if self.database_url.startswith("postgresql://"):
            return self.database_url.replace("postgresql://", "postgresql+psycopg://", 1)
        return self.database_url


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
