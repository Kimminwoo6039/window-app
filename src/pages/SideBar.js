import {Button} from "../components/ui/button";
import {Bot, Image, SquareTerminal,} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../components/ui/tooltip";
import {Link, useLocation} from "react-router-dom";
import React from "react";
import {Label} from "../components/ui/label";
import {useToast} from "../components/ui/use-toast";

interface StatusType {
  props: boolean;
  setProps: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideBar(status: StatusType) {
  const {toast} = useToast()
  let location = useLocation();

  return (
      <>
        <aside
            className="inset-y fixed w-[130px] left-0 z-20 flex h-full flex-col border-r bg-gray-100">
          <nav className="grid gap-8 p-4">
            <TooltipProvider>
              <Link to={'/'}
                    className={`rounded-lg w-[100px] h-[110px] p-1 ${location.pathname
                    === '/' && 'bg-neutral-300'} `}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-neutral-300 w-[80px] h-[80px] "
                        aria-label="Playground"
                    >
                      <img src={require('../images/watch.png')} alt={''} className="w-[50px] h-[50px] m-auto " />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    실시간 탐지
                  </TooltipContent>
                  <p className="text-sm">실시간 탐지</p>
                </Tooltip>
              </Link>
            </TooltipProvider>
            <TooltipProvider>
              <Link to={'/new'}
                    className={`rounded-lg w-[100px] h-[120px] p-1 ${location.pathname
                    === '/new' && 'bg-neutral-300'} `}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button

                        variant="ghost"
                        size="icon"
                        className="hover:bg-neutral-300 w-[80px] h-[80px] "
                        aria-label="Models"
                    >
                      <img src={require('../images/mask.png')} alt={''} className="w-[80px] h-[50px] m-auto "/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    검역소
                  </TooltipContent>
                  <p className="text-sm">검역소</p>
                </Tooltip>
              </Link>
            </TooltipProvider>
          </nav>
          <nav className="mt-auto gap-4 p-1">
            <div className="flex flex-row items-center m-auto">
              <Button variant="outline" className="h-[30px] w-[75px] hover:bg-white">실시간 탐지</Button>
              {/*<Label htmlFor="airplane-mode" className="">실시간탐지</Label>*/}
              {
                status.props === false
                    ?
                    <Button
                        variant="outline"
                        className="w-[50px] h-[30px] bg-red-500 hover:bg-neutral-500"
                        onClick={() => {
                          toast({
                            title: "실시간 탐지를 사용중입니다. ",
                            description: "실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다.",
                          })
                          status.setProps(!status.props)
                        }}
                    >
                      <p className="text-lg mb-1">off</p>
                    </Button>
                    :
                    <Button
                        variant="outline"
                        className="w-[50px] h-[30px] bg-green-500 hover:bg-neutral-500"
                        onClick={() => {
                          toast({
                            title: "실시간 탐지를 중단중입니다.",
                            variant: "destructive",
                            description: "실시간 탐지기능을 통해 유해물로부터 자녀의 올바른 사용 습관을 만들어 주고 있습니다. ",
                          })
                          status.setProps(!status.props)
                        }}
                    >
                      <p className="text-lg mb-1">on</p>
                    </Button>
              }
            </div>
            <div className="flex flex-row gap-1">
              <Link to={'/information'}>
              <Button className="bg-white border-1 hover:bg-neutral-500">
                <p className="text-black">정보</p>
              </Button>
              </Link>
              <Link to={'/setting'}>
              <Button className="bg-white border-1 hover:bg-neutral-500">
                <p className="text-black">설정</p>
              </Button>
              </Link>
            </div>
          </nav>
          <nav className="mb-14">

          </nav>
        </aside>
      </>
  )
}