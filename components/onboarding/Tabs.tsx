import React from 'react'

const Tabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="font-medium leading-relaxed">
        {children}
      </div>
    </>
  )
}

export default Tabs