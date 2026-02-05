import express from "express"
import router from "../routes/users.route.js"
const app = express()
const port = process.env.PORT || 8000

app.use(express.json())

app.use("/", router)

app.listen(port,()=> console.log(`Server is running on port :- ${port}`))