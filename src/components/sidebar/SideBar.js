import React from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import {NavLinkProps} from "react-router-dom";

const NavLink: React.FC<NavLinkProps> = ({ to, iconOn, iconOff, label, isActive }) => (
    <TooltipProvider>
      <Link to={to} className={`rounded-lg w-[100px] h-[67px] ${isActive ? 'bg-[#303439]' : 'bg-[#292D32]'}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-[#303439] w-[80px]" aria-label={label}>
              <img src={isActive ? require(`../../images/${iconOn}`) : require(`../../images/${iconOff}`)} alt="" className="w-[30px] h-[30px] m-auto" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {label}
          </TooltipContent>
          <p className={` ${isActive ? 'text-[#F5F5F5]' : 'text-[#666666]'} text-[12px]`}>{label}</p>
        </Tooltip>
      </Link>
    </TooltipProvider>
);

export default function SideBar({ props, setProps }) {
  const { toast } = useToast();
  let location = useLocation();

  return (
      <aside className="inset-y fixed p-[10px] w-[120px] left-0 z-20 flex h-full flex-col border-r bg-[#25292E]">
        <nav className="grid gap-8">
          <NavLink
              to="/"
              iconOn="Target_light_on.png"
              iconOff="Target_light_off.png"
              label="실시간 탐지"
              isActive={location.pathname === '/'}
          />
          <NavLink
              to="/detection"
              iconOn="Folder_alt_light_on.png"
              iconOff="Folder_alt_light_off.png"
              label="검역소"
              isActive={location.pathname === '/detection'}
          />
        </nav>
        <nav className="mt-auto gap-0 p-1">
          <div className="flex flex-row items-center m-auto w-[100px] h-[30px] justify-center gap-1">
            <p className="text-[12px] w-[60px] text-[#F5F5F5]">실시간 탐지</p>
            {
              props === false
                  ? <img src={require('../../images/Off.png')} alt="" className="cursor-pointer" width="24px" height="12px" onClick={() => {
                    toast({ title: "실시간 탐지를 사용중입니다." });
                    setProps(!props);
                  }} />
                  : <img src={require('../../images/On.png')} alt="" width="24px" className="cursor-pointer" height="24px" onClick={() => {
                    toast({ title: "실시간 탐지가 중단되었습니다." });
                    setProps(!props);
                  }} />
            }
          </div>
          <div className="m-2"></div>
          <div className="flex flex-row">
            <Link to="/information" className={`rounded-lg w-[48px] h-[30px] ${location.pathname === '/information' ? 'bg-[#303439]' : ''}`}>
              <img src={require('../../images/user.png')} alt="" width="48px" height="30px" />
            </Link>
            <Link to="/setting" className={`rounded-lg w-[48px] h-[30px] ${location.pathname === '/setting' ? 'bg-[#303439]' : ''}`}>
              <img src={require('../../images/setting.png')} alt="" width="48px" height="30px" />
            </Link>
          </div>
        </nav>
        <nav className="mb-8"></nav>
      </aside>
  );
}
