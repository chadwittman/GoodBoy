import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import waitlistRouter from "./waitlist";
import whisperRouter from "./whisper";
import checkoutRouter from "./checkout";
import setupRouter from "./setup";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(waitlistRouter);
router.use(whisperRouter);
router.use(checkoutRouter);
router.use(setupRouter);

export default router;
