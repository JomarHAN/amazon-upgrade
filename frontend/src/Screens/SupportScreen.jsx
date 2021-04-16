import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MessageBox from "../components/MessageBox";
import socketIOClient from "socket.io-client";

let allUsers = [];
let allMessages = [];
let allSelectedUser = {};
const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

function SupportScreen() {
  const { userInfo } = useSelector((state) => state.userSignin);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const refMessageAdmin = useRef(null);
  const [messages, setMessages] = useState([]);
  const [msgBody, setMsgBody] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (refMessageAdmin.current) {
      refMessageAdmin.current.scrollBy({
        top: refMessageAdmin.current.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    }
    if (!socket) {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
      sk.emit("onLogin", {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });

      sk.on("updateUser", (updateUser) => {
        const existUser = allUsers.find((x) => x._id === updateUser._id);
        if (existUser) {
          allUsers.map((user) =>
            user._id === existUser._id ? updateUser : user
          );
          setUsers(allUsers);
        } else {
          allUsers = [...allUsers, updateUser];
          setUsers(allUsers);
        }
      });

      sk.on("message", (data) => {
        if (allSelectedUser._id === data._id) {
          allMessages = [...allMessages, data];
        } else {
          const existUser = allUsers.find((user) => user._id === data._id);
          if (existUser) {
            allUsers = allUsers.map((user) =>
              user._id === existUser._id ? { ...user, unread: true } : user
            );
            setUsers(allUsers);
          }
        }
        setMessages(allMessages);
      });
      sk.on("updateUser", (updateUser) => {
        const existUser = allUsers.find((user) => user._id === updateUser._id);
        if (existUser) {
          allUsers = allUsers.map((user) =>
            user._id === existUser._id ? updateUser : user
          );
          setUsers(allUsers);
        } else {
          allUsers = [...allUsers, updateUser];
          setUsers(allUsers);
        }
      });
      sk.on("listUsers", (updateUsers) => {
        allUsers = updateUsers;
        setUsers(allUsers);
      });
      sk.on("selectUser", (user) => {
        allMessages = user.messages;
        setMessages(allMessages);
      });
    }
  }, [messages, socket, users, userInfo]);

  const selectUser = (user) => {
    allSelectedUser = user;
    setSelectedUser(allSelectedUser);
    const existUser = allUsers.find((x) => x._id === user._id);
    if (existUser) {
      allUsers.map((x) =>
        x._id === existUser._id ? { ...x, unread: false } : x
      );
      setUsers(allUsers);
    }
    socket.emit("onUserSelected", user);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    allMessages = [
      ...allMessages,
      {
        body: msgBody,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
        _id: selectedUser._id,
      },
    ];
    setMessages(allMessages);
    setMsgBody("");
    setTimeout(() => {
      socket.emit("onMessage", {
        body: msgBody,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
        _id: selectedUser._id,
      });
    }, 1000);
  };
  return (
    <div className="row top full-container">
      <div className="col-1 support-users">
        {users.filter((x) => x._id !== userInfo._id).length === 0 && (
          <MessageBox>No Online User Found</MessageBox>
        )}
        <ul>
          {users
            .filter((x) => x._id !== userInfo._id)
            .map((user) => (
              <li
                key={user._id}
                className={user._id === selectedUser?._id ? "selected" : ""}
              >
                <button
                  className="block"
                  type="button"
                  onClick={() => selectUser(user)}
                >
                  {user.name}
                </button>
                <span
                  className={
                    user.unread ? "unread" : user.online ? "online" : "offline"
                  }
                />
              </li>
            ))}
        </ul>
      </div>
      <div className="col-3 support-messages">
        {!selectedUser?._id ? (
          <MessageBox>Select a user to start chat</MessageBox>
        ) : (
          <div>
            <div className="row">
              <strong>Chat with {selectedUser.name}</strong>
            </div>
            <ul ref={refMessageAdmin}>
              {messages.length === 0 && <MessageBox>No Message</MessageBox>}
              {messages.map((msg, idx) => (
                <li key={idx} className={msg.isAdmin ? "admin" : ""}>
                  <div className="chat-bubble">
                    <strong>{`${msg.name}: `}</strong>
                    {msg.body}
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <form onSubmit={submitHandler} className="row">
                <input
                  type="text"
                  placeholder="type message"
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
    </div>
  );
}

export default SupportScreen;
