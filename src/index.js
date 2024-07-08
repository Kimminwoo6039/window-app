import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter, useNavigate} from 'react-router-dom';
import App from './App';
import './index.css';
import {Toaster} from "./components/ui/toaster";

const NavigationHandler = () => {
  const navigate = useNavigate();
  let active = localStorage.getItem("activation")
  let expiration = localStorage.getItem("expiry");

  useEffect(() => {
    if (window.electron && window.electron.onLocalStorage) {
      window.electron.onRemoveStr()
      console.log('Setting up navigation handler in React');
      window.electron.onLocalStorage((event, path) => {
        console.log('Navigating to:', path);
        localStorage.removeItem(path)
      });
    } else {
      console.log(
          'window.electron or window.electron.onNavigate is not defined in React');
    }

    if (window.electron && window.electron.onNavigate) {
      console.log('Setting up navigation handler in React');
      window.electron.onNavigate((event, path) => {
        console.log('Navigating to:', path);
        
        // 라이선스 등록 안되있을때 라이선스 등록페이지로 이동
        if (active) {
          navigate(path);
        } else {
          navigate('/')
        }
      });
    } else {
      console.log(
          'window.electron or window.electron.onNavigate is not defined in React');
    }


  }, [navigate]);

  return null;
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <HashRouter>
      <NavigationHandler/>
      <Toaster/>
      <App/>
    </HashRouter>
);
