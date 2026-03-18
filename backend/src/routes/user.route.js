import { response, Router } from "express";
import { registerUser,githubAccess } from "../controllers/user.controllers.js";

const router = Router();
router.route('/auth/github').get(githubAccess);

router.route('/auth/github/callback').get(registerUser);

export default router;