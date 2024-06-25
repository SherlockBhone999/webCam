



export default function App ({data}) {
  return (
    <div className="bg-gray-500 m-1 pb-10 p-1 rounded">
      <div className="">
        <p className="text-white">{data.deviceName}</p>
        <p className="text-white" >status : {data.status || "idle"}</p>
        
      </div>
    </div>
  )
}