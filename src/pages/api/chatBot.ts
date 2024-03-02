import {NextApiRequest, NextApiResponse} from "next";
import {ChatBot} from "../../../scripts/chatBot";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {question} = req.body;

  if (!question) {
    return res.status(400).json({message: 'No question in the request'});
  }

  try {
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
    const response = await new ChatBot().query(sanitizedQuestion)
    res.status(200).json(response);
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({error: error?.message || 'Unknown error.'});
  }
}