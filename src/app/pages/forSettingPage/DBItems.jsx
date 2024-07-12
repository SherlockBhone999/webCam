import { useIndexedDB } from '../forSenderPage/indexedDB/useIndexedDB';
import { Context } from "../../ContextProvider"
import { useContext} from "react"

import { FaFileDownload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


const Item = ({id}) => {
  const { getAllIds, deleteItemInDB } = useIndexedDB()
  const { keys, setRefreshItemsCount} = useContext(Context)
  
  const del = () => {
    deleteItemInDB(id)
    setRefreshItemsCount(prevv => !prevv)
  }
  
  const download = () => {
    window.open(`/download/${id}`, '_blank');
  }
  return (
    <div className="flex">
      <p className="ml-6 p-2 pr-1">{id.slice(0,6)}...</p>

      <button className="bg-green-400 p-2 m-1 rounded" onClick={download} >
        <FaFileDownload />
      </button>
      
      <button className="bg-red-600 p-2 m-1 rounded" onClick={del} >
        <MdDelete />
      </button>
      
    </div>
  )
}

export default function App () {
  const { keys } = useContext(Context)
  
  return (
    <div>
      {keys.map(id => 
        <Item 
          id={id}
        />
      )}
    </div>
  )
}