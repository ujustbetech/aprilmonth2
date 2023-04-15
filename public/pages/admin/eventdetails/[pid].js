import React, { useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc,updateDoc,query,Timestamp,orderBy } from "firebase/firestore";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Layout from '../../../component/Layout';
import Router from 'next/router';

const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();
 // icon
 import { MdUpload } from 'react-icons/md'

const Eventdetail = ({ username }) => {

  const userId = username.pid;
  // console.log("props", userId);
  const [phoneNum, setphoneNum] = useState('');
  const [eventName, seteventName] = useState('');
  const [date, setdate] = useState('');
  const [zoomlink, setzoomlink] = useState('');
  const [adminData, setadminData] = useState('');
  const [eventData, seteventData] = useState([]);
  
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

  const [onecheck, setoneCheck] = useState('');
    const [twocheck, setTwoCheck] = useState('');
    const [threecheck, setThreeCheck] = useState('');
    const [fourcheck, setFourCheck] = useState('');
    const [fivecheck, setFiveCheck] = useState('');
    const [sixcheck, setSixCheck] = useState('');
    const [sevencheck, setSevenCheck] = useState('');
    const [eightcheck, setEightCheck] = useState('');

 
  const [error, seterror] = useState(false);
  const [singleUser,setSingleuser]=useState("");
  const [eventId,seteventId]=useState("");
  const [whatsappLink, setwhatsappLink] = useState("");

  const[Agenda, setAgenda]=useState("");
  const [PostData, setPostData] = useState("");
  const [sevenDataAns, setsevenDataAns] = useState([]);
  
  const [fileloading, setfileloading] = useState(false);
    const [dashboardfileloading, setdashboardfileloading] = useState(false);
    const [formfileloading, setformfileloading] = useState(false);



  // dashboard edit submit function
  const handleChangeDashboard = async (event) => {
    event.preventDefault();
    let dt = new Date().toLocaleDateString();
    let tm = new Date().toLocaleTimeString();

    const usersCollectionRef = collection(db, "AdminMonthlyMeet");
    const isLogin = localStorage.getItem("ucoreadmin");
    const adminDetails = JSON.parse(isLogin);
    console.log(adminDetails);
    console.log("currentuser", adminDetails.currentuser);

    let data = {
      createdBy: adminDetails.currentuser,
      createTime: tm,
      createdDate: dt,
      eventName: eventName,
      dashboardUrls:dashboardUrls,
      formImgUrls:formImgUrls,
      mobileUrls:mobileUrls,
      eventDate: date,
      postEvent:PostData,
      zoomlink: zoomlink,   
      eventId:eventId,
      Agenda:Agenda,
      whatsappLink:whatsappLink,

    };

    //console.log("date", date);
    console.log("form data", data);
    const eventNamereplace = eventName.toLowerCase();
    // await addDoc(usersCollectionRef, data);
    // const collectadmin= doc(db, 'AdminMonthlyMeet');
    console.log(data);
    const cityRef = doc(db, 'AdminMonthlyMeet', eventId);
    // setDoc(cityRef, data, { merge: true });
    await updateDoc(cityRef, data); 
    alert("data update succesffuly");
    

    seteventName("");
    seteventData([]);
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
    setPostData("");
    setdashboardImages("");
    setdashboardImgName("");
    setwhatsappLink("");

    Router.push('/admin/eventList');
  };

 
  // chnage the dashbaord background file
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
        //  setImages( [...images, newImage]);

        setdashboardImages((dashboardImages) => [...dashboardImages, newImage]);
    }
  }

  // dashboard upload the file functionality
  const handleDashboardFileUpload = (e) => {
    const promises = [];
    setdashboardUrls("");
    setdashboardfileloading(true);
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

    Promise.all(promises)
        .then(() => {alert("dashboard file images upload successfully");
        setdashboardfileloading(false)})
        .catch((err) => console.log(err));
      
  }   
  console.log("dashboard img",dashboardUrls);    

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
  console.log("formimg",formImgUrls);

    //  mobile img upload
    const handleMobilebgImage = (e) =>{
     
      setfileloading(false);
      const file = e.target.files[0];
      const mobileImgName = e.target.files[0].name;
      setmobileImgName(mobileImgName);
      console.log("mobile images", mobileImgName);
  
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
 
    const handlepostdata = async (e) => {
      const target = e.target;
      if (target.checked) {
          setPostData(target.value);
          console.log(e.target.value);
      }
  }
  useEffect(() => {

    const getContent = async () => {

      onSnapshot(collection(db, userId), (snapshot) => {
        //console.log("MM", snapshot.docs());
        seteventData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      // console.log("data", eventData);
      // setphoneNum(phoneNum);
    }

    const getsingleDoc = async () => {

      const isLogin = localStorage.getItem("ucore");
      const usersDetails = JSON.parse(isLogin);
      console.log(usersDetails);

      const docRef = doc(db, "AdminMonthlyMeet", userId);
      const docSnap = await getDoc(docRef);
    
      
      if (docSnap.exists()) {
        setSingleuser(docSnap.data());
      // console.log(singleUser);
        console.log("Document data:", docSnap.data());
        seteventName(docSnap.data().eventName);
        setdashboardUrls(docSnap.data().dashboardUrls);
        setformImgUrls(docSnap.data().formImgUrls);
        setmobileUrls(docSnap.data().mobileUrls);
        setzoomlink(docSnap.data().zoomlink);
        setdate(docSnap.data().eventDate);
        seteventId(docSnap.data().eventId);
        setwhatsappLink(docSnap.data().whatsappLink);
        setAgenda(docSnap.data().Agenda);
        setPostData(docSnap.data().postEvent)
      
      

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      console.log(singleUser);
  }
  
    getContent();
    getsingleDoc();
  }, [])

  return (
    console.log(eventData),
    <Layout>


      <section className='c-form box'>
        <h2> Event Details</h2>
        <ul>

          {/* dashboard file img */}

          <li className='form-row'>
            <h4>Dashboard Content File</h4>
            <div className='multipleitem'>

                  <input id="file-upload"
                     type="file" 
                     name="dashboardFile"
                     required
                     onChange={handleDashboardImages} />

              <label htmlFor='file-upload' className='custom-file-upload'> {dashboardfileloading ?"uploading..." : "File upload"}</label>
              <span id="file-upload">{dashboardImgName}</span>
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

          {/* form content file img */}

          <li className='form-row'>
            <h4>Form Content File</h4>
            <div className='multipleitem'>

              <input id="formfile-upload"
                type="file"
                name="formFileName"
                onChange={handleFormbgImage}  />

              <label htmlFor='formfile-upload' className='custom-file-upload'>{formfileloading ?"uploading..." : "File upload"} </label>
              <span id="formfile-upload">{formFileName}</span>
              <span onClick={handleFormFileUpload} className='uplaod-icon'><MdUpload /></span>


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
                        name="mobileImgFile"
                        onChange={handleMobilebgImage}  />

                        <label htmlFor='mobileImg-upload' className='custom-file-upload'>{fileloading ?"uploading..." : "File upload"}</label>
                        <span id="mobileImg-upload">{mobileImgName}</span>
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
                </li>

          {/* event name */}
          <li className='form-row'>
            <h4 htmlFor="validationCustom01">Event Name</h4>
            <div className='multipleitem'>
              <input type="text"
                placeholder='Event Name'
                name="eventName"
                id="validationCustom01"
                value={eventName}
                onChange={(event) => { seteventName(event.target.value) }}
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
                onChange={(event) => { setzoomlink(event.target.value) }}
                required />
            </div>
            {
              error ? <div className="error"><p>this is required</p></div> : null
            }
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
              {
                  error?<div className="error"><p>this is required</p></div>:null
              }

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
                onChange={(event) => setdate(event.target.value)}
                required />
            </div>
            {
              error ? <div className="error"><p>this is required</p></div> : null
            }
          </li>

           {/* post event  */}
           <li className='form-row '>
                        <h4>Post Event  </h4>
                        <div className='multipleitem postEventTypeli'> 
                            <div>
                                <label htmlFor='yes'>
                                    <input 
                                    id="yes"
                                    value="Yes"
                                    name="handlepostdata"
                                    type="radio"
                                    checked={PostData == 'Yes'} 
                                    onChange={handlepostdata}   />
                                    <div className='custom_radio'></div>
                                    Yes
                                </label>
                                
                            </div>
                

              
                            <div>
                                    <label htmlFor='no'>
                                    <input
                                    id="no"
                                    value="No"
                                    name="handlepostdata"
                                    type="radio"
                                    checked={PostData == 'No'} 
                                    onChange={handlepostdata}   />
                                    <div className='custom_radio'></div>
                                    No
                                </label>
                            </div>
                            {/* <h2 className='posteventType'>Post Event:{postEvent}</h2> */}

                        </div>
                     {/* <h2>Post Event: {postEvent}</h2> */}
            

             </li> 


        {/* {PostData==="Yes" && ( */}
          
              <li className='form-row'>
              <h4>Event Agenda</h4>
              <div className='multipleitem'>

                  <textarea type="text"
                    placeholder="Event Agenda"
                    name="eventagendadetails"
                    value={Agenda}
                    onChange={(event) => { setAgenda(event.target.value) }}
                    required >
                  </textarea>

            </div>
             </li>

        {/* )}        */}



          <li className='form-row'>
            <div>
              <button className='submitbtn' onClick={handleChangeDashboard}>Submit</button>


              {/* <button className='resetbtn'>Reset</button> */}
            </div>
          </li>

        </ul>
      </section>

      {/* map the function  */}
      <section className='box userlisting'>
        <h2>
          Feedback Form
        </h2>
        <table>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              
              <th>Question 1</th>
              <th>Question 1 input</th>
              <th>Question 2</th>
              {/* <th>Question 2 input</th> */}
              <th>Question 3</th>
              {/* <th>Question 3 input</th> */}
              
              <th>Question 4</th>
              {/* <th>Question 4 input</th> */}
             
              <th>Question 5</th>
              {/* <th>Question 5 input</th> */}
             
            
              <th>Question 6</th>
              <th>Ph No.</th>
              <th>login time</th>
              
             
              {/* <th>logout time</th> */}
            </tr>
          </thead>
          <tbody>
            {
                eventData && eventData.map((eventdata, key = i) => {
                console.log("event data", eventdata);
                return (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{eventdata.username}</td>
                    <td>{eventdata.PostOneAns}</td>
                    <td>{eventdata.PostOneInput}</td>
                    <td>{eventdata.PostTwoAns}</td>
                    
               
  
             
                    <td>  {eventdata.PostThreeAns && eventdata.PostThreeAns.map((threedata,i)=>{
                          return(
                            <ul  key={i} className='checkbox-data'>
                               {threedata.isChecked && threedata.isChecked === true ? <li>{threedata.name}</li>:null } 
                              
                            </ul>
                          )
                        
                            
                         
                        })}
                     </td>
                    
                    
                   
                    <td>{eventdata.PostFourAns}</td>
                    <td>{eventdata.PostFiveAns}</td>
                    
                    <td>{eventdata.PostSixAns}</td>

                  
                    <td>{eventdata.phoneNum}</td>
                    <td>{eventdata.loginTime}</td>
                   

                    
                 

                  </tr>
                )

              })
            }{
              eventData ? <div></div> : null
            }
          </tbody>
        </table>
      </section>


      <section className='box userlisting'>
        <h2>
          Registration Form
        </h2>
        <table>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              
              <th>Question 1</th>
              <th>Question 1 input</th>
              <th>Question 2</th>
              <th>Question 2 input</th>
              <th>Question 3</th>
              
              <th>Question 4</th>
             
              <th>Question 5</th>
             
            
              <th>Question 6</th>

              <th>Ph No.</th>
              <th>login time</th>
            </tr>
          </thead>
          <tbody>
            {
                eventData && eventData.map((eventdata, key = i) => {
                console.log("event data", eventdata);
                return (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{eventdata.username}</td>
                    <td>{eventdata.PreOneAns} </td>
                    <td>{eventdata.PreOneInput} </td>
                  

                    <td>{eventdata.PreTwoAns}</td>

                    <td>  {eventdata.PreThreeAns && eventdata.PreThreeAns.map((threedata,i)=>{
                          return(
                            <ul  key={i} className='checkbox-data'>
                               {threedata.isChecked && threedata.isChecked === true ? <li>{threedata.name}</li>:null } 
                              
                            </ul>
                          )
                        
                            
                         
                        })}
                     </td>
                    <td>{eventdata.PreFourAns}</td>
                    
                    
                    
                    <td>{eventdata.PreFiveAns}</td>
                    <td>{eventdata.PreSixAns}</td>
                    
                    

                  
                    <td>{eventdata.phoneNum}</td>
                    <td>{eventdata.loginTime}</td>
                   

                    
                 

                  </tr>
                )

              })
            }{
              eventData ? <div></div> : null
            }
          </tbody>
        </table>
      </section>

    </Layout>
  );
}

export default Eventdetail

export async function getServerSideProps({ query }) {
  console.log("query", query);
  return {
    props: {

      username: query
    }
  }
}
