'use client'
import "react-chat-elements/dist/main.css"
import {useRef, useState} from "react";
import {ChatBotResponse} from "../../models/chatBotResponse";
import {Input, MessageList} from "react-chat-elements";

export default function Home() {
  const [messageListArray, setMessageListArray] = useState<any>([])
  const messageListReference = useRef()
  const inputReference = useRef<HTMLInputElement>(null);
  const [processingQuestion, setProcessingQuestion] = useState<boolean>(false);

  const handleMessage = async () => {
    const question = inputReference.current!.value;
    if (question === "" || processingQuestion) return;
    setProcessingQuestion(true)

    const questionMsg = {
      position: "right",
      type: "text",
      title: "Question",
      text: inputReference.current!.value,
      notch: false
    }
    setMessageListArray([...messageListArray, questionMsg])
    inputReference.current!.value = ""

    try {
      fetch('/api/chatBot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({question}),
      })
        .then(response => response.json() as Promise<ChatBotResponse>)
        .then(value => {
          const answerMsg = {
            position: "left",
            type: "text",
            title: "Answer",
            text: <>
              <div className={"pb-5"}>{value.queryAnswer}</div>
              <div>
                {value.articles.map(value1 => (
                  <div key={value1.link}><a className={"text-blue-500 hover:text-blue-800"} target={"_blank"}
                                            href={value1.link}>{value1.name}</a></div>
                ))}
              </div>
            </>,
            notch: false
          }
          // @ts-ignore
          setMessageListArray(currentMessages => [...currentMessages, answerMsg]);
        })
        .catch(reason => {
        })
        .finally(() => setProcessingQuestion(false));

    } catch (e) {
    }
  }

  return (
    <div className="flex flex-col justify-end min-h-screen bg-[#f4f4f0]">
      <div className="flex flex-col gap-2 mb-4 max-w-5xl mx-auto w-full">
        <div className="p-4 flex justify-center">
          Gumroad - AI Chat Agent
        </div>
        <div className="p-4">
          <MessageList
            referance={messageListReference}
            dataSource={messageListArray}
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
              onClick={() => handleMessage()}>Send
              Message</button>}
          />
        </div>
      </div>
    </div>
  )
}