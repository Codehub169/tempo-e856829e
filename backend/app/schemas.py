from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8) # For password updates
    is_active: Optional[bool] = None

class UserInDBBase(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Schema for returning a user from API (e.g., /users/me)
class User(UserInDBBase):
    pass

# Minimal user info, e.g., for embedding in Post schema
class UserMinimal(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

# --- Post Schemas ---
class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)

class PostInDBBase(PostBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    owner: UserMinimal # Embed minimal owner info

    class Config:
        from_attributes = True

# Schema for returning a post from API
class Post(PostInDBBase):
    pass

# Schema for returning a list of posts (can be same as Post or simplified if needed)
class PostList(Post):
    pass 

# --- Token Schemas (for Authentication) ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None # 'sub' is standard for subject (username or user_id)
    # Add any other claims you want in the token payload
