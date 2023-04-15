import React,{ useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc,updateDoc,query,Timestamp,orderBy } from "firebase/firestore";
import firebaseApp from '../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import { ContentState, convertToRaw } from 'draft-js';
// import { Editor } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import {EditorState} from 'draft-js'
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Router, { useRouter } from 'next/router';
const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();

 //icon
 import { MdUpload } from 'react-icons/md';




const Admin = () => {
  
    const [phoneNum, setphoneNum] = useState('');
    const [eventName,seteventName]=useState('');
    const [date,setdate]=useState('');
    const [zoomlink,setzoomlink]=useState('');
    const [adminData, setadminData]=useState('');
    const [dashboardData,setdashboardData ]=useState([]);


    // form bg images
  const [formFileName, setformFileName] = useState("No file choosen");
  const [formImages, setformImages] = useState('');
  const [formImgUrls, setformImgUrls] = useState('');

  const [progress, setProgress] = useState(0);

  // dashboard bg images
  const [dashboardImgName, setdashboardImgName] = useState("No file choosen");
  const [dashboardImages, setdashboardImages] = useState('');
  const [dashboardUrls, setdashboardUrls] = useState('');

//   mobile add images

  const [mobileImgName, setmobileImgName] = useState("No file choosen");
  const [mobileImages, setmobileImages] = useState('');
  const [mobileUrls, setmobileUrls] = useState('');


    const [whatsappLink, setwhatsappLink] = useState("");

    // text editor
    const [Agenda, setAgenda] = useState("");
    // const [editorState, setEditorState] = useState(()=> EditorState.createEmpty());
    const [postEvent, setpostEvent] = useState("");

 
   
    const [error, seterror] = useState(false);
    // const [inputError, setinputError] = useState(false);
    
    const [fileloading, setfileloading] = useState(false);
    const [dashboardfileloading, setdashboardfileloading] = useState(false);
    const [formfileloading, setformfileloading] = useState(false);




    const handleChangeDashboard = async (event) => {
        event.preventDefault();
        let dt = new Date().toLocaleDateString();
        let tm = new Date().toLocaleTimeString();
        
        const eventNamereplace=eventName.toLowerCase();
        const eventId=eventNamereplace.replace(/ /g,''); 
        
    const usersCollectionRef = collection(db, "AdminMonthlyMeet");
        const isLogin = localStorage.getItem("ucoreadmin");
        const adminDetails = JSON.parse(isLogin);
        console.log(adminDetails);
        console.log("currentuser",adminDetails.currentuser);

        let data = {
          createdBy:adminDetails.currentuser,
          createTime:tm,
          createdDate:dt,
          eventName:eventName,
          dashboardUrls:dashboardUrls,
          formImgUrls:formImgUrls,
          mobileUrls:mobileUrls,
          whatsappLink:whatsappLink,
          eventDate:date,
        //   contentState:contentState,
            Agenda:Agenda,
          postEvent:postEvent,
          zoomlink:zoomlink,
         
          createdAt: Timestamp.now(),

          eventId:eventNamereplace.replace(/ /g,''),

      };
        console.log("date",date);
        // console.log(data);
       
        if(formImages==="" || dashboardImages==="" || mobileImages==="" || formImgUrls==="" || dashboardUrls==="" || mobileUrls==="" ){
            seterror(true);
        }else{
            const cityRef = doc(db, 'AdminMonthlyMeet',eventNamereplace.replace(/ /g,''));
            console.log("event created data eventId",data);
            alert("event created successfully")
            await setDoc(cityRef, data);

            seteventName("");
            setzoomlink("");
            setdate("");
            setformImgUrls("");
            setformFileName("");
            setformImages("");
            setdashboardUrls("");
            setmobileImages("");
            setmobileImgName("");
            setmobileUrls("");
            setProgress(0);
            setAgenda("");
            setpostEvent("");
            setdashboardImages("");
            setdashboardImgName("");
            setwhatsappLink("");

            Router.push('/admin/eventList');
        }
      
  }; 

 
  //backgroundimg change in dashboard
  const handleDashboardImages = (e) =>{
    // console.log(e.target.files[0]);
    setdashboardfileloading(false);
    const file = e.target.files[0];
    const dashboardImgName = e.target.files[0].name;
    setdashboardImgName(dashboardImgName);
    console.log("dashboard images", dashboardImgName);

    for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        console.log(newImage);
        newImage["id"] = Math.random();

        setdashboardImages((dashboardImages) => [...dashboardImages, newImage]);
    }
  }

  // dashboard upload the file functionality
  const handleDashboardFileUpload = (e) => {
    const promises = [];
    setdashboardUrls("");
    setdashboardfileloading(true);
    // if(dashboardImages===""){
    //     seterror(true);
    // }else{
        dashboardImages.map((image) => {
            // const storageRef = ref(storage, 'images/rivers.jpg');
            const storageRef = ref(storage, `/${image.name}`)
    
            // const storageRef = ref(storage,`images/${image.name}`).put(image);
            const uploadTask = uploadBytesResumable(storageRef, image);
            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
    
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //   console.log('File available at', downloadURL);
                    getDownloadURL(uploadTask.snapshot.ref).then((dashboardimg) => {
                        //   setUrls((prevState) => [...prevState, urls]);
                        setdashboardUrls((dashboardUrls) => [...dashboardUrls, dashboardimg]);
                        //   setUrls( [...urls, urls]);
                    });
                },
            );
            //   
        });
    // }

    Promise.all(promises)
        .then(() => {alert("dashboard file images upload successfully");
        setdashboardfileloading(false)})
        .catch((err) => console.log(err));

  }  
  console.log(dashboardUrls);


  // form file backgroung images changes function
  const handleFormbgImage = (e) =>{
    // console.log(e.target.files[0]);
    setformfileloading(false);
    const file = e.target.files[0];
    const formFileName = e.target.files[0].name;
    setformFileName(formFileName);
    console.log("form images", formFileName);

    for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        console.log(newImage);
        newImage["id"] = Math.random();
        //  setImages( [...images, newImage]);

        setformImages((formImages) => [...formImages, newImage]);
    }
  }

  // form images uplaod function
  const handleFormFileUpload = (e) => {
    const promises = [];
    setformImgUrls("");
    setformfileloading(true);
    formImages.map((image) => {
        // const storageRef = ref(storage, 'images/rivers.jpg');
        const storageRef = ref(storage, `/${image.name}`)

        // const storageRef = ref(storage,`images/${image.name}`).put(image);
        const uploadTask = uploadBytesResumable(storageRef, image);
        promises.push(uploadTask);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);

            },
            (error) => {
                console.log(error);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                //   console.log('File available at', downloadURL);
                getDownloadURL(uploadTask.snapshot.ref).then((formimg) => {
                    //   setUrls((prevState) => [...prevState, urls]);
                    setformImgUrls((formImgUrls) => [...formImgUrls, formimg]);
                    
                });
            },
        );
   
    });

    Promise.all(promises)
        .then(() => {alert("form file images upload successfully");
            setformfileloading(false)})
        .catch((err) => console.log(err));
       
  }  
  console.log(formImgUrls);


    //  mobile img upload
  const handleMobilebgImage = (e) =>{
    
    setfileloading(false);
    const file = e.target.files[0];
    const mobileImgName = e.target.files[0].name;
    setmobileImgName(mobileImgName);
    console.log("mobile images", mobileImgName);

    // if(formImages==="" ||){
    //     seterror(true);
    // }

    for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        console.log(newImage);
        newImage["id"] = Math.random();
        //  setImages( [...images, newImage]);

        setmobileImages((mobileImages) => [...mobileImages, newImage]);
    }
  }

  
  // form images uplaod function
  const handleMobileFileUpload = (e) => {
    const promises = [];
    setfileloading(true);
    setmobileUrls("");
    mobileImages.map((image) => {
        // const storageRef = ref(storage, 'images/rivers.jpg');
        const storageRef = ref(storage, `/${image.name}`)

        // const storageRef = ref(storage,`images/${image.name}`).put(image);
        const uploadTask = uploadBytesResumable(storageRef, image);
        promises.push(uploadTask);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);

            },
            (error) => {
                console.log(error);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                //   console.log('File available at', downloadURL);
                getDownloadURL(uploadTask.snapshot.ref).then((mobileimg) => {
                    //   setUrls((prevState) => [...prevState, urls]);
                    setmobileUrls((mobileUrls) => [...mobileUrls, mobileimg]);
                    
                });
            },
        );
   
    });

    Promise.all(promises)
        .then(() => {alert("mobile file images upload successfully");
    setfileloading(false)})
        .catch((err) => console.log(err));
       
  }  
  console.log("mobileimg",mobileUrls);

// select postvevent type
const handlepostevent = async (e) => {
    const target = e.target;
    if (target.checked) {
        setpostEvent(target.value);
        console.log(e.target.value);
    }
}




useEffect(() => {
 
   
        const getContent = async () => {

            onSnapshot(collection(db, "AdminMonthlyMeet"), (snapshot) => {
                //console.log("MM", snapshot.docs());
                setdashboardData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));              
            });
            setphoneNum(phoneNum);
        }
        getContent();
}, [])

// useEffect(() => {
//     console.log(editorState);
//   }, [editorState]);


return (
    <>
    
        <section className='c-form  box'>
            <h2>Add Event</h2>
        <form onSubmit={handleChangeDashboard}>
            <ul>

                {/* dashboard bg img */}

                <li className='form-row'>
                    <h4>Dashboard Content File</h4>
                  <div className='multipleitem'>

                        <input id="file-upload"
                        type="file" 
                        // name="dashboardFile"
                        required
                        onChange={handleDashboardImages} />

                   <label htmlFor='file-upload' className='custom-file-upload'> {dashboardfileloading ?"uploading..." : "File upload"} </label>
                 
                    <span className='filename' id="file-upload">{dashboardImgName}</span>
                    <span onClick={handleDashboardFileUpload} className='uplaod-icon'><MdUpload /></span>

                    <span> {dashboardUrls && dashboardUrls.map((dashbordfile, i) => (
                            <img
                                key={i}
                                style={{ width: "100px" }}
                                src={dashbordfile || "http://via.placeholder.com/300"}
                                alt="dashboard-image"
                            />
                    ))}</span>

                
                    </div> 
                   
                </li>

                {/* form bg */}

                <li className='form-row'>
                    <h4>Form Content File</h4>
                    <div className='multipleitem'>

                    <input id="formfile-upload"
                        type="file"
                        // name="formFile"
                        required
                        onChange={handleFormbgImage}  />

                        <label htmlFor='formfile-upload' className='custom-file-upload'>{formfileloading ?"uploading..." : "File upload"} </label>
                        <span className='filename' id="formfile-upload">{formFileName}</span>
                        <span onClick={handleFormFileUpload} className='uplaod-icon'>     <MdUpload /> </span>


                        <span> {formImgUrls && formImgUrls.map((formfile, i) => (
                            <img
                                key={i}
                                style={{ width: "100px" }}
                                src={formfile || "http://via.placeholder.com/300"}
                                alt="form-image"
                            />
                        ))}</span>

                    </div>
                </li>

                {/* mobile img  */}
                <li className='form-row'>
                    <h4>Mobile Images File</h4>
                    <div className='multipleitem'>

                    <input id="mobileImg-upload"
                        type="file"
                        // name="mobileFile"
                        required
                        onChange={handleMobilebgImage}  />

                        <label htmlFor='mobileImg-upload' className='custom-file-upload'>{fileloading ?"uploading..." : "File upload"} </label>
                        <span className='filename' id="mobileImg-upload">{mobileImgName}</span>
                       
                        <span onClick={handleMobileFileUpload} className='uplaod-icon'><MdUpload /></span>


                        <span> {mobileUrls && mobileUrls.map((mobilefile, i) => (
                            <img
                                key={i}
                                style={{ width: "100px" }}
                                src={mobilefile || "http://via.placeholder.com/300"}
                                alt="mobile-image"
                            />
                        ))}</span>

                    </div>
                    
                    {/* {
                        error?<label className="error"><p>this is required</p></label>:null
                     } */}
                </li>
                
             
             
                      
                
                {/* event name */}
                <li className='form-row'>
                    <h4>Event Name</h4>
                    <div className='multipleitem'>
                        <input type="text"
                        placeholder='Event Name'
                        name="eventName"
                        value={eventName}
                        onChange={( event ) => {seteventName(event.target.value)}}
                        required >
                        </input>
                    
                        {/* <span class="valid-feedback">Looks good!</span> */}
                    
                        
                    </div>
                </li>


                {/* zoom link */}
                <li className='form-row'>
                    <h4>Zoom Link</h4>
                    <div className='multipleitem'>
                    <input type="text"
                        placeholder='Zoom Line'
                        name="zoomlink" 
                        value={zoomlink}
                        onChange={( event ) => { setzoomlink(event.target.value)}} 
                        required />
                    </div>
                    {/* {
                                error?<div className="error"><p>this is required</p></div>:null
                                } */}
                </li>

                {/* whatsapp Link */}

                <li className='form-row'>
                    <h4>Whatsapp Link</h4>
                    <div className='multipleitem'>
                    <input type="text"
                        placeholder='Whatsapp Link'
                        name="whatsappLink" 
                        value={whatsappLink}
                        onChange={( event ) => { setwhatsappLink(event.target.value)}} 
                        required />
                    </div>
                    {/* {
                        error?<div className="error"><p>this is required</p></div>:null
                    } */}

                </li>

                {/* add event date */}
                <li className='form-row'>
                    <h4>Event Date</h4>
                    <div className='multipleitem'>
                        <input type="date"
                            htmlFor="eventDate"
                            id="eventDate"
                            name='date' 
                            value={date}
                            onChange={( event ) => setdate(event.target.value)}   
                            required />
                    </div>
                    {/* {
                                error?<div className="error"><p>this is required</p></div>:null
                     } */}

                    
                </li>

                {/* post event  */}

                <li className='form-row'>
                        <h4>Post Event  </h4>
                        <div className='multipleitem'> 
                            <div>
                                <label htmlFor='yes'>
                                    <input type="radio"
                                    id="yes"
                                    value="Yes"
                                    name="handlepostevent"
                                    type="radio"
                                    checked={postEvent == 'Yes'} 
                                    onChange={handlepostevent}   />
                                    <div className='custom_radio'></div>
                                    Yes
                                </label>
                            </div>
                

              
                            <div>
                                    <label>
                                    <input type="radio"
                                    id="no"
                                    value="No"
                                    name="handlepostevent"
                                    type="radio"
                                    checked={postEvent == 'No'} 
                                    onChange={handlepostevent}   />
                                    <div className='custom_radio'></div>
                                    No
                                </label>
                            </div>
                        </div>
            

                </li>


                 {/*text editor */}
                 {/* {postEvent==="Yes" && ( */}

                        <li className='form-row'>
                        <h4>Agenda of Event</h4>
                        <div className='multipleitem'>



                            <textarea
                            type="text"
                            placeholder='Agenda of Event'
                            name="Eventagenda"
                            value={Agenda}
                            onChange={( event ) => {setAgenda(event.target.value)}}
                            required >
                            </textarea>
                                                    

                        </div>
                        </li>

                        {/* )}    */}

                <li className='form-row'>
                    <div>
                        <button className='submitbtn' type='submit'>Submit</button>
                    

                        {/* <button className='resetbtn'>Reset</button> */}
                    </div>    
                </li>

            </ul>
        </form>
            
        </section>

{/* // map the function */}
        {/* {

            dashboardData && dashboardData.map(admindata=>{
                console.log("admin data", adminData);
                return (
                    <div>
                         <h4>{admindata.eventName}</h4>
                    </div>
                )

            })
        }{
        dashboardData ?<div></div>:null
        } */}
    </>
    );
}

export default Admin
