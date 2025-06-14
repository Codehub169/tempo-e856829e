from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Annotated

from .. import crud, schemas, auth, models
from ..database import get_db

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
)

@router.post("", response_model=schemas.Post, status_code=status.HTTP_201_CREATED)
def create_post_endpoint(
    post_in: schemas.PostCreate,
    current_user: Annotated[models.User, Depends(auth.get_current_active_user)],
    db: Session = Depends(get_db)
):
    """
    Create a new blog post.
    Requires authentication. The authenticated user will be the owner of the post.
    - **title**: The title of the post.
    - **content**: The main content of the post.
    """
    return crud.create_post(db=db, post=post_in, owner_id=current_user.id)

@router.get("", response_model=List[schemas.PostList])
def read_posts_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100), # Default to 20, max 100 posts per page
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of blog posts.
    Publicly accessible. Posts are paginated and ordered by creation date (newest first).
    """
    posts = crud.get_posts(db, skip=skip, limit=limit)
    return posts

@router.get("/{post_id}", response_model=schemas.Post)
def read_post_endpoint(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a single blog post by its ID.
    Publicly accessible.
    """
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return db_post

@router.put("/{post_id}", response_model=schemas.Post)
def update_post_endpoint(
    post_id: int,
    post_in: schemas.PostUpdate,
    current_user: Annotated[models.User, Depends(auth.get_current_active_user)],
    db: Session = Depends(get_db)
):
    """
    Update an existing blog post.
    Requires authentication. Only the owner of the post can update it.
    """
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if db_post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this post")
    return crud.update_post(db=db, db_post=db_post, post_in=post_in)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post_endpoint(
    post_id: int,
    current_user: Annotated[models.User, Depends(auth.get_current_active_user)],
    db: Session = Depends(get_db)
):
    """
    Delete a blog post.
    Requires authentication. Only the owner of the post can delete it.
    Returns 204 No Content on successful deletion.
    """
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if db_post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this post")
    crud.delete_post(db=db, db_post=db_post) 
    return # FastAPI handles 204 response automatically

@router.get("/user/{user_id}", response_model=List[schemas.PostList])
def read_posts_by_user_endpoint(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Retrieve posts by a specific user ID.
    Publicly accessible. Useful for viewing a specific author's posts.
    """
    user = crud.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    posts = crud.get_posts_by_user(db, owner_id=user_id, skip=skip, limit=limit)
    return posts
