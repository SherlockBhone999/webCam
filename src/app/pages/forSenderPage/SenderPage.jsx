import GroupName from "../../components/GroupName"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ReactTyped } from "react-typed"
import Devices from "./Devices"
import Camera from "./Camera"



const pageVariants2 = {
  initial : { opacity : 0, scale : 0.9 },
  animate : { opacity : 1, scale : 1 } ,
  exit :{ opacity : 0, scale : 0.5 }
}

const pageTransition2 = {
  type: "spring",
  ease: "easeOut",
  duration: 0.2,
}

function App () {
  const navigate = useNavigate()
  return (
    <AnimatePresence>
        <motion.div className="w-full h-full"
          initial = "initial"
          animate = "animate"
          //exit = "exit"
          variants = {pageVariants2}
          transition={pageTransition2}
        >
            <div className="w-full h-full flex flex-col relative">
              <div className="absolute top-0 right-0">
                <button className="bg-gray-300 m-1 p-2 rounded" 
                  onClick={()=>navigate("/")}
                  >
                  Back
                </button>
              </div>
              
              <div className="h-1/5 w-full bg-gray-400 flex justify-center items-center">
                <p className="mr-1"> camera streaming    </p>
                <ReactTyped
                  strings={[" ",' . ', " . . ", ' . . . ']}
                  typeSpeed={40}
                  backSpeed={50}
                  showCursor={false}
                  loop
                />              
              </div>
              
              <div className="flex-auto bg-gray-300 overflow-scroll p-1">
                
                <Devices />
              </div>
              

            </div>
            
            <div className="fixed bottom-2 left-0">
              <Camera />
            </div>
            
          
        </motion.div>
    </AnimatePresence>
  )
}

export default function App2 (){
  return (
    <div className="w-screen h-screen flex flex-col">
      <GroupName />
      <div className="flex-auto">
        <App />
      </div>
    </div>
  )
}