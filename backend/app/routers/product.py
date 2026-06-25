from pathlib import Path
from uuid import uuid4

from models import Product, ProductCreate, ProductUpdate
from db import SessionDep
from fastapi import APIRouter, status, HTTPException, UploadFile, File
from sqlmodel import select

router = APIRouter(prefix="/products", tags=["products"])
IMG_DIR = Path(__file__).resolve().parents[3] / "frontend" / "src" / "assets" / "img"
IMG_DIR.mkdir(parents=True, exist_ok=True)


@router.post('/upload-image/')
async def upload_product_image(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo debe ser una imagen",
        )

    original_name = image.filename or "image"
    extension = Path(original_name).suffix.lower() or ".png"
    stem = "".join(ch for ch in Path(original_name).stem if ch.isalnum() or ch in ("-", "_"))
    stem = stem or "image"

    filename = f"{stem}{extension}"
    destination = IMG_DIR / filename
    if destination.exists():
        filename = f"{stem}-{uuid4().hex[:8]}{extension}"
        destination = IMG_DIR / filename

    content = await image.read()
    destination.write_bytes(content)

    return {"filename": filename}

@router.post('/', response_model= Product, status_code=status.HTTP_201_CREATED)
async def create_product(product_data: ProductCreate, session: SessionDep):
    product= Product.model_validate(product_data.model_dump())
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.get('/', response_model=list[Product])
async def list_product(session: SessionDep):
    return session.exec(select(Product)).all()


@router.patch("/{product_id}", response_model=Product, status_code=status.HTTP_201_CREATED)
async def edit_product(product_id: int, product_data: ProductUpdate , session: SessionDep):
    product_db = session.get(Product, product_id)
    if not product_db: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="El producto no existe"
        )
    product_data_dict = product_data.model_dump(exclude_unset=True)
    product_db.sqlmodel_update(product_data_dict)
    session.add(product_db)
    session.commit()
    session.refresh(product_db)
    return product_db


@router.delete("/{product_id}")
async def delete_product(product_id: int, session: SessionDep):
    product_db = session.get(Product, product_id)
    if not product_db: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="El producto no existe"
        )
    session.delete(product_db)
    session.commit()
    return {"status": 200}

