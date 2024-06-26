
import { useState, useEffect, useContext } from "react"
import { Context } from "../../ContextProvider"

export default function Device ({data,index, sendingDevices, setSendingDevices}) {
  const { socket, deviceInfo } = useContext(Context)
  const [ isRecording, setIsRecording ] = useState(false)
  
  const updateList = () => {
    
    //just to trigger animation
    const arrr = []
    sendingDevices.map(obj => {
      arrr.push(obj)
    })
    setSendingDevices(arrr)
    
    const arr = []
    sendingDevices.map((obj,indexx) => {
      if( indexx !== index){
        arr.push(obj)
      }
    });

    //due to animation, need to wait
    setTimeout(()=>{
      arr.push(data)
      setSendingDevices(arr)
    },500)

  }
  
  
  const orderCapturePhoto = () => {
    const twoDevices = {
      sender : {
        deviceName : data.deviceName,
        socketId : data.socketId
        },
      receiver : {
        socketId : deviceInfo.socketId
      }
    }    
    socket.emit("orderCapturePhoto", twoDevices )
  }
  
  const orderStartRecording = () => {
    setIsRecording(true)
    socket.emit("orderStartRecording", data.socketId )
  }
  
  const orderStopRecording = () => {
    setIsRecording(false)
    const twoDevices = {
      sender : {
        deviceName : data.deviceName,
        socketId : data.socketId
        },
      receiver : {
        socketId : deviceInfo.socketId
      }
    }    
    socket.emit("orderStopRecording", twoDevices )
  }
  
  const orderTurnCamera = () => {
    socket.emit("orderTurnCamera",data.socketId)
  }
  
  const closeConnection = () => {
    
  }
  
  return (
    <div className="w-full h-full p-1 bg-green-300 border border-2 border-black rounded">
      <div className="relative" >
        <div className="h-60" />
        <div className="absolute top-0 w-full flex justify-between">
          <div>
            
            <p>{data.deviceName}</p>
          </div>
          <div>
            { index !== sendingDevices.length-1 &&
            <button 
              className="bg-gray-400 p-2 rounded mr-1"
              onClick={updateList}
            >
              pushDown
            </button>
            }
            <button className="bg-red-600 p-2 rounded"
              onClick={closeConnection}
            >
              close
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="flex justify-between mr-2 ml-2">
            { !isRecording &&
              <button className="bg-blue-400 p-1 rounded shadow"> turn</button>
            }
            <button className="bg-blue-400 p-1 rounded shadow"
              onClick={orderCapturePhoto}
            > capture</button>
            
            { !isRecording ?
              <button className="bg-blue-400 p-1 rounded shadow"
                onClick={orderStartRecording}
              > record</button>
            :
              <button className="bg-blue-400 p-1 rounded shadow"
                onClick={orderStopRecording}
              > stop</button>
            }
          </div>
          <p>should be invisible if no peer stream sent </p>
        </div>
      </div>
      
    </div>
  )
}