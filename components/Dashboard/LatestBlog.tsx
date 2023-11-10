import Image from "next/image";
interface feedProps {
    feed: string | "";
}

function LatestBlog({ feed }: feedProps) {
    const parser = new DOMParser();
    const parsedXML = parser.parseFromString(feed, "text/xml");
    console.log('parsedXML',parsedXML)
    const items = parsedXML.querySelectorAll("item");
    const arrays = Array.from(items).slice(4)
  return (
        items?(
            <>
            <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-6 text-xl font-bold text-black dark:text-white">Latest Blogs</h4>
            
                {
                Array.from(arrays).map((item, index) => (
                   <a key={index} href={item.querySelector("link")?.textContent ?? ''} className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
                   <div className="align-left h-14 w-14 rounded-full">
                   <Image 
                        src="/images/logo/icon-dntrademark.png" 
                        alt="Official DNTrademark Blog" 
                        width={80} 
                        height={80} 
                    />
                      <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
                    </div>

                   <div className="flex flex-1 items-center justify-between">
                     
                       <h6 className="font-medium text-black dark:text-white">
                       {item.querySelector("title")?.textContent}
                       </h6>
                     
                    
                   </div>
                 </a>     

                ))}
            
          </div>
            </>
        ):''
  )
}

export default LatestBlog