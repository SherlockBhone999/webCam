import NavigationContainer from "./NavigationContainer"
import { useState, useEffect, createContext, useRef } from "react"
import Peer from "peerjs"
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
    facingMode : "",
  })
  const peerConnectionRef = useRef(null)
  const [browserName, setBrowserName] = useState("")
  
  useEffect(()=>{
    
    getDeviceInfo()
    checkCameras()
    getBrowserName()
    
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
    
    const peer = new Peer()
    peer.on("open", (peerId) => {
      setDeviceInfo(prevv => {
        return {
          ...prevv,
          peerId : peerId
        }
      })
    })
    
    peerConnectionRef.current = peer
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
    
    const getBrowserName = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.includes("Chrome") && !userAgent.includes("Edg") && !userAgent.includes("OPR")) {
            setBrowserName("Chrome");
        } else if (userAgent.includes("Edg") || userAgent.includes("EdgA") || userAgent.includes("EdgiOS")) {
            setBrowserName("Edge");
        } else {
            setBrowserName("Other");
        }
    }
  
  
  return (
    <Context.Provider value={{
      allDevices,
      setAllDevices,
      deviceInfo,
      setDeviceInfo,
      socket,
      peerConnectionRef,
      browserName,
      
    }}>
      <NavigationContainer />
    </Context.Provider>
  )
}