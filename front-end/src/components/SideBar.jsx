import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'

export default function SideBar () {  
    const navigate = useNavigate()

    const goToHome = () => {
      navigate('/')
    }

    const goToConfig = () => {
        navigate('/config')
    }

    return (
      <div className='side-bar'>
        <div className='button-side-bar'>
          <div id='icon'>
            icon
          </div>
        </div>
        <div className='buttons'>
          <div id='icon'>
            icon
          </div>
          <div id='icon' onClick={goToHome}>
            home
          </div>
          <div id='icon'>
            icon
          </div>
        </div>
        <div className='button-config'>
          <div id='icon' onClick={goToConfig}>
            configurações
          </div>
        </div>
      </div>
    )
  }