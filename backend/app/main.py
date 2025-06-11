from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

# Placeholder for database initialization function
# from .database import init_db, engine # This will be created in a later step
# from .models import SQLModel # Base for models, will be in models.py

# Placeholder for routers
# from .routers import posts, users # These will be created in a later step

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
FRONTEND_BUILD_DIR = PROJECT_ROOT / "frontend" / "build"
STATIC_ASSETS_DIR = FRONTEND_BUILD_DIR / "static" # Common for React builds

app = FastAPI(
    title="Simple Blog API",
    description="API for a simple blog platform.",
    version="0.1.0"
)

# CORS (Cross-Origin Resource Sharing) Middleware
# Allows requests from your frontend (e.g., React app running on a different port during development)
origins = [
    "http://localhost:3000",  # Common port for React dev server
    "http://localhost:9000",  # Port where this app is served
    # Add other origins as needed (e.g., production frontend URL)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # or ["*"] for allowing all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"] # Allows all methods (GET, POST, etc.)
    allow_headers=["*"] # Allows all headers
)

@app.on_event("startup")
async def on_startup():
    """Perform actions on application startup."""
    print("Application starting up...")
    # Initialize database and create tables if they don't exist
    # This function will be defined in database.py
    # init_db()
    # SQLModel.metadata.create_all(bind=engine) # This will be handled by init_db or Alembic
    print("Database initialization (placeholder - to be implemented in database.py).")

# Include API routers (to be implemented later)
# app.include_router(users.router, prefix="/api/v1", tags=["users"])
# app.include_router(posts.router, prefix="/api/v1", tags=["posts"])

@app.get("/api/healthcheck", tags=["Health"])
async def healthcheck():
    """Basic health check endpoint."""
    return {"status": "ok", "message": "API is running"}

# Mount static files for React frontend assets (CSS, JS, images, etc.)
# These are typically found in a 'static' subfolder of the build directory.
if STATIC_ASSETS_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_ASSETS_DIR), name="frontend_static_assets")
else:
    print(f"Warning: Frontend static assets directory not found: {STATIC_ASSETS_DIR}")
    print("Ensure the frontend has been built and assets are in frontend/build/static/")

# Serve other static files from the root of the build directory (e.g., manifest.json, favicon.ico)
if FRONTEND_BUILD_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_BUILD_DIR), name="frontend_root_assets")

# Catch-all route to serve the React app's index.html for client-side routing
# This should be one of the last routes defined.
@app.get("/{full_path:path}", include_in_schema=False) # exclude from OpenAPI docs
async def serve_react_app(request: Request, full_path: str):
    index_html_path = FRONTEND_BUILD_DIR / "index.html"
    if not index_html_path.exists():
        return FileResponse(PROJECT_ROOT / "backend" / "app" / "default_index.html", media_type="text/html")

    # Check if the path looks like a file extension or an API call already handled
    # Simple check, might need refinement
    if Path(full_path).suffix or full_path.startswith("api/") or full_path.startswith("static/") or full_path.startswith("assets/"):
        # Let StaticFiles or API routers handle it, or it's a 404
        # This part might need to be smarter, or rely on FastAPI's default 404 for actual missing files
        # For now, if it's not explicitly an SPA route, let FastAPI handle it (might 404)
        # A more robust way is to ensure API routes are tried first, then static files, then SPA fallback.
        # The current setup with specific mounts for /static and /assets, and this catch-all, should work.
        pass # Let FastAPI continue to find a route or 404

    return FileResponse(index_html_path, media_type="text/html")

# Create a dummy default_index.html for graceful handling if frontend isn't built yet.
# This is a fallback and should ideally not be seen if startup.sh builds the frontend.
if not (FRONTEND_BUILD_DIR / "index.html").exists():
    default_html_content = """
    <!DOCTYPE html>
    <html lang=\"en\">
    <head><meta charset=\"UTF-8\"><title>App Loading...</title></head>
    <body><h1>Simple Blog Application</h1><p>Frontend not found. Please build the frontend application.</p></body>
    </html>
    """
    with open(PROJECT_ROOT / "backend" / "app" / "default_index.html", "w") as f:
        f.write(default_html_content)
