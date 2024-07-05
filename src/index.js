import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter, useNavigate} from 'react-router-dom';
import App from './App';
import './index.css';
import {Toaster} from "./components/ui/toaster";

const NavigationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.electron && window.electron.onLocalStorage) {
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
        navigate(path);
      });
    } else {
      console.log(
          'window.electron or window.electron.onNavigate is not defined in React');
    }

    return () => {
      console.log("음")
      window.electron.remove();
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
