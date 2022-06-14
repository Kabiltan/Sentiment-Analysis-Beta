import express from "express"
import cors from "cors"
import sentiment from "./api/sentiment.route.js"

const app = express()

// CORS stands for Cross-Origin Resource Sharing. 
// It allows us to relax the security applied to an API. 
// This is done by bypassing the Access-Control-Allow-Origin headers,
// which specify which origins can access the API
app.use(cors())

// Server can accept json in the body of a request
app.use(express.json())

app.use("/api/v1/sentiment", sentiment)

// If a endpoint that is not defined is accessed return 404 error
app.use("*", (req, res) => res.status(404).json({error: "not found"}))


export default app