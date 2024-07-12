
import { useState, useEffect, useContext, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Context } from '../../ContextProvider'
import { GrSend } from "react-icons/gr";
import { FaWindowClose } from "react-icons/fa";


const Device = ({data}) => {
  const [isBeingSentTo, setIsBeingSentTo] = useState(false)
  const { peerConnectionRef, videoRef, facingMode, socket } = useContext(Context)
  const callRef = useRef(null)
  
  useEffect(()=>{
    socket.on("closePeerConnection", ()=>{
      cancel()
    })
    
    return () => {
      cancel()
    }
  },[])
  
  
  useEffect(()=>{
    if(isBeingSentTo){
      callRef.current.close()
      console.log("call close called after facingMode change")
      setTimeout(()=>{
        call(data.peerId)
      },500)
    }
  },[facingMode])
  
  const call = (peerId) => {
    const theCall = peerConnectionRef.current.call(peerId, videoRef.current?.srcObject);
    callRef.current = theCall;
  }
  
  const send = () => {
    setIsBeingSentTo(true)
    call(data.peerId)
  }
  
  const cancel = () => {
    setIsBeingSentTo(false)
    callRef.current?.close()
  }
  
  
  return (
    <div className="m-1 flex items-center mb-4">
      <p className="text-cyan-400">{data.deviceName}</p>
      { !isBeingSentTo ?
      <button className=" p-2 ml-4 bg-green-400 rounded-lg" onClick={send}>
        <GrSend />
      </button>
      :
      <button className=" p-2 ml-4 bg-red-500 rounded-lg" onClick={cancel}>
        <FaWindowClose />
      </button>
      }
    </div>
  )
}

const pageVariants = {
  initial : { opacity : 0, scale : 1, y : "5%" },
  animate : { opacity : 1, scale : 1, y : "0%" } ,
  exit :{ opacity : 0, scale : 0.5 }
}

const pageTransition = {
  type: "spring",
  ease: "easeOut",
  duration: 1,
}

export default function Devices () {
  const { allDevices } = useContext(Context)
  const [ receivingDevices, setReceivingDevices ] = useState([])
  const [ isActive, setIsActive] = useState(true)
  
  useEffect(()=>{
    const arr = []
    allDevices.map(obj => {
      if(obj.status === "receiving" && obj.peerId !== ""){
        arr.push(obj)
      }
    })
    setReceivingDevices(arr)
  },[allDevices])
  
  useEffect(()=>{
    setIsActive(false)
    setTimeout(()=>{
      setIsActive(true)
    },500)
  },[receivingDevices])
  
  return (
    <AnimatePresence>
      <motion.div 
        initial = "initial"
        animate = "animate"
        exit = "exit"
        variants = {pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
    
      <div>
        <p className="text-lg font-bold text-white mt-5"> receiving devices </p>
        <div className="ml-5">
          { receivingDevices.map(obj => 
            <Device data={obj} />
          )}
          { receivingDevices.length === 0 &&
            <p className="text-white">None</p>
          }
        </div>

      </div>
    
    </motion.div>
  </AnimatePresence>
  )
}