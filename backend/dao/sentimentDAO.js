import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let sentiment


/* Format of Sentiment Daya

    Name : "Kab" or "Anonymouse"
    Day  : "Thursday"
    Week : 4
    Comment : "Had fun playing jackbox"

*/

export default class SentimentDAO {
    static async injectDB(conn){
        if (sentiment){
            return
        }
        try {
            sentiment = await conn.db(process.env.SENTIMENT_NS).collection("sentiments")
        } catch(e) {
            console.error(
                `Unable to establish a collection handle in setimentDAO: ${e}`, 
            )
        }
    }

    static async getSentiment({
        filters = null,
        page = 0,
        sentimentsPerPage = 20,
      } = {}) {
        let query
        if (filters) {
          if ("name" in filters) {
            query = { $text: { $search: filters["name"] } }
          } else if ("day" in filters) {
            query = { "day": { $eq: filters["day"] } }
          } else if ("week" in filters) {
            query = { "week": { $eq: filters["week"] } }
          }  else if ("comment" in filters) {
            query = { "comment": { $eq: filters["comment"] } }
          }

        }
    
        let cursor
        
        try {
          cursor = await sentiment
            .find(query)
        } catch (e) {
          console.error(`Unable to issue find command, ${e}`)
          return { sentimentList: [], totalNumSentiments: 0 }
        }
    
        const displayCursor = cursor.limit(sentimentsPerPage).skip(sentimentsPerPage * page)
    
        try {
          const sentimentList = await displayCursor.toArray()
          const totalNumSentiments = await sentiment.countDocuments(query)
    
          return { sentimentList, totalNumSentiments }
        } catch (e) {
          console.error(
            `Unable to convert cursor to array or problem counting documents, ${e}`,
          )
          return { sentimentList: [], totalNumSentiments: 0 }
        }
      }

      static async addSentiment(name, day, week, comment) {
        try {
          const userSentiment = { name: name,
              day: day,
              week: week,
              comment: comment
              }
    
          return await sentiment.insertOne(userSentiment)
        } catch (e) {
          console.error(`Unable to post sentiment: ${e}`)
          return { error: e }
        }
      }

}
