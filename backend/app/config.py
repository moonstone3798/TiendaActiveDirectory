from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    LDAP_SERVER: str = "ldap://localhost:389"
    LDAP_DOMAIN: str = "localdomain"
    LDAP_NETBIOS_DOMAIN: str = "LOCALDOMAIN"
    LDAP_BASE_DN: str = "dc=local,dc=domain"
    LDAP_SEARCH_BASE: str = "dc=local,dc=domain"

    SECRET_KEY: str = "dev-secret-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"


settings = Settings()