export const SUCCESS_MESSAGES = Object.freeze({
  PASSWORD_CHANGED: 'Senha alterada com sucesso!',
  CODE_RECOVERY_SUCCESS: 'Código de recuperação validado com sucesso.',
  CODE_SENT_EMAIL:
    'O código de recuperação foi enviado para o e-mail inserido.',
  USER_REGISTERED:
    'Cadastrado com sucesso, espere o administrador fazer a confirmação.',
  LOGIN_SUCCESS: 'Login realizado com sucesso',
});

export const ERROR_MESSAGES = Object.freeze({
  INVALID_TOKEN: 'Código inválido ou expirado.',
  UPDATE_NOTIFICATION: 'Ocorreu um erro ao atualizar campo disableNotify',
  UPDATE_ACCESS_USER: 'Ocorreu um erro ao atualizar a permissão do usuário',
  NO_RESET_REQUEST:
    'Não há solicitação de recuperação de senha para este e-mail.',
  INVALID_CODE: 'Código de recuperação inválido.',
  CODE_EXPIRED: 'Código de recuperação expirou.',
  CPF_EXISTS: 'Esse CPF já existe.',
  EMAIL_NOT_FOUND: 'E-mail não encontrado.',
  EMAIL_SEND_ERROR: 'Ocorreu um erro ao enviar o e-mail. Tente novamente.',
  USER_NOT_FOUND: 'Usuário não encontrado',
  INVALID_PASSWORD: 'Senha inválida',
  AWAITING_ADMIN_APPROVAL: 'Aguarde a aprovação do administrador para entrar',
  INVALID_RECOVERY_CODE: 'Código de recuperação inválido.',
});

export const ERROR_MESSAGES_DYNAMIC = {
  EMAIL_IN_USE: (email: string) =>
    `Email ${email} já está em uso, tente outro email.`,
};

export const MAIL = Object.freeze({
  SUBJECT: 'Recuperação de senha',
  TEXT_MAIL: (code: string) =>
    `Você solicitou a recuperação de senha. Aqui está o seu código de recuperação: ${code}`,
});
