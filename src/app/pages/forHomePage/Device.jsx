import { useContext } from "react"
import { Context } from "../../ContextProvider"

export default function App ({data}) {
  const { deviceInfo } = useContext(Context)
  return (
    <div className="flex">
      <div className="w-[10%]"/>
      <div className="bg-gray-300 m-1 pb-10 p-1 rounded w-full">
        <div className="flex items-center">
          <p className="">{data.deviceName}</p>
          { deviceInfo.deviceName === data.deviceName &&
          <div className="ml-2 w-4 h-4 bg-green-500" />
          }
        </div>
        <p className="" >status : {data.status || "idle"}</p>
      </div>
    </div>
  )
}