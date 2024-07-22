import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";


/**
 * 라이센스 만료 페이지
 * @returns {JSX.Element}
 * @constructor
 */
export default function PinExpiry() {
  const navigate = useNavigate();
  const [licenseKey, setLicenseKey] = useState('');

  const handleLicenseKeyChange = (e) => setLicenseKey(e.target.value);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("등록");
    localStorage.removeItem("expiry");
    localStorage.removeItem("loginStatus");
    navigate('/pin/check', { replace: true });
  };

  return (
      <div className="flex flex-col h-screen justify-center items-center">
        <div className="flex flex-col mb-6">
          <img src={require('../../images/logo.png')} alt="Logo" />
        </div>
        <div className="text-center mb-4">
          <h1 className="text-[#9D1F32] text-[30px]">라이선스가 만료되었습니다.</h1>
          <p className="text-[13px] text-neutral-500 mt-2">
            등록된 라이선스가 만료되어 접속할 수 없습니다.
          </p>
          <p className="text-[13px] text-neutral-500">
            라이선스를 발급 받아 등록하시기 바랍니다.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col items-center">
          <Input
              type="text"
              placeholder="라이선스 키"
              value={licenseKey}
              onChange={handleLicenseKeyChange}
              className="w-[280px] h-[34px] rounded-sm mb-4"
          />
          <Button className="w-[280px] h-[34px] rounded-sm">
            <p className="text-[12px]">등록</p>
          </Button>
        </form>
      </div>
  );
}
