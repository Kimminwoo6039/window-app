import {Button} from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../components/ui/tooltip";
import {Link, useLocation} from "react-router-dom";
import React from "react";
import {useToast} from "../components/ui/use-toast";

interface StatusType {
  props: boolean;
  setProps: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideBar(status: StatusType) {
  const {toast} = useToast()
  let location = useLocation();
  // bg-[#3E0D42] bg-[#6E2C76] bg-[#4A154B]
  return (
      <>
        <aside
            className="inset-y fixed p-[10px] w-[120px] left-0 z-20 flex h-full flex-col border-r bg-[#25292E]">
          <nav className="grid gap-8">
            <TooltipProvider>
              <Link to={'/'}
                    className={`rounded-lg w-[100px] h-[67px]  ${location.pathname
                    === '/' ? 'bg-[#303439]' : 'bg-[#292D32]'} `}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-[#303439] w-[80px] "
                        aria-label="Playground"
                    >
                      <img src={ location.pathname === '/' ? require('../images/Target_light_on.png') : require('../images/Target_light_off.png')} alt={''}
                           className="w-[30px] h-[30px] m-auto "/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    실시간 탐지
                  </TooltipContent>
                  <p className={` ${location.pathname === '/' ?  'text-[#F5F5F5]' : 'text-[#666666]'} text-[12px]`}>실시간 탐지</p>
                </Tooltip>
              </Link>
            </TooltipProvider>
            <TooltipProvider>
              <Link to={'/new'}
                    className={`rounded-lg w-[100px] h-[67px]  ${location.pathname
                    === '/new' ? 'bg-[#303439]' : 'bg-[#292D32]'} `}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-[#303439] w-[80px] "
                        aria-label="Models"
                    >
                      <img src={location.pathname === '/new' ? require('../images/Folder_alt_light_on.png') : require('../images/Folder_alt_light_off.png')} alt={''}
                           className="w-[30px] h-[30px] m-auto "/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    검역소
                  </TooltipContent>
                  <p className={` ${location.pathname === '/new' ?  'text-[#F5F5F5]' : 'text-[#666666]'} text-[12px]`}>검역소</p>
                </Tooltip>
              </Link>
            </TooltipProvider>
          </nav>
          <nav className="mt-auto gap-0 p-1">
            <div className="flex flex-row items-center m-auto w-[100px] h-[30px] justify-center gap-1">
              <p className="text-[12px] w-[60px] text-[#F5F5F5]">실시간 탐지</p>
              {/*<Label htmlFor="airplane-mode" className="">실시간탐지</Label>*/}
              {
                status.props === false
                    ?
                    <>
                      <img src={require('../images/Off.png')} alt="" className="cursor-pointer"
                           width="24px" height="12px" onClick={() => {
                        toast({
                          title: "실시간 탐지를 사용중입니다. ",
                          // description: "실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다.",
                        })
                        status.setProps(!status.props)
                      }}/>
                    </>
                    :
                    <>
                      <img src={require('../images/On.png')} alt="" width="24px" className="cursor-pointer"
                           height="24px" onClick={() => {
                        toast({
                          title: "실시간 탐지가 중단되었습니다. ",
                          // description: "실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다.",
                        })
                        status.setProps(!status.props)
                      }}/>
                    </>
              }
            </div>
            <div className="m-2"></div>
            <div className="flex flex-row">
              <Link to={'/information'}
                    className={`rounded-lg w-[48px] h-[30px]  ${location.pathname
                    === '/information' ? 'bg-[#303439]' : ''} `}>
                <img src={require('../images/user.png')} alt="" width="48px"
                     height="30px"/>
              </Link>
              <Link to={'/setting'} className={`rounded-lg w-[48px] h-[30px]  ${location.pathname === '/setting' ? 'bg-[#303439]' : ''} `}>
                <img src={require('../images/setting.png')} alt="" width="48px" height="30px"/>
              </Link>
            </div>
          </nav>
          <nav className="mb-8"></nav>
        </aside>
      </>
  )
}