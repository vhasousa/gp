import { useEffect, useMemo, useState } from 'react';
import { fetchDemoUsers, sendCommand } from './api';
import { useSpeechRecognition } from './useSpeechRecognition';

const EXAMPLE_COMMANDS = [
  'quais benefícios eu tenho?',
  'qual meu cargo?',
  'qual meu setor?',
  'mostrar meus dados cadastrais básicos',
  'mostrar equipe',
  'listar funcionários',
  'relatório geral'
];

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [commandText, setCommandText] = useState('');
  const [transcription, setTranscription] = useState('');
  const [responseText, setResponseText] = useState('Aguardando comando.');
  const [status, setStatus] = useState('idle');

  const { supported, isListening, start, stop } = useSpeechRecognition({
    onResult: (text) => {
      setTranscription(text);
      setCommandText(text);
    }
  });

  useEffect(() => {
    async function loadUsers() {
      try {
        const result = await fetchDemoUsers();
        setUsers(result);
      } catch (error) {
        setResponseText(error.message);
      }
    }

    loadUsers();
  }, []);

  const title = useMemo(() => {
    if (!selectedUser) {
      return 'Brainstorm GP - Selecione o perfil de demonstração';
    }

    return `Brainstorm GP - Assistente RH (${selectedUser.name} - ${selectedUser.role})`;
  }, [selectedUser]);

  async function handleSubmitCommand() {
    if (!selectedUser || !commandText.trim()) {
      return;
    }

    setStatus('loading');
    const result = await sendCommand({
      userId: selectedUser.id,
      command: commandText
    });

    setResponseText(result.response || 'Sem resposta.');
    setStatus(result.ok ? 'success' : 'error');
  }

  if (!selectedUser) {
    return (
      <main className="vr-shell">
        <section className="card">
          <h1>{title}</h1>
          <p>Escolha um usuário para entrar sem login (modo MVP).</p>
          <div className="button-grid">
            {users.map((user) => (
              <button key={user.id} className="big-button" onClick={() => setSelectedUser(user)}>
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="vr-shell">
      <section className="card">
        <h1>{title}</h1>
        <p>
          Setor: <strong>{selectedUser.sector}</strong> | Cargo: <strong>{selectedUser.position}</strong>
        </p>

        <div className="actions-row">
          <button className="big-button" onClick={isListening ? stop : start}>
            {isListening ? 'Parar captura de voz' : 'Iniciar captura de voz'}
          </button>
          <button className="big-button muted" onClick={() => setSelectedUser(null)}>
            Trocar perfil
          </button>
        </div>

        <label htmlFor="commandInput">Comando (voz ou texto):</label>
        <input
          id="commandInput"
          value={commandText}
          onChange={(event) => setCommandText(event.target.value)}
          placeholder="Ex.: mostrar meus dados cadastrais básicos"
        />

        <button className="big-button" onClick={handleSubmitCommand}>
          Enviar comando
        </button>

        <div className="panel">
          <h2>Transcrição</h2>
          <p>{transcription || 'Nenhuma transcrição ainda.'}</p>
          {!supported && <p className="warning">Web Speech API não suportada neste navegador. Use o campo de texto.</p>}
        </div>

        <div className="panel">
          <h2>Resposta do Assistente RH</h2>
          <p>{status === 'loading' ? 'Processando comando...' : responseText}</p>
        </div>

        <div className="panel">
          <h2>Comandos sugeridos</h2>
          <ul>
            {EXAMPLE_COMMANDS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
