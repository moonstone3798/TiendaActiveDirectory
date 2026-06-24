from pathlib import Path

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import create_all_tables
from .routers import product, movement, auth
from .dependencies import get_current_user

app = FastAPI(lifespan=create_all_tables)
assets_img_dir = Path(__file__).resolve().parents[2] / "frontend" / "src" / "assets" / "img"
assets_img_dir.mkdir(parents=True, exist_ok=True)

app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"http://localhost:5173",
		"http://127.0.0.1:5173",
	],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.mount("/assets/img", StaticFiles(directory=str(assets_img_dir)), name="assets-img")

app.include_router(product.router, dependencies=[Depends(get_current_user)] )
app.include_router(movement.router, dependencies=[Depends(get_current_user)] )
app.include_router(auth.router)

