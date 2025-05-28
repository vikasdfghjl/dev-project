# Settings schemas
from pydantic import BaseModel, field_validator

class SettingsBase(BaseModel):
    auto_cleanup_enabled: bool = True
    auto_cleanup_days: int = 28
    refresh_interval_minutes: int = 60

class SettingsCreate(SettingsBase):
    pass

class SettingsUpdate(BaseModel):
    auto_cleanup_enabled: bool | None = None
    auto_cleanup_days: int | None = None
    refresh_interval_minutes: int | None = None
    
    @field_validator('auto_cleanup_days')
    @classmethod
    def validate_cleanup_days(cls, v):
        if v is not None and v not in [7, 14, 28]:
            raise ValueError('auto_cleanup_days must be 7, 14, or 28')
        return v
    
    @field_validator('refresh_interval_minutes')
    @classmethod
    def validate_refresh_interval(cls, v):
        if v is not None and v not in [5, 10, 15, 30, 60]:
            raise ValueError('refresh_interval_minutes must be 5, 10, 15, 30, or 60')
        return v

class Settings(SettingsBase):
    id: int
    
    class Config:
        from_attributes = True
