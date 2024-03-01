import {Article} from "./article";

export class ChatBotResponse {
  articles: Article[] = []
  queryAnswer?: string

  constructor(
    articles: Article[],
    queryAnswer: string
  ) {
    this.articles = articles;
    this.queryAnswer = queryAnswer;
  }
}
