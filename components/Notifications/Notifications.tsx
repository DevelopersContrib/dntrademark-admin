"use client";
import { useEffect, useState } from "react";
import Message from "./Message";

import { getNotificationsNew } from "@/lib/data";

const Notifications = () => {
  const [ notifications, setNotifications ] = useState([]);

  const getAllNotifications =async () => {
    getNotificationsNew().then(res => {

      setNotifications(res.message);
      console.log(res.message);
    });
  }

  useEffect(() => {
    getAllNotifications();
  }, []);
  return (
    <div className="w-full">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 border-b border-gray">
          <h4 className="text-xl font-semibold text-black dark:text-white flex items-center">
            <svg
              className="fill-current duration-300 ease-in-out mr-2"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
                fill=""
              />
            </svg>
            Notifications
          </h4>
        </div>
        {/* <div className="py-6 px-4 md:px-6 xl:px-7.5 text-center min-h-[30vh] flex  w-full justify-center items-center font-bold text-[#aaa]">
            You have 0 notification.
          </div> */}
        <div className="w-full flex flex-col max-h-[500px] overflow-y-auto">
          {
            notifications.length > 0 ? notifications.map((notif, index) => (
              <Message key={index} {...notif} />
            )) : (
              <h4>Inbox Empty</h4>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Notifications;
