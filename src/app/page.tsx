'use client'
import "react-chat-elements/dist/main.css"
import {useRef, useState} from "react";
import {ChatBotResponse} from "../../models/chatBotResponse";
import {Input, MessageList} from "react-chat-elements";
import ChatAnswer from "@/app/chatAnswer";
import LoadingSpinner from "@/app/loadingSpinner";

export default function Home() {
  const [messageList, setMessageList] = useState<any>([])
  const messageListRef = useRef()
  const inputReference = useRef<HTMLInputElement>(null);
  const [processingQuestion, setProcessingQuestion] = useState<boolean>(false);

  const handleMessage = async () => {
    const question = inputReference.current!.value;
    if (question === "" || processingQuestion) return;

    setProcessingQuestion(true)
    addQuestionToMsgList(question)

    try {
      fetch('/api/chatBot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({question}),
      })
        .then(response => response.json() as Promise<ChatBotResponse>)
        .then(response => {
          addAnswerToMsgList(response)
        })
        .catch(reason => {
          console.log(reason)
        })
        .finally(() => setProcessingQuestion(false));

    } catch (e) {
      console.log(e)
    }
  }

  function addQuestionToMsgList(question: string) {
    const questionMsg = {
      position: "right",
      type: "text",
      title: "Question",
      text: question,
      notch: false
    }

    const answerLoadingSpinner = {
      id: "loadingSpinner",
      position: "left",
      type: "text",
      text: <LoadingSpinner/>,
      notch: false
    }
    setMessageList([...messageList, questionMsg, answerLoadingSpinner])
    inputReference.current!.value = ""
  }

  function addAnswerToMsgList(chatBotResponse: ChatBotResponse) {

    const answerMsg = {
      position: "left",
      type: "text",
      title: "Answer",
      text: <ChatAnswer articles={chatBotResponse.articles} queryAnswer={chatBotResponse.queryAnswer}/>,
      notch: false
    }

    // @ts-ignore
    setMessageList(currentMessages => [...currentMessages.filter(m => m.id !== "loadingSpinner"), answerMsg]);
  }

  return (
    <div className="flex flex-col justify-end min-h-screen bg-[#f4f4f0]">
      <div className="flex flex-col gap-2 mb-4 max-w-5xl mx-auto w-full">
        <div className="p-4 flex justify-center">
          Gumroad - AI Chat Agent
        </div>
        <div className="p-4">
          <MessageList
            referance={messageListRef}
            dataSource={messageList}
            lockable={false}
          />

        </div>
        <div className="p-4">
          <Input
            className='rce-example-input border-2 border-slate-300 rounded-lg w-full'
            placeholder='Write your question here.'
            defaultValue=''
            multiline={false}
            referance={inputReference}
            maxHeight={50}
            onKeyPress={(e: any) => {
              if (e.charCode === 13) {
                handleMessage();
              }
            }}
            rightButtons={<button
              className={"bg-[#ff90e8] border-2 border-black hover:border-b-4 hover:border-r-4 text-black text-sm p-2 rounded"}
              onClick={() => handleMessage()}>Send Message</button>}
          />
        </div>
      </div>
    </div>
  )
}