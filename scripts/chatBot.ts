import {Pinecone} from "@pinecone-database/pinecone";
import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {PineconeStore} from "@langchain/pinecone";
import {RetrievalQAChain} from "langchain/chains";
import {Article} from "../models/article";
import {ChatBotResponse} from "../models/chatBotResponse";

export class ChatBot {

  async query(query: string): Promise<ChatBotResponse> {
    const openApiKey = process.env.OPENAI_API_KEY
    const pineConeApiKey = process.env.PINECONE_API_KEY ?? ""
    const pineConeIndexName = process.env.PINECONE_INDEX ?? ""
    const openAiModelName = process.env.OPENAI_API_MODEL_NAME ?? ""

    const pineCone = new Pinecone({apiKey: pineConeApiKey});
    const openApi = new OpenAIEmbeddings({openAIApiKey: openApiKey})
    const pineConeIndex = pineCone.Index(pineConeIndexName);

    const vectorStore = await PineconeStore.fromExistingIndex(openApi, {
      pineconeIndex: pineConeIndex
    });

    const llm = new ChatOpenAI({temperature: 0.5, openAIApiKey: openApiKey, modelName: openAiModelName})
    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever(), {returnSourceDocuments: true})
    const response = await chain.invoke({query: query,});

    const jsonResponse = response.sourceDocuments
    const articlesSearched: Article[] = []

    for (const document of jsonResponse) {
      const isAlreadyAdded = articlesSearched.find(m => m.name === document.metadata.articleName)
      if (!isAlreadyAdded) {
        const article = new Article(document.metadata.category, document.metadata.articleName, document.metadata.url)
        articlesSearched.push(article)
      }
    }

    return new ChatBotResponse(articlesSearched, response.text)
  }
}
