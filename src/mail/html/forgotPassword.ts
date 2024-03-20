export const htmlRecoveryPassword = (code: string, name: string) => {
  return `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>Recuperação de Senha - Inventra</title>
    <style>
      body {
        font-family: sans-serif;
        margin: 0;
        padding: 0;
      }
  
      h1 {
        font-weight: bold;
        margin: 0;
        padding: 0;
        color: #211f1f;
      }

      p {
        color: #211f1f;
      }
  
      .container {
        width: 600px;
        margin: 0 auto;
        background-color: #f2f2f2;
        padding: 20px;
      }
  
      .header {
        text-align: center;
        padding: 20px 0;
        background-color: #fff;
        border-bottom: 1px solid #ccc;
      }
  
      .logo {
        width: 100px;
        height: auto;
      }
  
      .title {
        font-size: 30px;
        font-weight: bold;
      }
  
      .content {
        padding: 20px;
      }
  
      .message {
        font-size: 16px;
        line-height: 1.5;
      }
  
      .link {
        display: block;
        padding: 10px 20px;
        background-color: #80B3FF;
        color: #fff;
        text-decoration: none;
        margin-top: 20px;
        text-align: center;
        font-size: 3rem;
        letter-spacing: 0.5rem;
      }
  
      .footer {
        text-align: center;
        padding: 20px 0;
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body>
  
    <div class="container">
      <div class="header">
        <!-- <img src="[Caminho para o seu logo]" alt="Logo" class="logo"> -->
        <h1 class="title">Recuperação de Senha</h1>
      </div>
    
      <div class="content">
        <p class="message">
          Olá, ${name}
        </p>
    
        <p class="message">
          Recebemos uma solicitação para recuperar a senha da sua conta na Inventra.
        </p>
    
        <p class="message">
          Para redefinir sua senha, copie o código abaixo e insira no aplicativo:
        </p>
    
        <p class="link">${code}</p>
    
        <p class="message">
          Se você não solicitou a recuperação de senha, ignore este e-mail. Sua senha permanecerá a mesma.
        </p>
      </div>
    
      <div class="footer">
        <p>
          Atenciosamente,<br>
          Equipe Inventra
        </p>
      </div>
    </div>
    </body>
    </html>
    
    `;
};
// <img src="https://github.com/devgrolli/api-stock-management/assets/59673152/2208d9eb-64b1-49cd-a9a3-12d2d40a31d2" alt="Logo da Empresa" class="logo">
