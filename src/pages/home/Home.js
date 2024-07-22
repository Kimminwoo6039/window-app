import React, { FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * 실시간 탐지 페이지
 * 실시간 탐지 유/무 설정 페이지
 */

interface HomeProps {
  status: boolean;
}

const StatusSection: React.FC<{ status: boolean }> = ({ status }) => (
    <div className="flex flex-col mt-4 items-center">
      <img
          src={status ? require('../../images/success.png') : require('../../images/check.png')}
          alt=""
          width={190}
          height={190}
      />
      <div className="mt-4">
        <p className={`text-[30px] ${status ? 'text-[#007A5A]' : 'text-[#9E1313]'}`}>
          실시간 탐지가 <strong>{status ? '사용중' : '중단'}</strong>되었습니다.
        </p>
        <p className="text-[13px] text-[#6D6D6D] mt-1">
          실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다.
        </p>
      </div>
    </div>
);

export default function Home({ status }: HomeProps) {
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior
    localStorage.removeItem('loginStatus');
    localStorage.setItem('expiry', 'true'); // Ensure that the value is a string
    console.log("등록 완료");
    navigate('/pin/expiry', { replace: false });
  };

  return (
      <main className="flex flex-col mt-28 justify-center items-center">
        <StatusSection status={status} />

        <div className="fixed bottom-0 max-w-full w-full h-[40px] bg-[#FFFFFF] flex justify-around items-center">
          <div>
            <a href="#" className="text-[12px] text-[#515151]">신규 버전이 업데이트 되었습니다.z {status}</a>
          </div>
          <div className="m-4 text-[12px] text-[#515151] flex gap-3">
            <p>Ver .2024.05.07</p>
            <a href="#" className="text-[12px] text-[#515151] flex flex-row gap-1">
              <img
                  alt=""
                  src={require("../../images/update_on.png")}
                  width="13px"
                  height="13px"
              />
              업데이트
            </a>
          </div>
        </div>
      </main>
  );
}
