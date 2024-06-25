
import React, { useRef , useEffect , useState, useContext} from 'react';
import { Context } from "../../ContextProvider"
import { useIndexedDB } from './indexedDB/useIndexedDB';
import { v4 as uuidv4 } from 'uuid';


const Camera = () => {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isFailed, setIsFailed] = useState(false)
  const canvasRef = useRef(null);
  const [ facingMode, setFacingMode ] = useState("user")
  const [ itemToDownload, setItemToDownload ] = useState({ type : "", blobUrl : "" })

  
  const { saveToFileDB, error } = useIndexedDB();
 
  useEffect(()=>{
    setupCamera();
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
    if(itemToDownload.type !== "" && itemToDownload.blobUrl !== ""){
      const id = uuidv4()
      saveToDBAndBeyond(itemToDownload,id)
    }
  },[itemToDownload])
  
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
        const imgUrl = URL.createObjectURL(blob)
        setItemToDownload({ type : "image" , blobUrl : imgUrl })
      })
      
    }
  };

  
  const startRecording = () => {
      setIsRecording(true)
    if (!videoRef.current) return;
    const stream = videoRef.current.srcObject
    
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
    setVideoChunks(arr)
    recorder.start(100);
    setMediaRecorder(recorder);
  };
  
  
  const stopRecording = () => {
    if (mediaRecorder) {
      
        setIsRecording(false);
        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(videoBlob);
  
      setItemToDownload({ type : "video", blobUrl : url })
      setVideoChunks([]);
      mediaRecorder.stop();
    }
  };
  
  const turnCamera = () => {
    if(facingMode === "user"){
      setFacingMode("environment")
    }else{
      setFacingMode("user")
    }
  }
  
  const saveToDBAndBeyond = (item,id) => {
    saveToFileDB(item,id)
    let downloadWindow;
    setTimeout(()=> { 
      downloadWindow = window.open(`/download/${id}`, '_blank');
    }, 10)      
  }
  
  //
  return (
    <div className="">
      { !isFailed && (
        <div>
        
        <video ref={videoRef} autoPlay muted style={{ width: '5%' }} className=""></video>
        
        {/* i don't know why but this hs needed, probably to use canvas.getContext */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
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

