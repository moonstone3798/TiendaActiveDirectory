from models import Movement, MovementCreate, MovementListItem, Product
from db import SessionDep
from fastapi import APIRouter, status, HTTPException, Depends
from sqlmodel import select
from sqlalchemy import func
from ..dependencies import get_current_user

router = APIRouter(prefix="/movements", tags=["movements"])


def _movement_delta(movement: Movement) -> int:
    return movement.quantity if movement.type else -movement.quantity


def _recalculate_stock_totals_after_change(
    session: SessionDep,
    product_id: int,
    current_stock: int,
    exclude_movement_id: int | None = None,
):
    statement = (
        select(Movement)
        .where(Movement.product_id == product_id)
        .order_by(Movement.date.desc(), Movement.id.desc())
    )
    if exclude_movement_id is not None:
        statement = statement.where(Movement.id != exclude_movement_id)

    movements = session.exec(statement).all()
    running_stock = current_stock
    for movement in movements:
        movement.stock_total = running_stock
        running_stock -= _movement_delta(movement)
        session.add(movement)

@router.post('/', response_model= Movement, status_code=status.HTTP_201_CREATED)
async def create_movement(
    movement_data: MovementCreate,
    session: SessionDep,
    current_user: dict = Depends(get_current_user),
):
    movement_data_dict = movement_data.model_dump(exclude_none=True)
    product = session.get(Product, movement_data_dict["product_id"])
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="El producto no existe"
        )

    current_stock = product.stock or 0
    delta = movement_data_dict["quantity"] if movement_data_dict["type"] else -movement_data_dict["quantity"]
    next_stock = current_stock + delta
    if next_stock < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock insuficiente para registrar el egreso",
        )

    product.stock = next_stock
    print('current_user:', current_user)
    movement_data_dict["employee"] = current_user["sub"]
    movement_data_dict["stock_total"] = next_stock

    movement_db = Movement.model_validate(movement_data_dict)
    session.add(movement_db)
    session.add(product)
    session.commit()
    session.refresh(movement_db)
    return movement_db

@router.get('/', response_model=list[MovementListItem])
async def list_movement(session: SessionDep):
    statement = (
        select(Movement, Product.title)
        .join(Product, Movement.product_id == Product.id)
    )
    rows = session.exec(statement).all()
    return [
        MovementListItem(
            id=movement.id,
            employee=movement.employee,
            quantity=movement.quantity,
            date=movement.date,
            type=movement.type,
            stock_total=movement.stock_total,
            product_id=movement.product_id,
            product=product_title,
        )
        for movement, product_title in rows
    ]


@router.get('/top-egress')
async def get_products_with_more_egress( session: SessionDep):
    query = (
        select(
            Product.id,
            Product.title,
            func.sum(Movement.quantity).label("total_egress"),
        )
        .join(Movement, Movement.product_id == Product.id)
        .where(Movement.type == False)
        .group_by(Product.id, Product.title)
        .order_by(func.sum(Movement.quantity).desc())
    ).limit(10)
    results = session.exec(query).all()
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay egresos registrados",
        )
    return [
        {
            "product_id": product_id,
            "title": title,
            "total_egress": total_egress,
        }
        for product_id, title, total_egress in results
    ]


@router.get('/less-egress')
async def get_products_with_less_egress( session: SessionDep):
    query = (
        select(
            Product.id,
            Product.title,
            func.sum(Movement.quantity).label("total_egress"),
        )
        .join(Movement, Movement.product_id == Product.id)
        .where(Movement.type == False)
        .group_by(Product.id, Product.title)
        .order_by(func.sum(Movement.quantity).asc())
    ).limit(10)
    results = session.exec(query).all()
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay egresos registrados",
        )
    return [
        {
            "product_id": product_id,
            "title": title,
            "total_egress": total_egress,
        }
        for product_id, title, total_egress in results
    ]


@router.get('/less-egress-and-more-expensive')
async def get_products_with_less_egress_and_more_expensive(session: SessionDep):
    total_egress = func.sum(Movement.quantity)
    score = Product.price / total_egress
    query = (
        select(
            Product.id,
            Product.title,
            Product.price,
            total_egress.label("total_egress"),
            score.label("priority_score"),
        )
        .join(Movement, Movement.product_id == Product.id)
        .where(Movement.type == False)
        .group_by(Product.id, Product.title, Product.price)
        .having(total_egress > 0)
        .order_by(score.desc())
        .limit(10)
    )
    results = session.exec(query).all()
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay egresos registrados",
        )
    return [
        {
            "product_id": product_id,
            "title": title,
            "price": price,
            "total_egress": product_total_egress,
            "priority_score": round(priority_score, 4),
        }
        for product_id, title, price, product_total_egress, priority_score in results
    ]
    

@router.patch("/{movement_id}", response_model=Movement, status_code=status.HTTP_201_CREATED)
async def edit_movement(
    movement_id: int,
    movement_data: MovementCreate,
    session: SessionDep,
    current_user: dict = Depends(get_current_user),
):
    movement_db = session.get(Movement, movement_id)
    if not movement_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="El movimiento no existe"
        )

    movement_data_dict = movement_data.model_dump(exclude_none=True)
    old_product = session.get(Product, movement_db.product_id)
    new_product = session.get(Product, movement_data_dict["product_id"])

    if not old_product or not new_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El producto asociado al movimiento no existe",
        )

    old_delta = movement_db.quantity if movement_db.type else -movement_db.quantity
    reverted_old_stock = (old_product.stock or 0) - old_delta
    if reverted_old_stock < 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Inconsistencia de stock al editar el movimiento",
        )

    new_delta = movement_data_dict["quantity"] if movement_data_dict["type"] else -movement_data_dict["quantity"]

    if old_product.id == new_product.id:
        candidate_stock = reverted_old_stock + new_delta
        if candidate_stock < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Stock insuficiente para aplicar la edicion del movimiento",
            )
        old_product.stock = candidate_stock
        resulting_stock = candidate_stock
        session.add(old_product)
    else:
        next_old_stock = reverted_old_stock
        next_new_stock = (new_product.stock or 0) + new_delta
        if next_old_stock < 0 or next_new_stock < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Stock insuficiente para mover o editar el movimiento",
            )
        old_product.stock = next_old_stock
        new_product.stock = next_new_stock
        resulting_stock = next_new_stock
        session.add(old_product)
        session.add(new_product)

    movement_data_dict["employee"] = current_user["sub"]
    movement_data_dict["stock_total"] = resulting_stock
    movement_db.sqlmodel_update(movement_data_dict)

    session.add(movement_db)
    session.commit()
    session.refresh(movement_db)
    return movement_db



@router.delete("/{movement_id}")
async def delete_movement(movement_id: int, session: SessionDep):
    movement_db = session.get(Movement, movement_id)
    if not movement_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="El movimiento no existe"
        )

    product = session.get(Product, movement_db.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El producto asociado al movimiento no existe",
        )

    delta = movement_db.quantity if movement_db.type else -movement_db.quantity
    next_stock = (product.stock or 0) - delta
    if next_stock < 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Inconsistencia de stock al eliminar el movimiento",
        )

    product.stock = next_stock
    session.add(product)
    session.delete(movement_db)
    _recalculate_stock_totals_after_change(
        session=session,
        product_id=product.id,
        current_stock=next_stock,
        exclude_movement_id=movement_id,
    )
    session.commit()
    return {"status": 200}