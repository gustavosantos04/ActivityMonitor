# app/utils/email.py
from fastapi_mail import FastMail, MessageSchema, MessageType
from app.email_config import get_email_config


async def send_reset_email(email_to: str, reset_token: str):
    frontend_url = "http://localhost:5173/reset-password"  # ou o domínio do seu front em produção
    reset_link = f"{frontend_url}?token={reset_token}"

    html_body = f"""
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Redefinição de Senha</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:'Segoe UI', sans-serif;">
    <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0" style="padding: 2rem 0;">
      <tr>
        <td align="center">
          <table width="100%" max-width="600px" bgcolor="#ffffff" cellpadding="40" cellspacing="0" style="border-radius:10px; box-shadow:0 10px 40px rgba(0,0,0,0.1);">
            <tr>
              <td align="center">
                <h1 style="color:#ffff;">ZGTime</h1>
                <p style="font-size: 1.1rem; color:#444; margin-top:0;">Recebemos uma solicitação para redefinir sua senha.</p>
                <p style="font-size: 1rem; color:#666;">Clique no botão abaixo para continuar:</p>

                <a href="{reset_link}" target="_blank" style="
                  display:inline-block;
                  padding: 14px 28px;
                  margin-top: 20px;
                  background-color:#00FF00;
                  color: #fff;
                  font-size: 1rem;
                  font-weight: 600;
                  border-radius: 8px;
                  text-decoration: none;
                ">Redefinir Senha</a>

                <p style="font-size:0.9rem; color:#999; margin-top:30px;">
                  Se você não solicitou isso, ignore este e-mail.
                </p>

                <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />

                <p style="font-size: 0.8rem; color:#bbb;">
                  &copy; {2025} ZGTime. Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""

    message = MessageSchema(
        subject="Redefinição de Senha",
        recipients=[email_to],
        body=html_body,
        subtype=MessageType.html,
    )

    fm = FastMail(get_email_config())
    await fm.send_message(message)
