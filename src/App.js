import './App.css';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import New from './pages/New';
import SideBar from './pages/SideBar';
import {useState} from 'react';
import Information from "./pages/Information";
import Setting from "./pages/Setting";
import Licence from "./pages/licence/Licence";

function App() {
  const [status, setStatus] = useState(false);
  let result = Number(1)

  return (
      <>
        {result === 0
            ?
            <div className="App">
              <div className="grid h-screen w-full pl-[126px]">
                <SideBar props={status} setProps={setStatus}/>
                <div className="flex flex-col m-4">
                  <Routes>
                    <Route path='/' element={<Home props={status}/>}/>
                    <Route path='/new' element={<New/>}/>
                    <Route path='/information' element={<Information/>}/>
                    <Route path='/setting' element={<Setting/>}/>
                  </Routes>
                </div>
              </div>
            </div>
            :
            <div className="App">
                  <Routes>
                    <Route path='/' element={<Licence />}/>
                    <Route path='/new' element={<New/>}/>
                    <Route path='/information' element={<Information/>}/>
                    <Route path='/setting' element={<Setting/>}/>
                  </Routes>
            </div>
        }
      </>
  );
}

export default App;
