import { pool } from '../config/db.js';

export const ROLE = {
  COLABORADOR: 'colaborador',
  GESTOR: 'gestor',
  ADMINISTRADOR: 'administrador'
};

const INTENT_TO_PERMISSION = {
  benefits: 'view_own_benefits',
  role: 'view_own_role',
  sector: 'view_own_sector',
  basic_data: 'view_own_profile',
  show_team: 'view_team',
  list_employees: 'list_employees',
  admin_report: 'view_admin_report'
};

export async function getDemoUsers() {
  const [rows] = await pool.query(
    `SELECT id, name, role, position, sector
     FROM users
     WHERE is_demo = 1
     ORDER BY FIELD(role, 'colaborador', 'gestor', 'administrador'), name`
  );

  return rows;
}

export async function getUserById(userId) {
  const [rows] = await pool.query(
    `SELECT id, name, role, position, sector, benefits, manager_id
     FROM users
     WHERE id = ?`,
    [userId]
  );

  return rows[0] || null;
}

export async function hasPermission(role, intent) {
  const permissionCode = INTENT_TO_PERMISSION[intent];

  if (!permissionCode) {
    return false;
  }

  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM role_permissions rp
     INNER JOIN permissions p ON p.id = rp.permission_id
     WHERE rp.role = ? AND p.code = ?`,
    [role, permissionCode]
  );

  return rows[0]?.total > 0;
}

export async function executeIntent(intent, currentUser) {
  switch (intent) {
    case 'benefits':
      return `Seus benefícios: ${currentUser.benefits}.`;

    case 'role':
      return `Seu cargo é ${currentUser.position}.`;

    case 'sector':
      return `Seu setor é ${currentUser.sector}.`;

    case 'basic_data':
      return `Dados básicos: nome ${currentUser.name}, cargo ${currentUser.position}, setor ${currentUser.sector}.`;

    case 'show_team': {
      const [team] = await pool.query(
        `SELECT name, position, sector
         FROM users
         WHERE manager_id = ?
         ORDER BY name`,
        [currentUser.id]
      );

      if (!team.length) {
        return 'Você não possui equipe cadastrada.';
      }

      const teamText = team
        .map((member) => `${member.name} (${member.position} - ${member.sector})`)
        .join('; ');

      return `Sua equipe: ${teamText}.`;
    }

    case 'list_employees': {
      const [employees] = await pool.query(
        `SELECT name, role, position, sector
         FROM users
         ORDER BY name`
      );

      const employeeText = employees
        .map((employee) => `${employee.name} [${employee.role}] - ${employee.position}/${employee.sector}`)
        .join('; ');

      return `Funcionários cadastrados: ${employeeText}.`;
    }

    case 'admin_report': {
      const [summary] = await pool.query(
        `SELECT role, COUNT(*) AS total
         FROM users
         GROUP BY role
         ORDER BY FIELD(role, 'colaborador', 'gestor', 'administrador')`
      );

      const summaryText = summary
        .map((item) => `${item.role}: ${item.total}`)
        .join('; ');

      return `Resumo administrativo de usuários por perfil: ${summaryText}.`;
    }

    default:
      return 'Comando não suportado.';
  }
}

export async function saveLog({ userId, role, command, intent, allowed }) {
  await pool.query(
    `INSERT INTO interaction_logs (user_id, role, command_text, intent, allowed)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, role, command, intent, allowed ? 1 : 0]
  );
}
