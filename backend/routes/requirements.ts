import { Router } from 'express';
import {
  createRequirement,
  getRequirements,
  getRequirementById,
  seedSampleRequirements,
} from '../controllers/requirementController.ts';

const router = Router();

router.post('/', createRequirement);
router.post('/seed', seedSampleRequirements);
router.get('/', getRequirements);
router.get('/:id', getRequirementById);

export default router;
