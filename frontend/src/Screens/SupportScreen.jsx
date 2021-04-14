import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import MessageBox from "../components/MessageBox";

let allUsers = [];
let allMessages = [];
let allSelectedUser = {};

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

function SupportScreen() {
  const uiMessageRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [socket, setSocket] = useState(null);
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const { userInfo } = useSelector((state) => state.userSignin);

  useEffect(() => {
    if (uiMessageRef.current) {
      uiMessageRef.current.scrollBy({
        top: uiMessageRef.current.clientHeight,
        left: 0,
        behavior: "smooth",
      });
      if (!socket) {
        const sk = socketIOClient(ENDPOINT);
        setSocket(sk);

        sk.emit("onLogin", {
          _id: userInfo._id,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
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
          const existUser = allUsers.find(
            (user) => user._id === updateUser._id
          );
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

        sk.on("listUsers", (updateUsers) => {
          allUsers = updateUsers;
          console.log(updateUsers);
          setUsers(allUsers);
        });

        sk.on("selectUser", (user) => {
          allMessages = user.messages;
          setMessages(allMessages);
        });
      }
    }
  }, [socket, userInfo, messages, users]);

  const selectUser = (user) => {
    allSelectedUser = user;
    setSelectedUser(allSelectedUser);
    const existUser = allUsers.map((x) => x._id === user._id);
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
    if (!messageBody.trim()) {
      alert("Error.Please enter message");
    } else {
      allMessages = [
        ...allMessages,
        { body: messageBody, name: userInfo.name },
      ];
      setMessages(allMessages);
      setMessageBody("");
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: selectedUser._id,
        });
      }, 1000);
    }
  };

  return (
    <div className="row top full-container">
      <div className="col-1 support-users">
        {users.filter((user) => user._id !== userInfo._id).length === 0 && (
          <MessageBox>No User in Need</MessageBox>
        )}
        <ul>
          {users
            .filter((user) => user._id !== userInfo._id)
            .map((user) => (
              <li
                key={user._id}
                className={user._id === selectedUser._id ? "selected" : ""}
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
        {!selectedUser._id ? (
          <MessageBox>Select an user to chat</MessageBox>
        ) : (
          <div>
            <div className="row">
              <strong>Chat with {selectedUser.name}</strong>
            </div>
            <ul ref={uiMessageRef}>
              {messages.length === 0 && <li>No message</li>}
              {messages.map((msg, idx) => (
                <li key={idx}>
                  <strong>{`${msg.name}: `}</strong> {msg.body}
                </li>
              ))}
            </ul>
            <div>
              <form onSubmit={submitHandler} className="row">
                <input
                  type="text"
                  placeholder="Enter message"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupportScreen;
