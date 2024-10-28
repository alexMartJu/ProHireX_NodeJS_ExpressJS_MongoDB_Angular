import { Router } from "express";
import { authEnterpriseLogin } from "../../controllers/authEnterpriseController";
import { authEnterpriseCreateUser } from "../../controllers/authEnterpriseController";
import { authEnterpriseGetUser } from "../../controllers/authEnterpriseController";
import verifyJWT from "../../middleware/auth/authenticator";
import * as validator from "../../middleware/authEnterpriseValidator";

const router = Router();

router.post("/login", validator.userLoginValidator, authEnterpriseLogin);
router.post("/createUserEnterprise", validator.userCreationValidator, authEnterpriseCreateUser);
router.get("/getCurrentUser", verifyJWT, authEnterpriseGetUser);

export default router;