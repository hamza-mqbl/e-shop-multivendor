import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
// import { format } from "timeago.js";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../styles/styles";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
const ENDPOINT = "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUser, setOnlineUser] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const scrollRef = useRef(null);
  // console.log("🚀 ~ DashboardMessages ~ onlineUser:", onlineUser);

  const [open, setOpen] = useState(false);
  // console.log("🚀 ~ DashboardMessages ~ conversations:", conversations);
  const { seller } = useSelector((state) => state.seller);
  // console.log("🚀 ~ DashboardMessages ~ messages:", currentChat);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    axios
      .get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversations);
      })
      .catch((error) => {
      });
  }, [seller]);
  useEffect(() => {
    if (seller) {
      const userId = seller?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUser(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller._id);

    if (onlineUser.length > 0) {
    }

    const online = onlineUser.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
      }
    };
    getMessage();
  }, [currentChat]);
  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
          });
      }
    } catch (error) {
    }
  };
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
      });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {/* All messages list */}
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-display">
            All Messages
          </h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller._id}
                userData={userData}
                setUserData={setUserData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  userData,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={` w-full p-2 px-3  flex ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer `}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        <img
          src={`${backend_url}/${user?.avatar}`}
          className=" w-[50px] h-[50px]   rounded-full"
          alt=""
        />
        {online ? (
          <div className=" w-[15px] h-[15px] bg-green-400 rounded-full absolute top-[2px] right-[2px]"></div>
        ) : (
          <div className=" w-[15px] h-[15px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]"></div>
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {data?.lastMessageId !== user?._id
            ? "You"
            : user?.name.split("  ") + ": "}
          : {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};
const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
}) => {
  return (
    <div className=" w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex p-4 items-center justify-between bg-white border-b border-sand">
        <div className="flex items-center">
          <img
            src={userData?.avatar?.url || `${backend_url}/${userData?.avatar}`}
            className="w-[48px] h-[48px] rounded-full object-cover border border-sand"
            alt=""
          />
          <div className="pl-3">
            <h1 className="text-[16px] font-display font-semibold text-espresso">
              {userData?.name}
            </h1>
            <p
              className={`text-[12px] ${
                activeStatus ? "text-green-600" : "text-clay"
              }`}
            >
              {activeStatus ? "Active now" : "Offline"}
            </p>
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
        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
            >
              {item.sender !== sellerId && (
                <img
                  src={
                    userData?.avatar?.url ||
                    `${backend_url}/${userData?.avatar}`
                  }
                  className="w-[34px] h-[34px] mr-2 rounded-full object-cover border border-sand self-end"
                  alt=""
                />
              )}
              <div
                className={`w-max max-w-[420px] px-3 py-2 text-[14px] ${
                  item.sender === sellerId
                    ? "bg-espresso text-bone rounded-2xl rounded-br-sm"
                    : "bg-white text-espresso border border-sand rounded-2xl rounded-bl-sm"
                }`}
              >
                <p className="break-words">{item.text}</p>
              </div>
              <p className="text-[11px] text-clay self-end ml-2">
                {format(item.createdAt)}
              </p>
            </div>
          ))}
      </div>

      {/* send message input */}
      <form
        // aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
