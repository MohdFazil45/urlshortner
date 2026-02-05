import express from "express"
import { signupHandler } from "../controller/users.controller.js"
const router = express.Router()

router.post("/signup",signupHandler)

export default router