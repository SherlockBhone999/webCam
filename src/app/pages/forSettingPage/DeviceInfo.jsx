
import { useState, useEffect, useRef, useContext } from "react"
import { Context } from "../../ContextProvider"



export default function App() {
  const { deviceInfo, setDeviceInfo } = useContext(Context)
  const [ fieldValues, setFieldValues ] = useState({ deviceName : "" , roomName : "" }) 
  const [ isChanged, setIsChanged ] = useState(false)
  
  useEffect(()=>{
    setFieldValues({ deviceName : deviceInfo.deviceName, roomName : deviceInfo.roomName })
  },[deviceInfo])
  
  useEffect(()=>{
    if(fieldValues.deviceName !== deviceInfo.deviceName || fieldValues.roomName !== deviceInfo.roomName ){
      if(fieldValues.deviceName !== "" && fieldValues.roomName !== ""){
        setIsChanged(true)
      }else{
        setIsChanged(false)
      }
    }else{
      setIsChanged(false)
    }
    
  },[fieldValues])
  
  const update = () => {
    if(fieldValues.deviceName !== "" && fieldValues.roomName){
      const obj = {...deviceInfo, ...fieldValues}
      setDeviceInfo(obj)
      const str = JSON.stringify(obj)
      localStorage.setItem("deviceInfo", str)
      setIsChanged(false)
    }
  }
  
  return (
    <div>
      <div className="bg-green-50 p-2 m-1">
        { fieldValues.deviceName === "" || fieldValues.roomName === "" ?
          <div className="w-full bg-red-500 p-1 mb-0.5">
            <p className="text-white">Names cannot be empty</p>
          </div>
        : 
          <div />
        }
        
        <div className="flex">
          <p className="p-1">device Name :</p>
          <input className="w-2/5 border-2 border-black roumded ml-2 p-1" 
            value={fieldValues.deviceName}
            onChange={(e)=>{
              setFieldValues(prevv => {
                return {
                  ...prevv,
                  deviceName : e.target.value
                }
              })
            }}
          />
        </div>
        
        <div className="mt-1 flex">
          <p className="p-1">room Name :</p>
          <input className="w-2/5 border-2 border-black roumded ml-2 p-1" 
            value={fieldValues.roomName}
            onChange={(e)=>{
              setFieldValues(prevv => {
                return {
                  ...prevv,
                  roomName : e.target.value
                }
              })
            }}
          />
        </div>
        
        <div className="flex justify-end">
          <button className={`${ isChanged ? "bg-blue-400" : "bg-gray-300" } p-2 m-1 rounded`} 
            onClick={update}
          >Set</button>
        </div>
        
      </div>
    </div>
  )
}