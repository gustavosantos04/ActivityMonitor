from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas import UserCreate, UserOut
from app.database import User
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm
from app.auth.auth import create_access_token
from app.auth.security import get_current_user  # <-- importante
from app.schemas import UserUpdate  # vamos criar isso também

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

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Olá, {current_user.full_name}. Você está autenticado!"}

@router.get("/users/", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Apenas superuser pode listar todos os usuários, por segurança
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Acesso negado")

    users = db.query(User).all()
    return users

@router.put("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    updated_user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Apenas superuser pode editar usuários
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Apenas superusuários podem editar usuários")

    if updated_user.full_name:
        user.full_name = updated_user.full_name
    if updated_user.email:
        existing = db.query(User).filter(User.email == updated_user.email, User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email já em uso")
        user.email = updated_user.email
    if updated_user.password:
        user.hashed_password = pwd_context.hash(updated_user.password)
    if updated_user.team:
        user.team = updated_user.team

    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Apenas superusuários podem deletar usuários")

    db.delete(user)
    db.commit()
    return {"message": "Usuário deletado com sucesso"}