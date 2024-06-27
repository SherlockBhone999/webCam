import NavigationContainer from "./NavigationContainer"
import { useState, useEffect, createContext } from "react"

import io  from "socket.io-client"

//const serverUrl = "https://webcamserver.onrender.com"
const serverUrl ="http://localhost:3000"
const socket = io(serverUrl)


export const Context = createContext()




export default function App () {
  //devices in the same room 
  const [ allDevices, setAllDevices ] = useState([])
  const [ deviceInfo, setDeviceInfo ] = useState({
    status : "",
    network : "",
    deviceName : "",
    socketId : "",
    peerId : "",
    roomName : "",
    cameraCount : 0,
    //orderTurnCamera need it 
    cameraComponentStates : {
      facingMode : "",
      videoChunks : [],
      mediaRecorder : null,
      itemToDownload : null,
    },
  })
  
  
  useEffect(()=>{
    
    getDeviceInfo()
    checkCameras()
    
    socket.on("connect", () => {
      setDeviceInfo(prevv => {
        return {...prevv , socketId : socket.id }
      })
      
      if(deviceInfo.deviceName !== "" && deviceInfo.roomName !== "" && deviceInfo.socketId !== ""){
        socket.emit("sendDeviceInfoToServer", deviceInfo)
      }
    })
    
    socket.on("sendAllDevicesToClient", (devices) => {
      setAllDevices(devices)
    })
    
  },[])
  
  useEffect(()=>{
      if(deviceInfo.deviceName !== "" && deviceInfo.roomName !== "" && deviceInfo.socketId !== ""){
        socket.emit("sendDeviceInfoToServer", deviceInfo)
      }
  },[deviceInfo])
  
  
  
  const getDeviceInfo = () => {
    const obj = localStorage.getItem("deviceInfo")
    if(obj !== null ){
      const objj = JSON.parse(obj)
      const n = objj.deviceName;
      const r = objj.roomName;
      setDeviceInfo(prevv => {
        return { ...prevv,
          deviceName : n,
          roomName : r
        }
      })
    }
  }
  
  const checkCameras = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          setIsFailed(true)
        }
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
        setDeviceInfo(prevv => {
          return {...prevv, cameraCount : videoInputDevices.length }
        })
      } catch (err) {
        setDeviceInfo(prevv => {
          return {...prevv, cameraCount : 0 }
        })
      }
    };
  
  
  return (
    <Context.Provider value={{
      allDevices,
      setAllDevices,
      deviceInfo,
      setDeviceInfo,
      socket,

      
    }}>
      <NavigationContainer />
    </Context.Provider>
  )
}