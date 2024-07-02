import {Button} from "../../components/ui/button";
import React from "react";
import {Input} from "../../components/ui/input";

export default function Licence() {
  return (
      <>
        <main
            className="flex flex-col m-auto justify-center items-center h-screen ">
          <div className="flex flex-row">
            <div>
              <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white w-[120px] h-[120px] "
                  aria-label="Playground"
              >
                <img src={require('../../images/licence.png')} alt={''}
                     className="w-[120px] h-[120px] m-auto "/>
              </Button>
            </div>
            <div>
              <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white w-[120px] h-[120px] "
                  aria-label="Playground"
              >
                <img src={require('../../images/next.png')} alt={''}
                     className="w-[120px] h-[120px] m-auto "/>
              </Button>
            </div>
            <div>
              <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white w-[120px] h-[120px] "
                  aria-label="Playground"
              >
                <img src={require('../../images/pin.png')} alt={''}
                     className="w-[120px] h-[120px] m-auto "/>
              </Button>
            </div>
          </div>
          <div className="m-8"></div>
          <div>
            <div>PIN 번호를 등록해주세요.</div>
            <div className="m-2"></div>
            <div className="text-sm text-neutral-500">암호 대신 사용할 PIN을 등록해주세요.
            </div>
            <div className="text-sm text-neutral-500">PIN은 향후 서비스 관리 시 사용 됩니다.
            </div>
          </div>
          <div className="m-4"></div>
          <div>
            <Input type="text" placeholder="PIN"
                   className="w-[400px] h-[50px]"/>
          </div>
          <div className="m-2"></div>
          <div>
            <Input type="text" placeholder="PIN"
                   className="w-[400px] h-[50px]"/>
          </div>
          <div className="m-2"></div>
          <div>
            <Button className="w-[400px] h-[50px]">PIN 설정</Button>
          </div>
          <div className="m-2"></div>
          <p className="text-sm text-red-500">※ 4자리 이상으로 설정해주세요.</p>
          <p className="text-sm text-red-500">※ PIN이 일치하지 않습니다.</p>
          <div className="mb-8"></div>
        </main>
      </>
  )
}