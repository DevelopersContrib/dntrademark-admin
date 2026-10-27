"use client";
import { NotificationType } from "@/types/notificationType";

const Message = ({message, url, date_sent} : NotificationType) => {
  const safeUrl = typeof url === 'string' && url ? url : '#';
  const safeMessage = typeof message === 'string' ? message : '';

  return (
    <>
      <a
        href={safeUrl}
        className="py-2 px-4 md:px-6 xl:px-7.5 no-underline hover:bg-gray-2 flex items-center justify-between"
      >
        <span className="font-medium" dangerouslySetInnerHTML={{ __html: '&middot &nbsp;' + safeMessage }}>
        </span>
        <span className="text-xs">{date_sent ?? ''}</span>
      </a>
    </>
  );
};

export default Message;
