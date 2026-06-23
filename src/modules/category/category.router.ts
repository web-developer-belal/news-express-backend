import express from 'express';
import { CategoryController } from './category.controller';
const router = express.Router();

router.get('/', CategoryController.index);
router.post('/store', CategoryController.create);
router.put('/update/:id', CategoryController.update);
router.delete('/delete/:id', CategoryController.destroy);

export const CategoryRouter = router;

