from fastapi import FastAPI
from app.routes import router
from app.database import create_tables
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Monitor Timesheet API")

# Criar tabelas no banco
create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # endereço do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(router)
