// components/ConfirmationDialog.jsx
import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog";
import {Button} from "../ui/button";

const ConfirmationDialog = ({ triggerText, title, description, onConfirm }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-sm w-[110px] h-[34px] bg-[#9E1313]">
                    <p className="text-[12px] text-[#FFFFFF]">{triggerText}</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[400px] h-[250px] bg-[#F1F1F1]">
                <form onSubmit={onConfirm}>
                    <DialogHeader className="bg-[#25292E] h-[40px] flex p-3">
                        <DialogTitle className="text-[14px] text-[#9D1F32] font-bold">{title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col ml-8 mt-5 ">
                        <span className="text-[20px] mt-3">{title}</span>
                    </div>
                    <div className="flex flex-col ml-8 mt-3">
                        <div className="text-[13px] text-[#404040]">{description}</div>
                    </div>
                    <div className="m-6"></div>
                    <div className="flex flex-row justify-center">
                        <DialogFooter>
                            <Button className="w-[168px] h-[34px] rounded-sm" type="submit">
                                <p className="text-[12px] text-[#FFFFFF]">해제</p>
                            </Button>
                            <DialogClose>
                                <Button type="button" className="w-[168px] h-[34px] rounded-sm bg-[#444444]">
                                    <p className="text-[12px] text-[#FFFFFF]">취소</p>
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationDialog;
