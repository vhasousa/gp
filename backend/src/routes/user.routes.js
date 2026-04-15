import { Router } from 'express';
import { getDemoUsers } from '../services/rhService.js';

const router = Router();

router.get('/demo-users', async (req, res, next) => {
  try {
    const users = await getDemoUsers();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

export default router;
