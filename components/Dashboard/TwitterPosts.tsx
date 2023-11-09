
function TwitterPosts() {
  return (
    <><div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
    <h4 className="mb-6 text-xl font-bold text-black dark:text-white">
      Latest Twitter Posts
    </h4>
    <a className="twitter-timeline" data-height="500" href="https://twitter.com/dntrademark?ref_src=twsrc%5Etfw">Tweets by dntrademark</a> 
    <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script> 
  </div>
  </>
  )
}

export default TwitterPosts