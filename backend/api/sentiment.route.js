import express from "express"
import SentimentCtrl from "./sentiment.controller.js"

const router = express.Router()

router.route("/").get(SentimentCtrl.apiGetSentiments)
router.route("/").post(SentimentCtrl.apiPostSentiment)

export default router