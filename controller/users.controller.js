/**
* @param {import("express").Request} req
* @param {import("express").Response} res
*/

import { eq } from "drizzle-orm"
import {db} from "../db/index.js"
import { userTable } from "../models/index.js"
import { UserSignup } from "../validators/users.validation.js"
import bcrypt from "bcrypt"

export const signupHandler = async (req, res) => {
    try {
        const parsedData = await UserSignup.safeParse(req.body)

        if (!parsedData.success) {
            return res.status(404).json({
                error: parsedData.error.message
            })
        }

        const { firstName, lastName, email, password } = parsedData.data

        const [existingUser] = await db.select({ id: userTable.id }).from(userTable).where(() => eq(userTable.email, email))

        if (existingUser) {
            return res.status(402).json({
                error:`user with email ${email} exist`
            })
        }

        const hashedPassword = await bcrypt.hash(password,7)

        const [user] = await db.insert(userTable).values({
            firstName,
            lastName,
            email,
            password:hashedPassword
        })

        res.status(201).json({
            message:"signup successfully",
            id:user.id
        })


    } catch (error) {

    }
}   