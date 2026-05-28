import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import waitlistRouter from "./waitlist";
import whisperRouter from "./whisper";
import checkoutRouter from "./checkout";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(waitlistRouter);
router.use(whisperRouter);
router.use(checkoutRouter);

export default router;
