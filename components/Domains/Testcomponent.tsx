'use client'
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const Testcomponent = () => {
    const [value, setValue] = useState('');
  return (
    <div>
        <ReactQuill theme="snow" value={value} onChange={setValue} />

    </div>
  )
}

export default Testcomponent;