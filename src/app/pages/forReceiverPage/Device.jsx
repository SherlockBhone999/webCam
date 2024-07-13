
import { useState, useEffect, useContext , useRef } from "react"
import { Context } from "../../ContextProvider"
import loadingGif from "../../../assets/loading.gif"

import { TbStackPush } from "react-icons/tb";
import { IoCameraReverse } from "react-icons/io5";
import { MdCamera } from "react-icons/md";
import { BsFillRecordCircleFill } from "react-icons/bs";
import { FaRegStopCircle } from "react-icons/fa";
import { AiOutlineDisconnect } from "react-icons/ai";

export default function Device ({data,index, sendingDevices, setSendingDevices, setDoAnimation}) {
  const { socket, deviceInfo, setDeviceInfo, peerConnectionRef } = useContext(Context)
  const [ isRecording, setIsRecording ] = useState(false)
  const videoRef = useRef(null)
  const [isVideoSourceNull, setIsVideoSourceNull ] = useState(true)
  const [isCameraSwitching, setIsCameraSwitching ] = useState(false)
  
  useEffect(()=>{
    peerConnectionRef.current?.on("call", (call) => {
      call.answer();
      call.on("stream", function (remoteStream) {

        videoRef.current.srcObject = remoteStream;
        //videoRef.current.play();
        setIsVideoSourceNull(false)
        setTimeout(()=>{
          setIsCameraSwitching(false)
        },1000)


      });
      
      call.on('close', () => {
        setIsVideoSourceNull(true)
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
        videoRef.current = null; 
        /*
        try {
          videoRef.current.srcObject = null;
        }catch (error){
          //to solve cannot set null problem, occured when peer connection is exited without closing, or for some other reasons, i am bad at problem solving, can only walk around it, its bad
          window.location.reload(true);
        }
        */
      })
    });
    
    
    socket.on("showLoading", () => {
      setIsCameraSwitching(true)
    })
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
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
    setIsCameraSwitching(true)
  }
  
  const closeConnection = () => {
    const senderId = data.socketId
    socket.emit("orderClosePeerConnection", senderId)
  }
  
  return (
    <div className="w-full h-full p-1 bg-zinc-300 border border-2 border-black rounded">
      <div className="w-full h-full" >
        
        <div className="w-full flex justify-between mb-1">
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
              <AiOutlineDisconnect />
            </button>
          </div>
        </div>
        

        <div className="w-[300px] h-[400px] relative">

          { isVideoSourceNull &&
            <p className="pt-10 pl-3 text-sm absolute">No camera stream received</p>
          }
          { isCameraSwitching &&
            <div className="absolute top-0 left-0 w-full h-full bg-white">
              <div className="w-full h-full flex justify-center items-center">
                <img src={loadingGif} className="w-[100px]"/>
              </div>
            </div>
          }
          
          <div className="w-full h-full absolute top-0 left-0 object-scale-down">
            <video ref={videoRef} autoPlay muted style={{ width: '100%'}} className="max-h-[400px]"/>
          </div>
          
        </div>
        

          
        <div className="mt-1 w-full">

          <div className="flex justify-between mr-2 ml-2">
            { !isRecording && data.cameraCount > 1 && !isCameraSwitching &&
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