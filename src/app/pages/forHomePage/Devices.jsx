import Device from "./Device"
import { useContext } from "react"
import { Context } from "../../ContextProvider"


export default function App () {
  const { allDevices } = useContext(Context)
  
  return (
    <div className="w-full h-full relative">
      <div className="absolute left-[19%] h-full w-4/5 overflow-scroll p-1">
        {allDevices.map((obj)=> 
          <Device data={obj}/>
        )}
      </div>
    </div>
  )
}