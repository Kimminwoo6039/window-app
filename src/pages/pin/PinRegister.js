import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FormButton from "../../components/common/FormButton";
import FormInput from "../../components/common/FormInput";

/**
 * 핀 등록하는 페이지 > 라이선스 등록후
 * @returns {JSX.Element}
 * @constructor
 */
export default function PinRegister() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handlePinChange = (e) => setPin(e.target.value);
  const handleConfirmPinChange = (e) => setConfirmPin(e.target.value);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pin === confirmPin) {
      console.log("등록");
      localStorage.setItem("activation", "true");
      navigate('/pin/check', { replace: false });
    } else {
      console.error("PIN이 일치하지 않습니다.");
      // You may want to show an error message to the user here
    }
  };

  return (
      <div className="flex flex-col h-screen justify-center items-center">
        <img src={require('../../images/logo.png')} alt="Logo" className="mb-4" />
        <div className="text-center mb-4">
          <h1 className="text-[#9D1F32] text-[30px]">PIN 번호를 등록해 주세요.</h1>
          <p className="text-[13px] text-neutral-500 mt-2">암호 대신 사용할 PIN 번호를 등록해주세요.</p>
          <p className="text-[13px] text-neutral-500">PIN 번호는 향후 서비스 관리 시 사용됩니다.</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col items-center">
          <FormInput
              type="text"
              placeholder="PIN (4자리 이상 숫자)"
              value={pin}
              onChange={handlePinChange}
              className="w-[280px] h-[34px] rounded-sm mb-2"
          />
          <FormInput
              type="text"
              placeholder="PIN 확인"
              value={confirmPin}
              onChange={handleConfirmPinChange}
              className="w-[280px] h-[34px] rounded-sm mb-4"
          />
          <FormButton className="w-[280px] h-[34px]">
            <p className="text-[12px]">PIN 설정</p>
          </FormButton>
        </form>
      </div>
  );
}
