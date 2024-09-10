
import { BrowserRouter as Router } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import AppRoutes from './Routes';
import NavBar from './NavBar';
import './App.css'

function App() {
  return (
    <>
      <Router basename='/'>
        <NavBar></NavBar>
        <AppRoutes />
      </Router>
    </>
  )
}

export default App
