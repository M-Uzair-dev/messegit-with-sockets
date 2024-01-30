import React, { useEffect, useState } from "react";
import "../../pages/css/innerpages.css";
import { useSelector } from "react-redux";
import defaultpic from "../../images/userpfp.jpg";

export default function ChatCard({
  pfp,
  name,
  id,
  nowrap,
  onclick,
  isGroup,
  username,
  admin,
}) {
  const [count, setcount] = useState(0);
  const [latestMessage, setlatestMessage] = useState("");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const getCount = async () => {
      try {
        if (!user.id || !id) return;

        const res = await fetch("http://localhost:5000/messages/getcount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: id,
            userId: user.id,
          }),
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success === false) {
          if (result.message === "No messages found") {
            return;
          }
          throw new Error("An unexpected error occurred!");
        } else {
          setcount(result.newMessageCount);
          setlatestMessage(result.latestMessage);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getCount();
  }, []);
  return (
    <div>
      <div
        onClick={() => {
          onclick ? onclick() : null;
        }}
        className={isGroup ? "group card" : "card"}
        style={nowrap ? { width: "100%" } : {}}
      >
        <div className="cardleftdiv">
          <img src={pfp || defaultpic} alt="user image" />
          <div>
            <h3>{name || "User's name"}</h3>
            {username ? <p>{username}</p> : <p>{latestMessage}</p>}
          </div>
        </div>

        {admin ? (
          <div className="admin badge">
            <p>ADMIN</p>
          </div>
        ) : count === 0 ? (
          <></>
        ) : count ? (
          <div className="badge">
            <p>{count}</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
