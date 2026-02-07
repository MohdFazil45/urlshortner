import express from "express"
import { authMiddleware } from "../middlewares/userAuth.Middleware.js"
import { urlHandler } from "../controller/urls.controller.js"

const router = express.Router()

router.post("/shorturl",authMiddleware, urlHandler)

export default router