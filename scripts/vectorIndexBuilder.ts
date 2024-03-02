import dotenv from 'dotenv';
import {articles} from "./articleList";
import axios from "axios";
import * as cheerio from 'cheerio';
import {Document} from 'langchain/document';
import {Article} from "../models/article";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {Pinecone} from "@pinecone-database/pinecone";
import {PineconeStore} from "@langchain/pinecone";
import {OpenAIEmbeddings} from "@langchain/openai";

dotenv.config({path: './.env.local'});

/**
 * This script is designed to build a vector index. It accomplishes this by retrieving documents,
 * dividing them into smaller, manageable segments, and then processing these segments through OpenAI's
 * Embedding API. The resulting embeddings are then saved in Pinecone for future retrieval and use.
 */
const run = async () => {
  const openAiApiKey = process.env.OPENAI_API_KEY
  const openAiEmbeddingModelName = process.env.OPENAI_API_EMBEDDING_MODEL_NAME
  const pineConeApiKey = process.env.PINECONE_API_KEY ?? ""
  const pineConeIndexName = process.env.PINECONE_INDEX ?? ""

  const pineCone = new Pinecone({apiKey: pineConeApiKey});
  const openAi = new OpenAIEmbeddings({openAIApiKey: openAiApiKey, modelName: openAiEmbeddingModelName})

  const documents = await getDocuments()
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await textSplitter.splitDocuments(documents);
  const pineConeIndex = pineCone.Index(pineConeIndexName);

  console.log(`Creating vector store`);

  await PineconeStore.fromDocuments(docs, openAi, {
    pineconeIndex: pineConeIndex,
    maxConcurrency: 5,
    onFailedAttempt: error => {
      console.log("Error creating vector store: ", error)
    }
  });

  console.log(`Completed creating vector store`);
  console.log(``);
}

/**
 * Fetches and extracts text content from a predefined list of articles.
 */
async function getDocuments(): Promise<Document[]> {
  const documents: Document[] = [];
  const totalArticles = articles.length;
  console.log(`Started extracting articles`);

  for (let index = 0; index < totalArticles; index++) {
    const article = articles[index];
    const document = await scrapeText(article);
    documents.push(document);
    console.log(`Extracted Article: ${article.name} Progress: ${index + 1}/${totalArticles}`);
  }
  console.log(`Completed extracting articles.`);
  console.log(``);
  return documents;
}

/**
 * Scrapes and extracts clean text content from a single article's webpage.
 * Uses axios for HTTP requests and cheerio for HTML content parsing.
 */
async function scrapeText(article: Article): Promise<Document> {
  try {
    const {data: htmlContent} = await axios.get(article.link);
    const $ = cheerio.load(htmlContent);

    $('script, style').remove();
    let text = $('body').find('*').not('script, style').contents().map(function () {
      return this.type === 'text' ? $(this).text().trim() : '';
    }).get().join(' ');

    return new Document({
      pageContent: text,
      metadata: {
        url: article.link,
        articleName: article.name,
        category: article.category
      }
    })
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    throw new Error(`${error}`);
  }
}

(async () => {
  await run();
})();