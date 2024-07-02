import { useIndexedDB } from '../forSenderPage/indexedDB/useIndexedDB';

import { useState, useEffect } from "react"


const Item = ({id, setRefreshList}) => {
  const { getAllIds, deleteItemInDB, keys } = useIndexedDB()
  
  
  const del = () => {
    deleteItemInDB(id)
    setRefreshList(prevv => !prevv )
  }
  
  const download = () => {
    window.open(`/download/${id}`, '_blank');
  }
  return (
    <div className="flex">
      <p>{id.slice(0,6)}...</p>
      <button className="bg-red-600 p-2 m-1" onClick={del} >Delete</button>
      <button className="bg-green-400 p-2 m-1" onClick={download} >Download</button>
    </div>
  )
}

export default function App () {
  const { getAllIds, keys } = useIndexedDB()
  const [refreshList, setRefreshList] = useState(false)
  
  useEffect(()=>{
    getAllIds()
  },[refreshList])
  
  return (
    <div>
      {keys.map(id => 
        <Item 
          id={id} 
          setRefreshList={setRefreshList}
        />
      )}
    </div>
  )
}