import React from "react";

const Payment = () => {
  return (
    <div className="flex flex-col w-full mt-3 items-center">
      <div className="flex w-[70%] h-[50vh] justify-center items-center">
        <div className="w-[65%] "><PaymentInfo/></div>
        <div className="w-[35%]">
          
        </div>
      </div>
    </div>
  );

};

const PaymentInfo=()=>{
    return(
        <div className="w-[100%] bg-white">
            <div className="flex h-[50vh] pt-4 pl-4">
                <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] items-center relative flex justify-center "></div>
                <h3 className="pl-3">Pay with Debit/credit card</h3>
            </div>
        </div>
    )
}
export default Payment;
