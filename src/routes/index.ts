import { Router } from 'express';
import itemRoutes from './item.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/items', itemRoutes);

export default router;
