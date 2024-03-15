export const HtmlRecoveryPassword = (code: string) => {
  return `
        <!doctype html>
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Código de Recuperação</title>
                <link rel="stylesheet" href="style.css" />
                <style>
                    body {
                        font-family: sans-serif;
                    }
                    h1 {
                        letter-spacing: 0.1em;
                        font-size: 24px;
                        font-weight: bold;
                        color: #323232;
                    }
                    p {
                        color: #323232;
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .container {
                        width: 40%;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ededed;
                        border-radius: 10px;
                        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
                    }
                    .logo {
                        width: 100px;
                        height: 50px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .content {
                        padding: 10px;
                    }
                    .code {
                        font-size: 60px;
                        letter-spacing: 0.5em;
                        font-weight: bold;
                        color: #323232;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Código de Recuperação</h1>
                    </div>
                    <div class="content">
                        <div class="header">
                            <p>
                                Use esse código para criar uma nova senha para acesso ao aplicativo e
                                área do cliente.
                            </p>
                            <p class="code">${code}</p>
                        </div>
                        <!-- <img src="/src/assets/logo.png" alt="Logo da Empresa" class="logo"> -->
                    </div>
                </div>
            </body>
        </html>
    `;
};
