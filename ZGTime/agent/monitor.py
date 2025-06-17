import time
import psutil
import win32gui
import win32process
from datetime import datetime
import requests
import getpass
from ctypes import Structure, windll, c_uint, byref

API_URL = "http://127.0.0.1:8000/activities/"  # Altere aqui se o servidor estiver remoto

def get_active_window_title():
    try:
        hwnd = win32gui.GetForegroundWindow()
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        process = psutil.Process(pid)
        name = process.name()
        title = win32gui.GetWindowText(hwnd)
        return {
            "app_name": name,
            "window_title": title,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "app_name": "Unknown",
            "window_title": str(e),
            "timestamp": datetime.now().isoformat()
        }

def get_idle_time():
    class LASTINPUTINFO(Structure):
        _fields_ = [("cbSize", c_uint), ("dwTime", c_uint)]

    lii = LASTINPUTINFO()
    lii.cbSize = c_uint(8)
    windll.user32.GetLastInputInfo(byref(lii))
    millis = windll.kernel32.GetTickCount() - lii.dwTime
    return millis / 1000.0  # segundos

def enviar_para_api(dados):
    try:
        response = requests.post(API_URL, json=dados, timeout=5)
        if response.status_code != 200:
            print(f"⚠️ Falha ao enviar: {response.status_code}")
    except Exception as e:
        print(f"⚠️ Erro ao enviar dados: {e}")

def monitor_loop(interval=5):
    print("Iniciando monitoramento e envio para API...")
    username = getpass.getuser()

    while True:
        idle_seconds = get_idle_time()
        status = "Ativo" if idle_seconds < 60 else "Inativo"
        window = get_active_window_title()

        payload = {
            "username": username,
            "status": status,
            "app_name": window["app_name"],
            "window_title": window["window_title"],
            "timestamp": window["timestamp"]
        }

        print(f"[{payload['timestamp']}] {status} | {payload['app_name']} | {payload['window_title']}")
        enviar_para_api(payload)

        time.sleep(interval)

if __name__ == "__main__":
    monitor_loop()
