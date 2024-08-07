
import React, { useRef , useEffect , useState, useContext} from 'react';
import { Context } from "../../ContextProvider"
import { useIndexedDB } from './indexedDB/useIndexedDB';

import { format } from 'date-fns';

import { IoCameraReverse } from "react-icons/io5";
import { MdCamera } from "react-icons/md";
import { BsFillRecordCircleFill } from "react-icons/bs";
import { FaRegStopCircle } from "react-icons/fa";
import { MdHideImage } from "react-icons/md";
import { MdImage } from "react-icons/md";


const Camera = () => {
  const [isRecording, setIsRecording] = useState(false);
  
  const [isFailed, setIsFailed] = useState(false)
  const canvasRef = useRef(null);
  const [ itemToDownload, setItemToDownload ] = useState({ type : "", blob : null })
  const mediaRecorderRef = useRef(null)
  const { socket, setDeviceInfo , browserName , videoRef, facingMode, setFacingMode , setRefreshItemsCount } = useContext(Context)
  const [ isHidden, setIsHidden] = useState([])

  
  const { saveToFileDB, error } = useIndexedDB();
 
  useEffect(()=>{
    
    socket.on("capturePhoto", (twoDevices)=>{
      capturePhoto()
      socket.emit("feedbackPhotoSaved", twoDevices )
      
    })
    
    socket.on("startRecording" , () => {
      startRecording()
    })
    
    socket.on("stopRecording" , (twoDevices) => {
      stopRecording()
      socket.emit("feedbackVideoSaved", twoDevices )
    })
    
    socket.on("turnCamera" , (senderFacingMode) => {
      turnCamera(senderFacingMode)
    })
  
    
    
  },[])
  
  useEffect(() => {
    setupCamera();
    
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
    

     
    //to be able to turn camera
  }, [facingMode]);
  
  useEffect(()=>{
    if(itemToDownload.type !== "" && itemToDownload.blob !== null){
      const id = generateFilename()
      saveToDBAndBeyond(itemToDownload,id)
    }
  },[itemToDownload])
  
  
  useEffect(()=>{
    setDeviceInfo(prevv => {
      return {
        ...prevv, 
        facingMode : facingMode,
      }
    })
  },[facingMode ])
  
  useEffect(()=>{
    if(isFailed){
      window.location.reload(true)
    }
  },[isFailed])
  

  //
    
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { 
          facingMode : facingMode , 
          width: { ideal: 1920 }, //4096 //1920
          height: { ideal: 1080 } //2160 //1080
      } , audio : true });
        
        
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
        
      let options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm;codecs=vp8' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = { mimeType: 'video/webm' };
              if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                  options = { mimeType: '' };
              }
          }
      }
      const recorder = new MediaRecorder(stream, options );
      let arr = []
      recorder.ondataavailable = (event) => {
        if(event.data.size > 0){
          arr.push(event.data)
        }
      };
      recorder.onstop = () => {
        const videoBlob = new Blob( arr, { type: 'video/webm' });
        setItemToDownload({ type : "video", blob : videoBlob })
        arr = []
      }
      
      mediaRecorderRef.current = recorder;  
        
    } catch (error) {
      setIsFailed(true)
    }
  };
 
  
  const capturePhoto = () => {

    if(videoRef.current){
      
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d').drawImage( videoRef.current, 0, 0, canvas.width, canvas.height)
      
      
      canvas.toBlob( blob => {
        setItemToDownload({ type : "image" , blob : blob })
      })
      
    }
  };

  
  const startRecording2 = () => {
    setIsRecording(true)
    mediaRecorderRef.current.start(10)
  };
  
  const stopRecording2 = () => {
    setIsRecording(false)
    mediaRecorderRef.current.stop()
  };
  
  const turnCamera2 = () => {
    if(facingMode === "user"){
      setFacingMode("environment")
    }else{
      setFacingMode("user")
    }
  }
  
  
  const startRecording = () => {
    mediaRecorderRef.current.start(10)
  };
  
  

    
  const stopRecording = () => {
    mediaRecorderRef.current.stop()
  };
  
  const turnCamera = (senderFacingMode) => {
    if(senderFacingMode === "user"){
      setFacingMode("environment")
    }else{
      setFacingMode("user")
    }
  }
  
  
  const saveToDBAndBeyond = (item,id) => {
    saveToFileDB(item,id)
    if(browserName === "Chrome"){
      let downloadWindow;
      setTimeout(()=> { 
        downloadWindow = window.open(`/download/${id}`, '_blank');
      }, 10)      
    }
    setTimeout(()=>{
      setRefreshItemsCount(prevv => !prevv )
    },20)
  }
  
  const generateFilename = () => {
    const now = new Date();
    const formattedDate = format(now, 'hhmmss-ddMMyyyy');
    return `${formattedDate}`;
  };
  
  //
  return (
    <div className="">
      { !isFailed && (
        <div className="flex items-baseline">
        {/* i don't know why but this hs needed, probably to use canvas.getContext */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <video ref={videoRef} autoPlay muted style={{ width: '10%' }} className={`border-2 border-black rounded ${isHidden ? "hidden":""}`}></video>
        
        


        { !isRecording &&
        <div className="">
          <button className="bg-blue-400 m-1 p-2 rounded shadow border-2 border-black" onClick={turnCamera2}> 
            <IoCameraReverse />
  
          </button>
          <div className="flex justify-center">
            <p className="text-sky-300 text-[10px]">turn</p>
          </div>
        </div>
        }
        <div>
          <button className="bg-blue-400 m-1 p-2 rounded shadow border-2 border-black" onClick={capturePhoto}>
            <MdCamera />
          </button>
          <div className="flex justify-center">
            <p className="text-sky-300 text-[10px]">snap</p>
          </div>
        </div>
        { !isRecording ?
        <div>
          <button className="bg-blue-400 m-1 p-2 rounded shadow border-2 border-black" onClick={startRecording2}>
            <BsFillRecordCircleFill />
          </button>
          <div className="flex justify-center">
            <p className="text-sky-300 text-[10px]">record</p>
          </div>
        </div>
        :
        <div>
          <button className="bg-blue-400 m-1 p-2 rounded shadow border-2 border-black" onClick={stopRecording2}>
            <FaRegStopCircle />
          </button>
          <div className="flex justify-center">
            <p className="text-sky-300 text-[10px]">stop</p>
          </div>
        </div>
        }
        { !isHidden ?
        <div>
          <button className="bg-blue-400 m-1 p-2 rounded shadow border-2 border-black" onClick={()=>setIsHidden(true)}>
            <MdHideImage />
          </button>
          <div className="flex justify-center">
            <p className="text-sky-300 text-[10px]">hide</p>
          </div>
        </div>
        :
        <div>
          <button className="bg-blue-400 m-1 p-2 rounded shadow border-2 border-black" onClick={()=>setIsHidden(false)}> 
            <MdImage />
          </button>
          <div className="flex justify-center">
            <p className="text-sky-300 text-[10px]">show</p>
          </div>
        </div>
        }
        </div>
        
      )}
      
      { isFailed && (
        <div>
          <h2>no access to camera</h2>
        </div>
      )}
     {error && 
        <div>
          <p>____________</p>
          <p>indexedDB Error: {error}</p>
        </div>
      }
    </div>
  );
};

export default Camera;

