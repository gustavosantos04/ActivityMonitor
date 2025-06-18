from fastapi import FastAPI
from app.database import create_tables
from fastapi.middleware.cors import CORSMiddleware
from app.routes.activities import router as activities_router
from app.routes.manual_entries import router as manual_entries_router
from app.routes.users import router as users_router

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
app.include_router(activities_router)
app.include_router(manual_entries_router)
app.include_router(users_router)
