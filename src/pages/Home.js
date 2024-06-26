import React from "react";
import {Button} from "../components/ui/button";
import {
  Tooltip, TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../components/ui/tooltip";
import {Link} from "react-router-dom";

interface StatusType {
  props: boolean;
}

export default function Home(status: StatusType) {

  return (
      <>
        <main className="flex flex-col m-auto justify-center items-center ">

          {status.props === true
              ?
              <>
                <img src={require('../images/check.png')} alt={""} width={190}
                     height={190}/>
                <div className="flex flex-col mt-16">
                  <div>
                    <p className="text-4xl text-green-600">실시간
                      탐지를 <strong>사용중</strong> 입니다.</p>
                  </div>
                  <div className="mt-4">
                    <p>
                      실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다.11
                    </p>
                  </div>
                </div>
              </>
              :
              <>
                <img src={require('../images/uncheck.png')} alt={""} width={190}
                     height={190}/>
                <div className="flex flex-col mt-16">
                  <div>
                    <p className="text-4xl text-red-600">실시간
                      탐지를 <strong>중단중</strong> 입니다.</p>
                  </div>
                  <div className="mt-4">
                    <p>
                      실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다.
                    </p>
                  </div>
                </div>
              </>
          }

          <div
              className="fixed bottom-0 max-w-full w-full h-[40px] bg-[#F2F2F2] flex justify-around items-center">
            <div>
              <Button variant="outline" className="h-[30px] hover:bg-white">시스템 공지</Button>
            </div>
            <div><a href="#" className="underline">신규 버전이 업데이트 되었습니다.</a></div>
            <div className="m-4">
              버전: 2024.06.26
              <a href="#" className="m-4 underline">업데이트</a>
            </div>
          </div>
        </main>
      </>
  )
}