import React, { useState, useEffect } from "react";
import { Chat } from "../components/Chat.jsx";
import { ButtonAddChat } from "../components/ButtonAddChat.jsx";
import { ChatList } from "../components/ChatList.jsx";
import { Modal } from "../components/modals/Modal.jsx";
import { UserData } from "../components/UserData.jsx";
import cn from "classnames";
import { useSelector } from "react-redux";
import { ReplyContext } from "../contexts/index.js";

function ChatPage() {
  const { currentChat } = useSelector((state) => state.chat);
  const [reply, setReply] = useState(null);
  const [isMobile, setIsMobile] = useState(document.documentElement.scrollWidth <= 768);

  useEffect(() => {
    window.onresize = () => {
      setIsMobile(document.documentElement.scrollWidth <= 768);
    };
    
    return () => {
      window.onresize = null
    };
}, []);

  const user = useSelector((state) => state.user);
  const outterClassnames = cn(
    "container chat-page__inner my-4 overflow-hidden",
    {
      rounded: currentChat,
    }
  );

  const innerClassnames = cn(
    "col-4 chat-side border-end px-0 bg-light left-panel",
    {
      rounded: !currentChat,
    }
  );

  const replyCtxValue = {
    reply,
    setReply,
  };

  return (
    <ReplyContext.Provider value={replyCtxValue}>
      <div className="chat-page">
        <div className={outterClassnames}>
          {isMobile ? (
            <div className="row h-100 flex-md-row flex-nowrap">
              {!currentChat ? (
                <div className={innerClassnames}>
                  <UserData user={user} position="start" />
                  <div className="d-flex justify-content-between channels">
                    <span>Каналы</span>
                    <ButtonAddChat />
                  </div>
                  <ChatList />
                </div>
              ) : (
                <Chat />
              )}
            </div>
          ) : (
            <div className="row h-100 flex-md-row flex-nowrap">
              <div className={innerClassnames}>
                <UserData user={user} position="start" />
                <div className="d-flex justify-content-between channels">
                  <span>Каналы</span>
                  <ButtonAddChat />
                </div>
                <ChatList />
              </div>
              <Chat />
            </div>
          )}
        </div>
        <Modal />
      </div>
    </ReplyContext.Provider>
  );
}

export default ChatPage;
