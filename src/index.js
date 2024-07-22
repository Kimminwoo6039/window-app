import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import App from './App';
import './index.css';
import {Toaster} from "./components/ui/toaster";
import NavigationHandler from "./components/ipcRenderer/NavigationHandler";

/**
 * 메인 / (root)
 * HashRouter => 라우터 연결
 * NavigationHandler => 온라인 연결상태 확인
 * Toaster => Toaster 전역 연결
 * @type {HTMLElement}
 */

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <HashRouter>
        <NavigationHandler/>
        <Toaster/>
        <App/>
    </HashRouter>
);
