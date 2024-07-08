import {Button} from "../../components/ui/button";
import React, {FormEvent, useState} from "react";
import {Input} from "../../components/ui/input";
import {useNavigate} from "react-router-dom";

export default function LicenceRegister() {

  const navigate = useNavigate()
  const [value, setValue] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("등록")
    navigate('/pin/register',{replace:false})
  }

  const handleInputChange = (e) => {
    let inputValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // 대문자와 숫자 외의 문자 제거
    if (inputValue.length > 12) inputValue = inputValue.slice(0, 12); // 최대 12자리 제한

    // 4글자 단위로 하이픈 추가
    const formattedValue = inputValue.match(/.{1,4}/g)?.join('-') || '';

    setValue(formattedValue);
  };

  return (
      <>
        <div className="flex flex-col ">
          <main
              className="flex flex-col m-auto justify-center items-center h-screen ">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <img src={require('../../images/logo.png')} alt={''}
                />
              </div>
            </div>
            <div className="m-4"></div>
            <div className="flex flex-col justify-center items-center">
              <div
                  className="text-[30px] w-[337px] h-[35px] flex justify-center">
                <span className="text-[#9D1F32]">단말기</span>를 활성화 해주세요.
              </div>
              <div className="m-2"></div>
              <div className="text-[13px] text-neutral-500 w-[271px] ">단말기 활성화를
                위해 가입한 아이디와 비밀번호,
              </div>
              <div
                  className="text-[13px] text-neutral-500 w-[271px] h-[30px]">발급받은
                라이선스 등록이 필요합니다.
              </div>
            </div>
            <div className="m-2"></div>
            <form onSubmit={onSubmit}>
              <div>
                <Input type="text" placeholder="아이디"
                       className="w-[280px] h-[34px] rounded-sm"/>
                <div className="m-2"></div>
                <Input type="text" placeholder="비밀번호"
                       className="w-[280px] h-[34px] rounded-sm"/>
                <div className="mt-4"></div>
                <hr/>
                <div className="mt-4"></div>
                <Input type="text" placeholder="라이선스 키"  maxLength="15"  value={value}
                       onChange={handleInputChange}
                       className="w-[280px] h-[34px] rounded-sm"/>
              </div>
              <div className="m-4"></div>
              <div>
                <Button className="w-[280px] h-[34px]"><p
                    className="text-[12px] ">등록</p></Button>
              </div>
              <div className="m-1"></div>
              <p className="text-[10px] text-[#BABABA]">예 ) AKJDK-21-ZSDF1L</p>
              <div className="m-2"></div>
              {/*<p className="text-sm text-red-500">※ 라이선스 키를 확인해주세요.</p>*/}
              <div className="mb-8"></div>
            </form>
          </main>
        </div>
      </>
  )
}