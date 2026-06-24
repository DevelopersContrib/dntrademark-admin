"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface feedProps {
  feed: string | "";
}

interface BlogItem {
  title: string;
  link: string;
}

function LatestBlog({ feed }: feedProps) {
  // DOMParser is a browser-only API, so parse the RSS feed after mount to avoid
  // breaking server-side rendering.
  const [arrays, setArrays] = useState<BlogItem[]>([]);

  useEffect(() => {
    if (!feed || typeof window === "undefined") return;
    try {
      const parser = new DOMParser();
      const parsedXML = parser.parseFromString(feed, "text/xml");
      const items = parsedXML.querySelectorAll("item");
      const list = Array.from(items)
        .slice(4)
        .map((item) => ({
          title: item.querySelector("title")?.textContent ?? "",
          link: item.querySelector("link")?.textContent ?? "",
        }));
      setArrays(list);
    } catch {
      setArrays([]);
    }
  }, [feed]);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="mb-6 text-xl font-bold text-black dark:text-white">
        Latest Blogs
      </h4>

      {arrays.map((item, index) => (
        <a
          key={index}
          href={item.link}
          className="flex py-3 hover:bg-gray-3 dark:hover:bg-meta-4 last:border-b border-t border-stroke dark:border-strokedark"
        >
          <div className="h-14 w-14 mr-3">
            <Image
              src="/images/logo/icon-dntrademark.png"
              alt="Official DNTrademark Blog"
              width={80}
              height={80}
            />
          </div>

          <div className="flex flex-1 items-center justify-between">
            <h6 className="font-medium text-black dark:text-white">
              {item.title}
            </h6>
          </div>
        </a>
      ))}
    </div>
  );
}

export default LatestBlog;
