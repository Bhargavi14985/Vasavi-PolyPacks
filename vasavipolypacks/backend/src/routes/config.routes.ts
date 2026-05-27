import { Router } from 'express';
import { saveConfiguration, getMyConfigurations, getConfigurationById } from '../controllers/config.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', saveConfiguration);
router.get('/my-configs', authenticateToken, getMyConfigurations);
router.get('/:id', getConfigurationById);

export default router;
