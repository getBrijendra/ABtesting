import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

const url = 'http://localhost:4000/layout'

function App() {
  const [count, setCount] = useState(0)
  const [layout, setLayout] = useState('NO Layout')

  useEffect(() => {
      const getLayout = async () => {
        let  res =  await axios.get(url)
        console.log(res)
        setLayout(res.data.result || 'NO Layout')
      }
      getLayout()
    }
  , [])
  


  return (
    <>
      <p>{layout}</p>
    </>
  )
}

export default App
