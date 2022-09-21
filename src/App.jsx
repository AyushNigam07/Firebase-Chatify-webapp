import HomePage from './Components/HomePage'
import {BrowserRouter , useNavigate , Routes , Route} from 'react-router-dom'
import MainPage from './Components/MainPage'
import "./main.css"
import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
function App() {
  const nav = useNavigate();
  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth , (user) => {
      if(user){ nav("/MainContent")}
      else {
        nav("/")
      }
    })
  },[])
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/MainContent' element={<MainPage/>}/>
    </Routes>
    </>
  )
}

export default App
