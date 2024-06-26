import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import SideBar from "./pages/SideBar";
import {useState} from "react";

function App() {

  const [status, setStatus] = useState(false)

  return (
      <BrowserRouter>
        <div className="App">
          <div className="grid h-screen w-full pl-[126px]">
            <SideBar props={status} setProps={setStatus}/>
            <div className="flex flex-col">
              <Routes>
                <Route path='/' element={<Home props={status} />}/>
                <Route path='/new' element={<New/>}/>
                <Route path='/edit/:id' element={<Edit/>}/>
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;
