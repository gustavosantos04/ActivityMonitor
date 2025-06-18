from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas import UserCreate, UserOut
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/users/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email já registrado")
    if db.query(User).filter(User.cpf == user.cpf).first():
        raise HTTPException(status_code=400, detail="CPF já registrado")

    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        full_name=user.full_name,
        cpf=user.cpf,
        email=user.email,
        hashed_password=hashed_password,
        team=user.team,
        is_active=True,
        is_superuser=user.is_superuser  # <- definido via input
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
