import express from "express"
import { signinHandler, signupHandler } from "../controller/users.controller.js"
const router = express.Router()

router.post("/signup",signupHandler)
router.post("/signin",signinHandler)

export default router