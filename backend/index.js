import app from "./server.js"
import  mongodb from "mongodb"
import dotenv from "dotenv"
import SentimentDAO from "./dao/sentimentDAO.js"
dotenv.config()

const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

// Connect to database and start the server
MongoClient.connect(
    process.env.SENTIMENT_DB_URI,
    {
    }
    )
    .catch(err => {
        console.log("oops")
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await SentimentDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })