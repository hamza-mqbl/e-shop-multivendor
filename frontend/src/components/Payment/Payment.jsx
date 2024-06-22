import React, { useEffect, useState } from "react";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  console.log("🚀 ~ Payment ~ orderData:", orderData);
  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);
  return (
    <div className="flex flex-col w-full mt-3 items-center">
      <div className="flex w-[70%] h-[50vh] justify-center items-center">
        <div className=" w-full 800px:w-[65%] ">
          <PaymentInfo />
        </div>
        <div className=" w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = () => {
  return (
    <div className="w-[100%] bg-white">
      <div className="flex h-[50vh] pt-4 pl-4">
        <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] items-center relative flex justify-center "></div>
        <h3 className="pl-3">Pay with Debit/credit card</h3>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${orderData?.subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${orderData?.shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">${orderData?.discountPrice}</h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">${totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};
export default Payment;
