import SentimentDAO from "../dao/sentimentDAO.js"

export default class SentimentsController {
  static async apiGetSentiments(req, res, next) {
    const sentimentsPerPage = req.query.sentimentsPerPage ? parseInt(req.query.sentimentsPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.name) {
      filters.name = req.query.name
    } else if (req.query.day) {
      filters.day = req.query.day
    } else if (req.query.week) {
      filters.week = req.query.week
    } else if (req.query.comment){
        filters.comment = req.query.comment
    }
    

    const { sentimentList, totalNumSentiments } = await SentimentDAO.getSentiment({
      filters,
      page,
      sentimentsPerPage,
    })

    let response = {
      sentiments: sentimentList,
      page: page,
      filters: filters,
      entries_per_page: sentimentsPerPage,
      total_results: totalNumSentiments,
    }
    res.json(response)
  }

  static async apiPostSentiment(req, res, next) {
    try {
      const name = req.body.name
      const day = req.body.day
      const week = req.body.week
      const comment = req.body.comment

      const SentimentResponse = await SentimentDAO.addSentiment(
        name,
        day,
        week,
        comment,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}