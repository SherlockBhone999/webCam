import NavigationContainer from "./NavigationContainer"
import { useState, useEffect, createContext } from "react"



export const Context = createContext()


const testDevices = [
  { 
    status : "sending",
    network : "",
    deviceName : "device1",
    socketId : "",
    peerId : "",
    roomName : "",
    cameraCount : 0,
  },
  { 
    status : "sending",
    network : "",
    deviceName : "device2",
    socketId : "",
    peerId : "",
    roomName : "",
    cameraCount : 0, 
  },
  { 
    status : "receiving",
    network : "",
    deviceName : "device3",
    socketId : "",
    peerId : "",
    roomName : "",
    cameraCount : 0,
  },
  { 
    status : "receiving",
    network : "",
    deviceName : "device4",
    socketId : "",
    peerId : "",
    roomName : "",
    cameraCount : 0,
  },
  { 
    status : "",
    network : "",
    deviceName : "device5",
    socketId : "",
    peerId : "",
    roomName : "",
    cameraCount : 0,
  },
  ]

export default function App () {
  //devices in the same room 
  const [ allDevices, setAllDevices ] = useState(testDevices)
  const [ deviceInfo, setDeviceInfo ] = useState({
    status : "",
    network : "",
    deviceName : "",
    socketId : "",
    peerId : "",
    roomName : "",
    cameraCount : 0,
  })
  const [ itemsInDB, setItemsInDB ] = useState([1,2,3,4,5,6,7])
  
  
  //
  useEffect(()=>{
    getDeviceInfo()
    checkCameras()
  },[])
  
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
      itemsInDB,
      setItemsInDB,
      
    }}>
      <NavigationContainer />
    </Context.Provider>
  )
}