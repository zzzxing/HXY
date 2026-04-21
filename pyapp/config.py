from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "黄小游——AI研学智能体"
    database_url: str = "sqlite:///./huangxiaoyou.db"
    upload_dir: str = "./uploads"
    secret_key: str = "dev-secret"

    deepseek_base_url: str = "https://api.deepseek.com/v1"
    deepseek_api_key: str = ""
    deepseek_model: str = "deepseek-chat"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="",
        extra="ignore",
    )


settings = Settings()
