
import { useState, useEffect } from "react"

export default function Device ({data,index, sendingDevices, setSendingDevices}) {
  const [isAccepted, setIsAccepted ] = useState(false)
  
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
              onClick={()=>setIsAccepted(false)}
            >
              close
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="flex justify-between bg-blue-200 mr-2 ml-2">
            <button> turn</button>
            <button> capture</button>
            <button> record</button>
          </div>
        </div>
      </div>
      
    </div>
  )
}