import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:9000/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:9000/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          position: "relative",
        }}
      >
        🔔

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              minWidth: "18px",
              height: "18px",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            right: "0",
            width: "350px",
            maxHeight: "450px",
            overflowY: "auto",
            background: "#102238",
            border: "1px solid #1E4E78",
            borderRadius: "10px",
            padding: "15px",
            zIndex: 1000,
            boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3
              style={{
                color: "white",
                margin: 0,
                fontSize: "18px",
              }}
            >
              Notifications
            </h3>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#33c1ff",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p
              style={{
                color: "#aaa",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              No notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() =>
                  !notification.isRead &&
                  markAsRead(notification._id)
                }
                style={{
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  background: notification.isRead
                    ? "#071525"
                    : "#0b1f36",
                  borderLeft: notification.isRead
                    ? "3px solid #555"
                    : "3px solid #33c1ff",
                  cursor: notification.isRead
                    ? "default"
                    : "pointer",
                }}
              >
                <h4
                  style={{
                    color: "white",
                    margin: "0 0 5px 0",
                    fontSize: "14px",
                  }}
                >
                  {notification.title}
                </h4>

                <p
                  style={{
                    color: "#ccc",
                    margin: "0 0 7px 0",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                >
                  {notification.message}
                </p>

                <small
                  style={{
                    color: "#777",
                    fontSize: "11px",
                  }}
                >
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;