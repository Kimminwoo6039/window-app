import './App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { NetworkStatusProvider } from './components/network/NetworkStatus';
import AppLayout from "./components/layout/AppLayout";
import AuthRoutes from "./components/layout/AuthRoutes";
import NonAuthRoutes from "./components/layout/NonAuthRoutes";

/**
 * App.js 에서 현재 상태에 따른 페이지 이동
 *
 * status = > 탐지 사용,미사용 상태
 * activation => 라이선스 등록 유/무 상태
 * loginStatus => 로그인 여부 유/무 상태
 * expiry => 라이선스 만료 유/무 상태
 *
 * @returns {JSX.Element}
 * @constructor
 */

function App() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(true);
  const [activation, SetActivation] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [expiry, setExpiry] = useState(false);

  useEffect(() => {
    const active = localStorage.getItem("activation");
    const loginStatus = localStorage.getItem("loginStatus");
    const expiration = localStorage.getItem("expiry");

    SetActivation(Boolean(active));
    setLoginStatus(Boolean(loginStatus));
    setExpiry(Boolean(expiration));
  }, [navigate]);

  return (
      <NetworkStatusProvider>
        {activation ? (
            loginStatus ? (
                <AppLayout status={status} setStatus={setStatus} />
            ) : (
                <AuthRoutes expiry={expiry} />
            )
        ) : (
            <NonAuthRoutes />
        )}
      </NetworkStatusProvider>
  );
}

export default App;
