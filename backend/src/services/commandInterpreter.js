const KEYWORDS = {
  benefits: ['beneficio', 'benefícios', 'beneficios'],
  role: ['cargo', 'função', 'funcao'],
  sector: ['setor', 'área', 'area'],
  basicData: ['dados cadastrais', 'dados básicos', 'dados basicos', 'meus dados'],
  listEmployees: ['listar funcionários', 'listar funcionarios', 'funcionários', 'funcionarios'],
  showTeam: ['mostrar equipe', 'minha equipe', 'equipe'],
  adminReport: ['relatório geral', 'relatorio geral', 'resumo geral', 'auditoria']
};

function normalize(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function hasKeyword(command, keywords) {
  return keywords.some((keyword) => command.includes(normalize(keyword)));
}

export function resolveIntent(rawCommand) {
  const command = normalize(rawCommand);

  if (!command) {
    return { intent: 'unknown', reason: 'Comando vazio.' };
  }

  if (hasKeyword(command, KEYWORDS.benefits)) {
    return { intent: 'benefits' };
  }

  if (hasKeyword(command, KEYWORDS.role)) {
    return { intent: 'role' };
  }

  if (hasKeyword(command, KEYWORDS.sector)) {
    return { intent: 'sector' };
  }

  if (hasKeyword(command, KEYWORDS.basicData)) {
    return { intent: 'basic_data' };
  }

  if (hasKeyword(command, KEYWORDS.showTeam)) {
    return { intent: 'show_team' };
  }

  if (hasKeyword(command, KEYWORDS.listEmployees)) {
    return { intent: 'list_employees' };
  }

  if (hasKeyword(command, KEYWORDS.adminReport)) {
    return { intent: 'admin_report' };
  }

  return {
    intent: 'unknown',
    reason: 'Não consegui identificar o comando. Tente pedir benefícios, cargo, setor, equipe ou listagem de funcionários.'
  };
}
