"use client";
import { NotificationType } from "@/types/notificationType";

const Message = ({message, url} : NotificationType) => {
  return (
    <>
      <a
        href={url}
        className="py-2 px-4 md:px-6 xl:px-7.5 no-underline hover:bg-gray-2 flex items-center justify-between"
      >
        <span className="font-medium" dangerouslySetInnerHTML={{ __html: '&middot' + message }}>
        </span>
        <span className="text-xs">Nov. 21, 2023</span>
      </a>
    </>
  );
};

export default Message;
