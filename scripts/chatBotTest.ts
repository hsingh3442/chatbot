import dotenv from 'dotenv';
import {ChatBot} from "./chatBot";
dotenv.config({path: './.env.local'});

(async () => {
  const query = "which kind of products can I sell on gumroad";
  const response = await new ChatBot().query(query);
  console.log(response.queryAnswer)
})();