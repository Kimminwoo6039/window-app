import './App.css';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import New from './pages/New';
import SideBar from './pages/SideBar';
import {useEffect, useState} from 'react';
import Information from "./pages/Information";
import Setting from "./pages/Setting";
import LicenceRegister from "./pages/licence/LicenceRegister";
import PinRegister from "./pages/pin/PinRegister";
import PinCheck from "./pages/pin/PinCheck";
import PinExpiry from "./pages/pin/PinExpiry";
import {NetworkStatusProvider} from "./components/NetworkStatus";

function App() {
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();
  // let result = Number(0)
  const [activation, SetActivation] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [expiry , setExpiry] = useState(false)

  useEffect(() => {
    let active = localStorage.getItem("activation")
    let loginStatus = localStorage.getItem("loginStatus");
    let expiration = localStorage.getItem("expiry");

    setExpiry(true)

    if (active) {
      SetActivation(true)
    } else {
      SetActivation(false)
    }

    if (loginStatus) {
      setLoginStatus(true)
    } else {
      setLoginStatus(false)
    }

    if (expiration) {
      setExpiry(true)
    } else {
      setExpiry(false)
    }

  }, [navigate]);

  return (
      <NetworkStatusProvider>
      <>
        {
          activation === true
              ?
              <>
                {
                  loginStatus === true
                      ?
                      <div className="App">
                        <div className=" grid h-screen w-full pl-[126px]">
                          <SideBar props={status} setProps={setStatus}/>
                          <div className="flex flex-col m-4">
                            <Routes>
                              <Route path='/' element={<Home props={status}/>}/>
                              <Route path='/new' element={<New/>}/>
                              <Route path='/information'
                                     element={<Information/>}/>
                              <Route path='/setting' element={<Setting/>}/>
                              <Route path='/pin/check' element={<PinCheck/>}/>
                            </Routes>
                          </div>
                        </div>
                      </div>
                      :
                      <>
                        {
                          expiry === true
                              ?
                              <div className="App">
                                <Routes>
                                  <Route path='/' element={<PinExpiry />}/>
                                  <Route path='/pin/check'
                                         element={<PinCheck/>}/>
                                  <Route path='/pin/expiry'
                                         element={<PinExpiry/>}/>
                                </Routes>
                              </div>
                              :
                              <div className="App">
                                <Routes>
                                  <Route path='/' element={<PinCheck/>}/>
                                  <Route path='/pin/check'
                                         element={<PinCheck/>}/>
                                  <Route path='/pin/expiry'
                                         element={<PinExpiry/>}/>
                                </Routes>
                              </div>
                        }
                      </>
                }
              </>
              :
              <div className="App">
                <Routes>
                  <Route path='/' element={<LicenceRegister/>}/>
                  <Route path='/pin/register' element={<PinRegister/>}/>
                  <Route path='/pin/check' element={<PinCheck/>}/>
                  <Route path='/pin/expiry' element={<PinExpiry/>}/>
                </Routes>
              </div>
        }
      </>
      </NetworkStatusProvider>
  )
      ;
}

export default App;
