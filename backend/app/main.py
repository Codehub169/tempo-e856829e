from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

# Import for database table creation
from .database import create_tables # Corrected: import create_tables
from . import models # Ensure models are imported so Base knows about them

# Import routers
from .routers import posts, users # Corrected: Uncommented and imported

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
FRONTEND_BUILD_DIR = PROJECT_ROOT / "frontend" / "build"
STATIC_ASSETS_DIR = FRONTEND_BUILD_DIR / "static" # Common for React builds

app = FastAPI(
    title="Simple Blog API",
    description="API for a simple blog platform.",
    version="0.1.0"
)

# CORS (Cross-Origin Resource Sharing) Middleware
origins = [
    "http://localhost:3000",
    "http://localhost:9000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def on_startup():
    """Perform actions on application startup."""
    print("Application starting up...")
    # Initialize database and create tables if they don't exist
    print("Creating database tables...")
    create_tables() # Corrected: Call create_tables to set up DB schema
    print("Database tables created (if they didn't exist).")

# Include API routers
app.include_router(users.router, prefix="/api/v1", tags=["users"]) # Corrected: Uncommented
app.include_router(posts.router, prefix="/api/v1", tags=["posts"]) # Corrected: Uncommented

@app.get("/api/healthcheck", tags=["Health"])
async def healthcheck():
    """Basic health check endpoint."""
    return {"status": "ok", "message": "API is running"}

if STATIC_ASSETS_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_ASSETS_DIR), name="frontend_static_assets")
else:
    print(f"Warning: Frontend static assets directory not found: {STATIC_ASSETS_DIR}")
    print("Ensure the frontend has been built and assets are in frontend/build/static/")

if FRONTEND_BUILD_DIR.exists():
    # Mount files from the root of the build directory (e.g., manifest.json, favicon.ico)
    # This needs to be more specific if there are conflicts, or serve them individually.
    # For broad serving, ensure it doesn't conflict with other routes (like /static or /api)
    # A common approach is to serve specific known files or use a prefix like /root-assets.
    # The current "/assets" name is fine if it's not a real directory in your frontend build root that needs special handling.
    # If 'assets' is a real folder in 'frontend/build', then this is correct.
    # If it's meant to serve individual files like 'favicon.ico' directly from 'frontend/build', that needs specific routes or careful StaticFiles usage.
    # Let's assume 'assets' is not a conflicting name and is intended for general files in build root.
    app.mount("/assets", StaticFiles(directory=FRONTEND_BUILD_DIR), name="frontend_root_assets")

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_react_app(request: Request, full_path: str):
    index_html_path = FRONTEND_BUILD_DIR / "index.html"
    default_index_html_path = PROJECT_ROOT / "backend" / "app" / "default_index.html"

    # If an API path that wasn't matched by any router reaches here, it's a 404.
    # This prevents serving index.html for /api/* typos or non-existent endpoints.
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail=f"API endpoint '/{full_path}' not found.")

    # If the actual frontend index.html doesn't exist, serve the default/fallback.
    if not index_html_path.exists():
        if default_index_html_path.exists():
            return FileResponse(default_index_html_path, media_type="text/html")
        else:
            # This case should be rare if the startup file creation logic works.
            raise HTTPException(status_code=500, detail="Frontend not built and default fallback page is missing.")

    # For any other path not caught by API routers or specific StaticFiles mounts,
    # serve the main SPA index.html file.
    return FileResponse(index_html_path, media_type="text/html")

# This logic ensures default_index.html is created if the main one is missing.
# It runs once when the Python module is loaded.
if not (FRONTEND_BUILD_DIR / "index.html").exists():
    default_html_content = """
    <!DOCTYPE html>
    <html lang=\"en\">
    <head><meta charset=\"UTF-8\"><title>App Loading...</title></head>
    <body><h1>Simple Blog Application</h1><p>Frontend not found. Please build the frontend application.</p></body>
    </html>
    """
    # Ensure backend/app directory exists before writing this fallback file
    (PROJECT_ROOT / "backend" / "app").mkdir(parents=True, exist_ok=True)
    with open(PROJECT_ROOT / "backend" / "app" / "default_index.html", "w") as f:
        f.write(default_html_content)
