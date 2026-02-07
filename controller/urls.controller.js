import { UrlSchema } from "../validators/validation.js"
import { db } from "../db/index.js"
import { urlTable } from "../models/index.js"
import { nanoid } from "nanoid"

/**
 * 
 * @param {import("express").Response} res
 * @param {import("express").Request} req 
 * @param {import("express").NextFunction} next 
 *
 */

export const urlHandler = async (req, res) => {
    const userId = req.userId
    if (!userId) {
        return res.status(401).json({
            error:"Please signin "
        })
    }
    const validateInformation =  UrlSchema.safeParse(req.body)

    if (!validateInformation.success) {
        return res.status(404).json({
            error:"Incorrect Url"
        })
    }

    const url = validateInformation.data
    const shortCode = nanoid(6)

    const[response] = await db.insert(urlTable).values({
        shortCode:shortCode,
        targetUrl:url,
        userId:userId
    }).returning({
        id:urlTable.id,
        shortCode:urlTable.shortCode,
        targetUrl:urlTable.targetUrl
    })


    res.status(201).json({
        id:response.id,
        shortCode:response.shortCode,
        targetUrl:response.targetUrl
    })
}