import { Router } from 'express';
import { itemController } from '../controllers/item.controller';
import { validate } from '../middleware/validate.middleware';
import { createItemSchema, updateItemSchema } from '../schema/item.schema';

const router = Router();

router.get('/', itemController.getAll);
router.get('/:id', itemController.getOne);
router.post('/', validate(createItemSchema), itemController.create);
router.patch('/:id', validate(updateItemSchema), itemController.update);
router.delete('/:id', itemController.delete);

export default router;
