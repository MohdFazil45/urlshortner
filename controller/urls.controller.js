import express from "express"
import { UrlSchema } from "../validators/validation.js"
import { db } from "../db/index.js"
import { urlTable } from "../models/index.js"
import { nanoid } from "nanoid"
import { eq } from "drizzle-orm"

/**
 * @param {import("express").Response} res
 * @param {import("express").Request} req 
 * @param {import("express").NextFunction} next 
 */

export const urlHandler = async (req, res) => {
    const userId = req.userId
    if (!userId) {
        return res.status(401).json({
            error: "Please signin "
        })
    }
    const validateInformation = UrlSchema.safeParse(req.body)

    if (!validateInformation.success) {
        return res.status(404).json({
            error: "Incorrect Url"
        })
    }

    const url = validateInformation.data
    const shortCode = nanoid(6)

    const [response] = await db.insert(urlTable).values({
        shortCode: shortCode,
        targetUrl: url,
        userId: userId
    }).returning({
        id: urlTable.id,
        shortCode: urlTable.shortCode,
        targetUrl: urlTable.targetUrl
    })


    res.status(201).json({
        id: response.id,
        shortCode: response.shortCode,
        targetUrl: response.targetUrl
    })
}

/**
 * @param {import("express").Response} res
 * @param {import("express").Request} req 
 * @param {import("express").NextFunction} next 
 */

export const getAllUrls = async (req, res) => {
    const userId = req.userId;

    const codes = await db
        .select()
        .from(urlTable)
        .where(eq(urlTable.userId, userId));

    if (codes.length === 0) {
        return res.status(404).json({
            error: "No URL available"
        });
    }

    return res.status(200).json({
        codes
    });
};


/**
 * @param {import("express").Response} res
 * @param {import("express").Request} req 
 * @param {import("express").NextFunction} next 
 */

export const getRedirect = async (req, res) => {
    const code = req.params.code

    const [result] = await db
        .select({ targetUrl: urlTable.targetUrl })
        .from(urlTable)
        .where(eq(urlTable.shortCode, code))


    if (!result) {
        return res.status(404).json({ error: "invalid url" })
    }
    const parsed = JSON.parse(result.targetUrl);
    return res.redirect(parsed.url)
}

