'use client'
import "react-chat-elements/dist/main.css"
import {ChatBotResponse} from "../../models/chatBotResponse";

export default function ChatAnswer(chatResponse: ChatBotResponse) {
  return (
    <>
      <div className={"pb-5"}>{chatResponse.queryAnswer}</div>
      <div>
        <span>{"Related Articles"}</span>
        {chatResponse.articles.map(value1 => (
          <div key={value1.link}>
            <a className={"text-blue-500 hover:text-blue-800"}
               target={"_blank"}
               href={value1.link}>{value1.name}
            </a>
          </div>
        ))}
      </div>
    </>
  )
}