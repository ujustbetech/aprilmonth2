// import Head from 'next/head'
// import Image from 'next/image'
// import Login from '../component/Login'
// import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react";
import Header from "../component/module/Header";

// import { Editor } from "react-draft-wysiwyg";

// import {EditorState} from 'draft-js'
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function Home() {

  // const [editorState, setEditorState] = useState(()=> EditorState.createEmpty());


  // useEffect(() => {
  //   console.log(editorState);
  // }, [editorState]);


  return (
    <>
    
    <Header />
    <section className="c-background">
     
      <div className='youtube-video'>
        <iframe src="https://www.youtube.com/embed/-RQKQeJEC9g" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>

    </section>
    
    </>

  )
}


