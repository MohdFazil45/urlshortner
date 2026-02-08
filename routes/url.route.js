import express from "express"
import { authMiddleware } from "../middlewares/userAuth.Middleware.js"
import { deleteUrl, getAllUrls, getRedirect, urlHandler } from "../controller/urls.controller.js"

const router = express.Router()

router.post("/shorturl",authMiddleware, urlHandler)
router.get("/allurls",authMiddleware,getAllUrls)
router.delete("/:id",authMiddleware,deleteUrl)
router.get("/:code",getRedirect)

export default router