
import { useState, useEffect, useContext , useRef } from "react"
import { Context } from "../../ContextProvider"


import { TbStackPush } from "react-icons/tb";
import { FaWindowClose } from "react-icons/fa";
import { IoCameraReverse } from "react-icons/io5";
import { MdCamera } from "react-icons/md";
import { BsFillRecordCircleFill } from "react-icons/bs";
import { FaRegStopCircle } from "react-icons/fa";


export default function Device ({data,index, sendingDevices, setSendingDevices, setDoAnimation}) {
  const { socket, deviceInfo, setDeviceInfo, peerConnectionRef } = useContext(Context)
  const [ isRecording, setIsRecording ] = useState(false)
  const videoRef = useRef(null)
  
  
  useEffect(()=>{
    peerConnectionRef.current?.on("call", (call) => {
      call.answer();
      call.on("stream", function (remoteStream) {
        videoRef.current.srcObject = remoteStream;
        videoRef.current.play();
      });
      
      call.on('close', () => {
        videoRef.current.srcObject = null;
      })
    });
  },[])
  
  
  const updateList = () => {
    setDoAnimation(true)
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
    setDoAnimation(false)
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
    setDoAnimation(false)
    setIsRecording(true)
    const senderId = data.socketId
    socket.emit("orderStartRecording", senderId)
  }
  
  const orderStopRecording = () => {
    setDoAnimation(false)
    setIsRecording(false)
    const twoDevices = {
      sender : {
        deviceName : data.deviceName,
        socketId : data.socketId,
        },
      receiver : {
        socketId : deviceInfo.socketId,
      }
    }    
    socket.emit("orderStopRecording", twoDevices )
  }
  
  const orderTurnCamera = () => {
    setDoAnimation(false)
    const sender = {
      socketId : data.socketId,
      facingMode : data.facingMode
    }
    socket.emit("orderTurnCamera",sender)
  }
  
  const closeConnection = () => {
    const senderId = data.socketId
    socket.emit("orderClosePeerConnection", senderId)
  }
  
  return (
    <div className="w-full h-full p-1 bg-zinc-300 border border-2 border-black rounded">
      <div className="relative" >
        
        <div className="absolute top-0 w-full flex justify-between">
          <div>
            
            <p className="font-bold">{data.deviceName}</p>
          </div>
          <div>
            { index !== sendingDevices.length-1 &&
            <button 
              className="bg-gray-400 p-2 rounded mr-1"
              onClick={updateList}
            >
              <TbStackPush />
            </button>
            }
            <button className="bg-red-600 p-2 rounded"
              onClick={closeConnection}
            >
              <FaWindowClose />
            </button>
          </div>
        </div>
        

        <div className="p-10 flex justify-center">
          <video ref={videoRef} autoPlay muted style={{ width: '90%' }}/>
        </div>

          
        <div className="absolute bottom-0 left-0 w-full">
          { !videoRef.current?.srcObject && <p className="pb-10 pl-3 text-sm">No camera stream received</p> }
          <div className="flex justify-between mr-2 ml-2">
            { !isRecording &&
              <button className="bg-blue-400 p-2 rounded shadow"
                onClick={orderTurnCamera}
              > 
                <IoCameraReverse />
              </button>
            }
            <button className="bg-blue-400 p-2 rounded shadow"
              onClick={orderCapturePhoto}
            > 
              <MdCamera />
            </button>
            
            { !isRecording ?
              <button className="bg-blue-400 p-2 rounded shadow"
                onClick={orderStartRecording}
              >
                <BsFillRecordCircleFill />
              </button>
            :
              <button className="bg-blue-300 p-2 rounded shadow"
                onClick={orderStopRecording}
              >
                <FaRegStopCircle />
              </button>
            } 
          </div>

        </div>
      </div>
      
    </div>
  )
}