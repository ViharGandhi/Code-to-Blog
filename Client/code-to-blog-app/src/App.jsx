import { Route, Routes } from 'react-router-dom'

import CodeToPublicApp from './pages/CodeToPublicApp'
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<CodeToPublicApp/>}/>
    </Routes>
  )
}