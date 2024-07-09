import React, {FormEvent} from "react";
import {Button} from "../components/ui/button";
import {useNavigate} from "react-router-dom";

interface StatusType {
  props: boolean;
}

export default function Home(status: StatusType) {
  let navigate = useNavigate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    localStorage.removeItem('loginStatus')
    localStorage.setItem('expiry',true)
    console.log("d")
    navigate('/pin/expiry',{replace:false})
  }

  return (
      <>
        <main className="flex flex-col mt-28 justify-center items-center ">
          {/*<form onSubmit={onSubmit}>*/}
          {/*      <Button>라이센스 만료</Button>*/}
          {/*</form>*/}

          {status.props === true
              ?
              <>
                <img src={require('../images/success.png')} alt={""} width={190}
                     height={190}/>
                <div className="flex flex-col mt-4">
                  <div>
                    <p className="text-[30px] text-[#007A5A]">실시간
                      탐지를 <strong>사용중1</strong>입니다.</p>
                  </div>
                  <div className="mt-1">
                    <p className="text-[13px] text-[#6D6D6D]">
                      실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다.
                    </p>
                  </div>
                </div>
              </>
              :
              <>
                <img src={require('../images/check.png')} alt={""} width={190}
                     height={190}/>
                <div className="flex flex-col mt-4">
                  <div>
                    <p className="text-[30px] text-[#9E1313]">실시간
                      탐지가 <strong>중단1</strong>되었습니다.</p>
                  </div>
                  <div className="mt-1">
                    <p className="text-[13px] text-[#6D6D6D]">
                      실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다.
                    </p>
                  </div>
                </div>
              </>
          }

          <div
              className="fixed bottom-0 max-w-full w-full h-[40px] bg-[#FFFFFF] flex justify-around items-center">
            {/*<div>*/}
            {/*  <Button variant="outline" className="h-[30px] hover:bg-white">시스템 공지</Button>*/}
            {/*</div>*/}
            <div><a href="#" className="text-[12px] text-[#515151] ">신규 버전이 업데이트 되었습니다.</a></div>
            <div className="m-4 text-[12px] text-[#515151] flex gap-3 ">
              <p>Ver .2024.05.07</p>
              <a href="#" className="text-[12px] text-[#515151] flex flex-row gap-1">
                <img alt="" src={require("../images/update_on.png")}
                     width="13px" height="13px"/>
                업데이트</a>
            </div>
          </div>
        </main>
      </>
  )
}
