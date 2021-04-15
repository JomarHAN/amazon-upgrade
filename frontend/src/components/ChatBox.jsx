import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

function ChatBox({ userInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  const refMessage = useRef(null);
  const [messages, setMessages] = useState([]);
  const [msgBody, setMsgBody] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (refMessage.current) {
      refMessage.current.scrollBy({
        top: refMessage.current.clientHeight,
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
        setMessages([...messages, { body: message.body, name: message.name }]);
      });
    }
  }, [socket, userInfo, messages, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, { body: msgBody, name: userInfo.name }]);
    setMsgBody("");
    setTimeout(() => {
      socket.emit("onMessage", {
        body: msgBody,
        name: userInfo.name,
        _id: userInfo._id,
        isAdmin: userInfo.isAdmin,
      });
    }, 1000);
  };

  const handleOpen = () => {
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="chatbox">
      {!isOpen ? (
        <button type="button" onClick={handleOpen}>
          <i className="fa fa-support"></i>
        </button>
      ) : (
        <div className="card card-body">
          <div className="row">
            <strong>Support</strong>
            <button type="button" onClick={handleClose}>
              <i className="fa fa-close"></i>
            </button>
          </div>
          <ul ref={refMessage}>
            {messages.map((msg, idx) => (
              <li key={idx}>
                <strong>{`${msg.name}: `}</strong> {msg.body}
              </li>
            ))}
          </ul>
          <div>
            <form onSubmit={handleSubmit} className="row">
              <input
                type="text"
                placeholder="Enter Message"
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
              />
              <button type="submit" disabled={msgBody === "" ? true : false}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
