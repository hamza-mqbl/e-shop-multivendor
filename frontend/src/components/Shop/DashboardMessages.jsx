import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
// import { format } from "timeago.js";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../styles/styles";

const DashboardMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);
  console.log("🚀 ~ DashboardMessages ~ conversations:", conversations);
  const { seller } = useSelector((state) => state.seller);
  useEffect(() => {
    axios
      .get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversations);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [seller]);

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {/* All messages list */}
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
              />
            ))}
        </>
      )}
      {open && <SellerInbox setOpen={setOpen} />}
    </div>
  );
};

const MessageList = ({ data, index, setOpen }) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };
  const [active, setActive] = useState(0);
  return (
    <div
      className={` w-full p-2 px-3  flex ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer `}
      onClick={(e) => setActive(index) || handleClick(data._id)}
    >
      <div className="relative">
        <img
          src="http://localhost:8000//pro2-1721227668043-138192024.png"
          className=" w-[50px] h-[50px]   rounded-full"
          alt=""
        />
        <div className=" w-[15px] h-[15px] bg-green-400 rounded-full absolute top-[2px] right-[2px]"></div>
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">hamza maqbool</h1>
        <p className="text-[16px] text-[#000c]">You: Yeah I am good</p>
      </div>
    </div>
  );
};
const SellerInbox = ({ setOpen }) => {
  return (
    <div className=" w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src="http://localhost:8000//pro2-1721227668043-138192024.png"
            className=" w-[60px] h-[60px]  rounded-full"
            alt=""
          />
          <div className=" pl-3">
            <h1 className="text-[18px] font-[600]">hamza maqbool</h1>
            <h1>active now</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          className=" cursor-pointer"
          size={30}
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        <div className="flex w-full my-2">
          <img
            src="http://localhost:8000//pro2-1721227668043-138192024.png"
            className=" w-[40px] h-[40px] mr-3  rounded-full"
            alt=""
          />
          <div className="w-max p-2 rounded bg-[#38c776] text-[#fff] h-min">
            <p>hi there this is me hamza maqbool</p>
          </div>
        </div>
        <div className="flex w-full justify-end my-2">
          <div className="w-max p-2 rounded bg-[#38c776] text-[#fff] h-min">
            <p>hello this is me adil</p>
          </div>
        </div>
      </div>

      {/* send message input */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        // onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            // onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};
export default DashboardMessages;
