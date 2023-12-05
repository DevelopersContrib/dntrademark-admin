'use client'
import React, { ChangeEvent, useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML, convertToRaw  } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function page() {
    const onEditorStateChange = (newEditorState: any) => {
        setEditorState(newEditorState);
      };
    
      const contentBlock = htmlToDraft("Hello");
    
      const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(
          ContentState.createFromBlockArray(contentBlock.contentBlocks)
        )
      );
  return (
    <div>
        <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />

    </div>
  )
}

export default page