
function TwitterPosts() {
  return (
    <><div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
    <h5 className="mb-2 text-lg font-semibold text-dark">
      Latest Twitter Posts
    </h5>
    <a className="twitter-timeline" href="https://twitter.com/dntrademark?ref_src=twsrc%5Etfw">Tweets by dntrademark</a> 
    <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script> 
  </div>
  </>
  )
}

export default TwitterPosts