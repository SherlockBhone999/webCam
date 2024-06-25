import HomePage from './pages/forHomePage/HomePage'
import SenderPage from "./pages/forSenderPage/SenderPage"
import ReceiverPage from './pages/forReceiverPage/ReceiverPage'
import SettingPage from './pages/forSettingPage/SettingPage'
import HelpPage from './pages/HelpPage'
import ServerFailedPage from './pages/ServerFailedPage'
import DownloadPage from "./pages/DownloadPage"

import { BrowserRouter, Routes, Route , useParams } from "react-router-dom"

function App() {
  const { id } = useParams()
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/sender" element={<SenderPage />} />
        <Route path="/receiver" element={<ReceiverPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/serverFailed" element={<ServerFailedPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/download/:id" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App