import { Router } from "express";
import { handleAdminLogin ,handleAdminAnalytics } from "../controllers/admin.controller.js"


const router = Router();

router.get('/:password', handleAdminLogin);
router.get('/:password/:shortId', handleAdminAnalytics);

export default router;