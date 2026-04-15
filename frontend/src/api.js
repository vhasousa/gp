const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function fetchDemoUsers() {
  const response = await fetch(`${API_URL}/api/users/demo-users`);
  if (!response.ok) {
    throw new Error('Falha ao carregar usuários de demonstração.');
  }

  const data = await response.json();
  return data.users;
}

export async function sendCommand({ userId, command }) {
  const response = await fetch(`${API_URL}/api/voice/command`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, command })
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.response || data?.error || 'Erro ao processar comando.';
    return { ok: false, ...data, response: message };
  }

  return { ok: true, ...data };
}
