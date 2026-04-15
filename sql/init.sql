CREATE DATABASE IF NOT EXISTS brainstorm_gp_rh;
USE brainstorm_gp_rh;

DROP TABLE IF EXISTS interaction_logs;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role ENUM('colaborador', 'gestor', 'administrador') NOT NULL,
  position VARCHAR(100) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  benefits VARCHAR(255) NOT NULL,
  manager_id INT NULL,
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_manager FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(80) UNIQUE NOT NULL,
  description VARCHAR(255) NOT NULL
);

CREATE TABLE role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role ENUM('colaborador', 'gestor', 'administrador') NOT NULL,
  permission_id INT NOT NULL,
  CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE interaction_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role ENUM('colaborador', 'gestor', 'administrador') NOT NULL,
  command_text VARCHAR(255) NOT NULL,
  intent VARCHAR(80) NOT NULL,
  allowed TINYINT(1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (id, name, role, position, sector, benefits, manager_id) VALUES
  (1, 'Bruno Souza', 'gestor', 'Gerente de Operações RH', 'RH Operacional', 'Plano de saúde, VR, VT, bônus anual', NULL),
  (2, 'Ana Silva', 'colaborador', 'Analista de RH Júnior', 'RH Operacional', 'Plano de saúde, VR, VT', 1),
  (3, 'Carla Lima', 'administrador', 'Administradora de Pessoas e Sistemas RH', 'Administração RH', 'Plano premium, VR, VT, bônus, previdência privada', NULL),
  (4, 'Diego Costa', 'colaborador', 'Assistente RH', 'RH Operacional', 'Plano de saúde, VR, VT', 1);

INSERT INTO permissions (code, description) VALUES
  ('view_own_benefits', 'Consultar os próprios benefícios'),
  ('view_own_role', 'Consultar o próprio cargo'),
  ('view_own_sector', 'Consultar o próprio setor'),
  ('view_own_profile', 'Consultar dados cadastrais básicos próprios'),
  ('view_team', 'Consultar equipe gerenciada'),
  ('list_employees', 'Listar funcionários'),
  ('view_admin_report', 'Acessar relatório administrativo');

INSERT INTO role_permissions (role, permission_id)
SELECT 'colaborador', id FROM permissions
WHERE code IN ('view_own_benefits', 'view_own_role', 'view_own_sector', 'view_own_profile');

INSERT INTO role_permissions (role, permission_id)
SELECT 'gestor', id FROM permissions
WHERE code IN ('view_own_benefits', 'view_own_role', 'view_own_sector', 'view_own_profile', 'view_team');

INSERT INTO role_permissions (role, permission_id)
SELECT 'administrador', id FROM permissions;
