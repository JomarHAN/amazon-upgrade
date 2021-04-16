import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

function ChatBox(props) {
  const { userInfo } = props;
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [msgBody, setMsgBody] = useState("");
  const [messages, setMessages] = useState([
    { name: "Admin", body: "Hello there, please ask your question." },
  ]);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    }
    if (socket) {
      socket.emit("onLogin", {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });

      socket.on("message", (message) => {
        setMessages([
          ...messages,
          { body: message.body, name: message.name, isAdmin: message.isAdmin },
        ]);
      });
    }
  }, [socket, userInfo, messages, isOpen]);

  const supportHandler = () => {
    setIsOpen(true);
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!msgBody.trim()) {
      alert("Error. Please type message.");
    } else {
      setMessages([...messages, { body: msgBody, name: userInfo.name }]);
      setMsgBody("");
      setTimeout(() => {
        socket.emit("onMessage", {
          body: msgBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: userInfo._id,
        });
      }, 1000);
    }
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <div className="chatbox">
      {!isOpen ? (
        <button type="button" onClick={supportHandler}>
          <i className="fa fa-support"></i>
        </button>
      ) : (
        <div className="card card-body">
          <div className="row">
            <strong>Support</strong>
            <button type="button" onClick={closeHandler}>
              <i className="fa fa-close"></i>
            </button>
          </div>
          <ul ref={uiMessagesRef}>
            {messages.map((msg, idx) => (
              <li key={idx} className={msg.isAdmin ? "admin" : ""}>
                <div className="chat-bubble">
                  <strong>{`${msg.name}: `}</strong> {msg.body}
                </div>
              </li>
            ))}
          </ul>
          <div>
            <form onSubmit={submitHandler} className="row">
              <input
                type="text"
                value={msgBody}
                placeholder="type message"
                onChange={(e) => setMsgBody(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
