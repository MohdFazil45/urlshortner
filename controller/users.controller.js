import { eq } from "drizzle-orm"
import "dotenv/config.js"
import { db } from "../db/index.js"
import jwt from "jsonwebtoken"
import { userTable } from "../models/index.js"
import { UserSignin, UserSignup } from "../validators/validation.js"
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

        const [existingUser] = await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.email, email))

        if (existingUser) {
            return res.status(402).json({
                error: `user with email ${email} exist`
            })
        }

        const hashedPassword = await bcrypt.hash(password, 7)

        const [user] = await db.insert(userTable).values({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).returning({id:userTable.id})

        res.status(201).json({
            message: "signup successfully",
            id: user.id
        })


    } catch (error) {
        console.log(error)
    }
}

export const signinHandler = async (req, res) => {
    const parsedData = await UserSignin.safeParse(req.body)

    if (!parsedData.success) {
        return res.status(402).json({
            error: parsedData.error.message
        })
    }

    const email = parsedData.data.email
    const password = parsedData.data.password

    const [checkUser] = await db.select({
        id: userTable.id,
        hashedPassword: userTable.password
    }).from(userTable).where(eq(userTable.email, email))

    if (!checkUser) {
        return res.status(404).json({
            error: `user with email ${email} does not exist`
        })
    }

    const decodePassword = await bcrypt.compare(password, checkUser.hashedPassword)

    if (!decodePassword) {
        return res.status(403).json({
            error: "Incorrect password"
        })
    }
    const token = jwt.sign({
        id: checkUser.id,
    }, process.env.SECRET)

    res.status(201).json({
        message: "signedin successfully",
        token: token
    })
}