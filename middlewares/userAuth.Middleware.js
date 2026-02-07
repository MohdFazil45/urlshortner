import jwt from "jsonwebtoken"
/**
 * 
 * @param {import("express").Response} res
 * @param {import("express").Request} req 
 * @param {import("express").NextFunction} next 
 *
 */

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"]

        if (!authHeader) {
            return res.status(400).json({
                error: "Authorization"
            })
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(400).json({
                error: "Authorization"
            })
        }

        const token = authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                error: "Authorization error"
            })
        }

        const decode = jwt.verify(token, process.env.SECRET)

        if (decode) {
            req.userId = decode.id
            next()
        } else {
            res.status(403).json({
                msg: "you are not logged in"
            })
        }

    } catch (error) {
        return res.status(401).json({
        error: "Invalid or expired token"
    })
    }
}