import { Router } from 'express';
import { resolveIntent } from '../services/commandInterpreter.js';
import {
  executeIntent,
  getUserById,
  hasPermission,
  saveLog
} from '../services/rhService.js';

const router = Router();

router.post('/command', async (req, res, next) => {
  try {
    const { userId, command } = req.body;

    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'userId numérico é obrigatório.' });
    }

    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'command em texto é obrigatório.' });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário de demonstração não encontrado.' });
    }

    const { intent, reason } = resolveIntent(command);

    if (intent === 'unknown') {
      await saveLog({
        userId: user.id,
        role: user.role,
        command,
        intent,
        allowed: false
      });

      return res.status(400).json({
        allowed: false,
        intent,
        response: reason
      });
    }

    const allowed = await hasPermission(user.role, intent);

    if (!allowed) {
      await saveLog({
        userId: user.id,
        role: user.role,
        command,
        intent,
        allowed: false
      });

      return res.status(403).json({
        allowed: false,
        intent,
        response: `Acesso negado para o perfil ${user.role} neste comando.`
      });
    }

    const response = await executeIntent(intent, user);

    await saveLog({
      userId: user.id,
      role: user.role,
      command,
      intent,
      allowed: true
    });

    return res.json({
      allowed: true,
      intent,
      response
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
