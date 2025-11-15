import { Router } from 'express';
import { 
    getHome,
    getInfo
} from '../controllers/index';

const router = Router();

router.get('/', getHome);
router.post('/info', getInfo);

export default router;