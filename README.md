AI Chatbot application developed with Next.js, using articles from Gumroad's Help Center https://help.gumroad.com/

## Application Overview

This app uses a mix of OpenAI's `GPT-3.5` and `text-embedding-3-large models`, Pinecone's vector database, and Langchain typescript library to create a simple AI chatbot. The bot is trained on a curated list of articles from Gumroad's Help Center, making it capable of providing specific, accurate answers to user queries related to Gumroad's services. The development process can be broken down into several key steps, starting from environment setup to launching the chatbot UI.

### Step 1: Environment Setup
The initial step involves creating a .env.local file in the root directory of the project. This file stores the following environment variables

```
OPENAI_API_KEY=<Insert Key>
OPENAI_API_EMBEDDING_MODEL_NAME=text-embedding-3-large
OPENAI_API_MODEL_NAME=gpt-3.5-turbo
PINECONE_API_KEY=<insert key>
PINECONE_INDEX=<index name https://www.pinecone.io> 
```

These variables are crucial for interfacing with OpenAI's API and Pinecone's vector database.

### Step 2: Building the Index
A script `(npm run ingest-articles)` is provided to ingest articles from `./scripts/article.ts` file into a vector database. This process involves scraping the articles, converting them into vector representations using OpenAI's embeddings model, and then storing these vectors in Pinecone. This step is vital for enabling the chatbot to retrieve relevant information in response to user queries.

### Step 3: Testing the Chatbot

`npm run chat-bot-test` This script simulates the chatbot's response to a predefined test query.

Step 4: Launching the UI

Finally, `npm run dev` launches the Next.js application, a simple user-friendly chat interface built with `react-chat-elements` package. Users can interact with the chatbot through this interface, asking questions and receiving answers.

## Source Code Overview
The source code is organized into three primary components: training the AI, answering queries, and the chat UI.

### Training the AI

The process of training the AI model involves creating vector representations of articles from Gumroad's Help Center using the OpenAI `text-embedding-3-large` Model. These vectors are stored in a vector database managed by Pinecone, with the process facilitated by the Langchain typescript library, as detailed in `scripts/vectorIndexBuilder.ts`.

### Answering Queries

Upon receiving a user's question, the application transforms this query into a vector using OpenAI's `text-embedding-3-large` model. It then identifies articles from Pinecone with the closest semantic similarity, combines these articles with the query, and utilizes OpenAI's `GPT-3.5` model to formulate a response. The implementation for this functionality is located in `scripts/chatBot.ts`.

### Chat UI

The chat interface is developed as a simple Next.js application, using the React Chat Elements package for its user interface components. It communicates with the backend via the Fetch API to present answers to user inquiries. The code for this component is available in `src/app/page.tsx`.

The chatbot isn't production ready yet. There are several potential improvements that could elevate it to be production-ready:
- Broadening the dataset to include content from https://gumroad.nolt.io/  would allow the chatbot to check if a feature request has already been made.
- Incorporating articles from https://gumroad.com/blog would enrich the chatbot’s knowledge base.
- Adding functionality to display images from help articles, as visual aids are crucial for understanding certain instructions.
- Enhancing the chatbot’s ability to maintain the context of previous interactions within a session for a more coherent conversation flow.
