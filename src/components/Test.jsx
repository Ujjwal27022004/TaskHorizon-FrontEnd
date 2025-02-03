import React, { useState } from 'react'
import axios from 'axios'


const Test = () => {
    const [message,setMessage]=useState("")
    const sendMessageToTeams = async()=>{
        try{
            const response = await axios.post("http://localhost:5000/send-message",{
                teamId: "b94dc17d-7a42-45b4-bb8a-8ccf51342e88",
                channelId: "19:309d952cce5745c889faa9ecb705b041@thread.tacv2",
                message: message       
            })

            console.log("Process done");
            console.log(response.data)
        }catch(error){
            console.log("error sending the message",error)
        }
    }
  return (
    <div>
        <form>
            <label htmlFor="message">
                <input
                type='text'
                value={message}
                onChange={setMessage(message)}
                />
            </label>
            <button onSubmit={sendMessageToTeams}>
                Click on this button to send message
            </button>
        </form>
      
    </div>
  )
}

export default Test
