import React, { useEffect, useRef, useState } from "react";
// import Header from "../components/Layout/Header";
import Header from "../components/layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { backend_url, server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
const ENDPOINT = "http://localhost:4000/";

const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

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
    const getConversation = async () => {
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const sellerId = user?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

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
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    socketId.emit("sendMessage", {
      senderId: user?._id,
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
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: user._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: user._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="bg-bone min-h-screen">
      <Header />
      <div className={`${styles.section} py-8 800px:py-12`}>
        {!open && (
          <>
            <h1 className="font-display text-[28px] font-semibold text-espresso mb-6">
              Messages
            </h1>
            <div className="bg-white border border-sand rounded-2xl shadow-card overflow-hidden divide-y divide-sand">
              {conversations && conversations.length > 0 ? (
                conversations.map((item, index) => (
                  <MessageList
                    data={item}
                    key={index}
                    index={index}
                    setOpen={setOpen}
                    setCurrentChat={setCurrentChat}
                    me={user?._id}
                    setUserData={setUserData}
                    userData={userData}
                    online={onlineCheck(item)}
                    setActiveStatus={setActiveStatus}
                    loading={loading}
                  />
                ))
              ) : (
                <div className="py-16 text-center">
                  <p className="text-espresso font-medium">No messages yet</p>
                  <p className="text-clay text-[14px] mt-1">
                    Start a chat from any product's “Message” button.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {open && (
          <div className="bg-white border border-sand rounded-2xl shadow-card overflow-hidden">
            <SellerInbox
              setOpen={setOpen}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessageHandler={sendMessageHandler}
              messages={messages}
              sellerId={user._id}
              userData={userData}
              activeStatus={activeStatus}
              scrollRef={scrollRef}
              handleImageUpload={handleImageUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  console.log("🚀 ~ user:", user.avatar);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={`w-full flex items-center gap-3 p-4 ${
        active === index ? "bg-bone" : "hover:bg-bone"
      } cursor-pointer transition-colors`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative shrink-0">
        <img
          src={user?.avatar?.url || `${backend_url}/${user?.avatar}`}
          alt=""
          className="w-[48px] h-[48px] rounded-full object-cover border border-sand"
        />
        <span
          className={`w-[12px] h-[12px] rounded-full absolute top-0 right-0 border-2 border-white ${
            online ? "bg-green-500" : "bg-clay"
          }`}
        />
      </div>
      <div className="min-w-0">
        <h1 className="font-display font-medium text-espresso truncate">
          {user?.name}
        </h1>
        <p className="text-[14px] text-clay truncate">
          {!loading && data?.lastMessageId !== userData?._id
            ? "You: "
            : userData?.name?.split(" ")[0] + ": "}
          {data?.lastMessage}
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
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="w-full h-[78vh] flex flex-col">
      {/* chat header */}
      <div className="w-full flex p-4 items-center justify-between border-b border-sand bg-white">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={userData?.avatar?.url || `${backend_url}/${userData?.avatar}`}
              alt=""
              className="w-[48px] h-[48px] rounded-full object-cover border border-sand"
            />
            <span
              className={`w-[11px] h-[11px] rounded-full absolute bottom-0 right-0 border-2 border-white ${
                activeStatus ? "bg-green-500" : "bg-clay"
              }`}
            />
          </div>
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
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-bone transition-colors"
          title="Back to messages"
        >
          <AiOutlineArrowRight size={20} className="text-espresso" />
        </button>
      </div>

      {/* messages */}
      <div className="px-4 flex-1 py-4 overflow-y-auto bg-bone">
        {messages &&
          messages.map((item, index) => {
            const mine = item.sender === sellerId;
            return (
              <div
                key={index}
                className={`flex w-full my-2 items-end ${
                  mine ? "justify-end" : "justify-start"
                }`}
                ref={scrollRef}
              >
                {!mine && (
                  <img
                    src={
                      userData?.avatar?.url ||
                      `${backend_url}/${userData?.avatar}`
                    }
                    className="w-[34px] h-[34px] rounded-full mr-2 object-cover border border-sand"
                    alt=""
                  />
                )}
                <div className={mine ? "items-end" : ""}>
                  {item.images && (
                    <img
                      src={`${item.images?.url}`}
                      className="w-[240px] h-[240px] object-cover rounded-xl mb-1"
                      alt=""
                    />
                  )}
                  {item.text !== "" && (
                    <>
                      <div
                        className={`w-max max-w-[420px] px-3 py-2 text-[14px] ${
                          mine
                            ? "bg-espresso text-bone rounded-2xl rounded-br-sm"
                            : "bg-white text-espresso border border-sand rounded-2xl rounded-bl-sm"
                        }`}
                      >
                        <p className="break-words">{item.text}</p>
                      </div>
                      <p
                        className={`text-[11px] text-clay pt-1 ${
                          mine ? "text-right" : "text-left"
                        }`}
                      >
                        {format(item.createdAt)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* composer */}
      <form
        aria-required={true}
        className="p-3 w-full flex items-center gap-3 border-t border-sand bg-white"
        onSubmit={sendMessageHandler}
      >
        <input
          type="file"
          id="image"
          className="hidden"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="image"
          className="w-10 h-10 rounded-full flex items-center justify-center text-espresso hover:bg-bone cursor-pointer shrink-0 transition-colors"
        >
          <TfiGallery size={18} />
        </label>
        <input
          type="text"
          required
          placeholder="Type a message…"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 h-[44px] px-4 bg-bone border border-sand focus:border-marigold rounded-full transition-colors"
        />
        <button
          type="submit"
          className="w-11 h-11 rounded-full bg-marigold hover:bg-marigold-dark flex items-center justify-center shrink-0 transition-colors"
          title="Send"
        >
          <AiOutlineSend size={18} className="text-espresso" />
        </button>
      </form>
    </div>
  );
};

export default UserInbox;
