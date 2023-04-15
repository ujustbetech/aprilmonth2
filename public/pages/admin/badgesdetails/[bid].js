
import React, { useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc,updateDoc,query,Timestamp,orderBy } from "firebase/firestore";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Layout from '../../../component/Layout';
import Router from 'next/router';
import { MdUpload } from 'react-icons/md'
import { FiEdit } from 'react-icons/fi';

    
const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();

const BadgesDetails = ({ Badgesdetail }) => {
    const badgesid = Badgesdetail.bid;
    // console.log(badgesid);

    const [singleDetails, setsingleDetails] = useState([])
    const [eventCategoryData, seteventCategoryData] = useState([]);
    const [eventcategorydetails, seteventcategorydetails] = useState(false);
    const [isEdit, setisEdit] = useState(true);
    const [badgesDisc, setbadgesDisc] = useState("")
    const [badgesName, setbadgesName] = useState("")
       // badges images
    const [badgesImgName, setbadgesImgName] = useState("No file choosen");
    const [badgesImages, setbadgesImages] = useState('');
    const [badgesUrls, setbadgesUrls] = useState('');

    
    // badges event name
    const [badgeseventImgName, setbadgeseventImgName] = useState("No file choosen");
    const [badgeseventImages, setbadgeseventImages] = useState('');
    const [badgeseventUrls, setbadgeseventUrls] = useState('');

    const[badgebgcolor, setBadgebgcolor] = useState('');
    const [EventCategory, setEventCategory] = useState(""); 
    const [progress, setProgress] = useState(0);
    const [badgesfileloading, setbadgesfileloading] = useState(false);
    const [badgeseventfileloading, setbadgeseventfileloading] = useState(false);
    const [error, seterror] = useState(false);

      //badges Images onchange
  const handlebadgesImages = (e) =>{
    // console.log(e.target.files[0]);
    setbadgesfileloading(false);
    const file = e.target.files[0];
    const badgesImgName = e.target.files[0].name;
    setbadgesImgName(badgesImgName);
    console.log("badges images", badgesImgName);

    for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        console.log(newImage);
        newImage["id"] = Math.random();

        setbadgesImages((badgesImages) => [...badgesImages, newImage]);
    }
  }

  // badges upload the file functionality
  const handleBadgesFileUpload = (e) => {
    const promises = [];
    setbadgesUrls("");
    setbadgesfileloading(true);
   
        badgesImages.map((image) => {
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
                    getDownloadURL(uploadTask.snapshot.ref).then((badgesimg) => {
                        //   setUrls((prevState) => [...prevState, urls]);
                        setbadgesUrls((badgesUrls) => [...badgesUrls, badgesimg]);
                        //   setUrls( [...urls, urls]);
                    });
                },
            );
            //   
        });
    // }

    Promise.all(promises)
        .then(() => {alert("badges file images upload successfully");
        setbadgesfileloading(false)})
        .catch((err) => console.log(err));

  }  
//   console.log(badgesUrls);

    //badges event Images onchange
    const handlebadgeseventbg = (e) =>{
        // console.log(e.target.files[0]);
        setbadgeseventfileloading(false);
        const file = e.target.files[0];
        const badgeseventImgName = e.target.files[0].name;
        setbadgeseventImgName(badgeseventImgName);
        console.log("badges bg images", badgeseventImgName);
    
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            console.log(newImage);
            newImage["id"] = Math.random();
    
            setbadgeseventImages((badgeseventImages) => [...badgeseventImages, newImage]);
        }
    }

    // badges event upload the file functionality
  const handleBadgeseventfile = (e) => {
    const promises = [];
    setbadgeseventUrls("");
    setbadgeseventfileloading(true);
   
            badgeseventImages.map((image) => {
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
                    getDownloadURL(uploadTask.snapshot.ref).then((badgeseventimg) => {
                        //   setUrls((prevState) => [...prevState, urls]);
                        setbadgeseventUrls((badgeseventUrls) => [...badgeseventUrls, badgeseventimg]);
                        //   setUrls( [...urls, urls]);
                    });
                },
            );
            //   
        });
    // }

    Promise.all(promises)
        .then(() => {alert("badges file images upload successfully");
        setbadgeseventfileloading(false)})
        .catch((err) => console.log(err));

  }  
//   console.log(badgeseventUrls);




  const handleEditSubmitBadges=async(event)=>{
    event.preventDefault();

    const data={
        badgesUpdatetime:Timestamp.now(),
        badgesname:badgesName,
        badgesdiscription:badgesDisc,
        badgesimgurls:badgesUrls,
        badgesbgcolor:badgebgcolor,
        eventName:EventCategory,
        badgeseventUrls:badgeseventUrls,

    }

    // if(badgesImages==="" || badgesDisc==="" || badgesUrls==="" || badgesName==="" || badgebgcolor===""){
    //     alert("fill input field")
    // }else{
      
        const newCityRef = doc(db, "badgesdata",badgesid);
        console.log("updated badges data",data);
        alert("badges data updated successfully")
 
        await updateDoc(newCityRef, data);
      

        setbadgesDisc("");
        setbadgesName("");
        setbadgesImages("");
        setbadgesImgName("");
        setbadgesUrls("");

        setbadgeseventImgName("");
        setbadgeseventImages("");
        setbadgeseventUrls("");
        setBadgebgcolor("");
        setEventCategory("");

        Router.push('/admin/badgeslist');

    // }

  }

     //get event data functionality
     const GetEventCategory = (e) => {
      const target = event.target.value;
      setEventCategory(target);
      console.log(EventCategory);
    }
  const HandleEdit = () =>{
    setisEdit(false);
    seteventcategorydetails(true);
}
  
  useEffect(() => {

      const getContent = async () => {
  
          onSnapshot(collection(db, "AdminMonthlyMeet"), (snapshot) => {
            console.log("Eventcategorydata", snapshot);
            seteventCategoryData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          });
      }
      getContent();
  }, [])


  useEffect(() => {
    const getsinglebadgesdata = async () => {

      const docRef = doc(db,"badgesdata",badgesid);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);
    
      
      if (docSnap.exists()) {
        setsingleDetails(docSnap.data());
      // console.log(singleUser);
        console.log("Document data:", docSnap.data());
        setbadgesName(docSnap.data().badgesname);
        setbadgesDisc(docSnap.data().badgesdiscription);
        setbadgesUrls(docSnap.data().badgesimgurls);
        setEventCategory(docSnap.data().eventName);
        setBadgebgcolor(docSnap.data().badgesbgcolor);
        setbadgeseventUrls(docSnap.data().badgeseventUrls);

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
   
    }
    getsinglebadgesdata();
  }, [])
    

  return (

    console.log(singleDetails),
    <>
        <Layout>
        <section className='c-form  box badgesinput'>
                <h2>Badges Edit</h2>
                {/* <form  > */}
                <ul>

                    {/* select Event category input */}
                    <li className='form-row '>
                        <h4>Event Category</h4>
                        {eventcategorydetails ?  
                        <div className='multipleitem'>

                            <select onChange={GetEventCategory}>
                                <option selected>Select Event Category</option>
                                {
                                    eventCategoryData && eventCategoryData.map((categoryevent,l) => {
                                        // console.log(categoryevent);
                                        return (

                                            <option key={l} value={categoryevent.eventName} onClick={(e) => GetEventCategory(categoryevent)}>{categoryevent.eventName}</option>

                                        )
                                    })
                                }
                            </select>

                        </div>:<div className='businessc' > {EventCategory}  <button onClick={HandleEdit}><FiEdit/></button> </div>}

                    </li>


                    {/* dashboard bg img */}
                    <li className='form-row'>
                        <h4>Badges File</h4>
                    <div className='multipleitem'>

                            <input id="file-upload"
                            type="file" 
                            multiple
                            required
                            onChange={handlebadgesImages} />

                    <label htmlFor='file-upload' className='custom-file-upload'> {badgesfileloading ?"uploading..." : "File upload"} </label>
                    
                        <span className='filename'  id="file-upload">{badgesImgName}</span>
                        <span onClick={handleBadgesFileUpload} className='uplaod-icon'><MdUpload /></span>

                        <span className='img-view'> {badgesUrls && badgesUrls.map((badgesimgfile, i) => (
                                <img
                                    key={i}
                                    style={{ width: "100px" }}
                                    src={badgesimgfile || "http://via.placeholder.com/300"}
                                    alt="dashboard-image"
                                />
                        ))}</span>

                    
                        </div> 
                    
                    </li>     

                     {/* badges bg img */}
                    <li className='form-row'>
                        <h4>Badges Event File</h4>
                    <div className='multipleitem'>

                            <input id="badges-event"
                            type="file" 
                            multiple
                            required
                            onChange={handlebadgeseventbg} />

                    <label htmlFor='badges-event' className='custom-file-upload'> {badgeseventfileloading ?"uploading..." : "File upload"} </label>
                    
                        <span className='filename'  id="badges-event">{badgeseventImgName}</span>
                        <span onClick={handleBadgeseventfile} className='uplaod-icon'><MdUpload /></span>

                        <span className='img-view'> {badgeseventUrls && badgeseventUrls.map((badgeseventimg, i) => (
                                <img
                                    key={i}
                                    style={{ width: "100px" }}
                                    src={badgeseventimg || "http://via.placeholder.com/300"}
                                    alt="dashboard-image"
                                />
                        ))}</span>

                    
                        </div> 
                    
                    </li>                            
                                          
                    
                    {/* badges name */}
                    <li className='form-row'>
                        <h4>Badges Name</h4>
                        <div className='multipleitem'>
                            <input type="text"
                                placeholder='Badges Name'
                                name="badgesname"
                                value={badgesName}
                                onChange={( event ) => {setbadgesName(event.target.value)}}
                                required >
                            </input>                    
                            
                        </div>
                    </li>

                       {/* badges color */}
                       <li className='form-row'>
                        <h4> background Color</h4>
                        <div className='multipleitem'>
                            <input type="text"
                                placeholder='Badges color'
                                name="badgescolor"
                                value={badgebgcolor}
                                onChange={( event ) => {setBadgebgcolor(event.target.value)}}
                                required >
                            </input>                    
                            
                        </div>
                    </li>



                    {/* badges Discription */}
                    <li className='form-row'>
                        <h4>Badges Discription</h4>
                        <div className='multipleitem'>
                        <textarea type="text"
                            placeholder='badges discription'
                            name="badgesdiscription" 
                            value={badgesDisc}
                            onChange={( event ) => { setbadgesDisc(event.target.value)}} 
                            required />
                        </div>
                    
                    </li>


                    <li className='form-row'>
                        <div>
                            <button className='submitbtn' type='submit' onClick={handleEditSubmitBadges}>Submit</button>
                        

                            {/* <button className='resetbtn'>Reset</button> */}
                        </div>    
                    </li>

                </ul>
            {/* </form> */}

        </section>
        </Layout>
     </>

  )
}

export default BadgesDetails

export async function getServerSideProps({ query }) {
    console.log("query", query);
    return {
      props: {
  
        Badgesdetail: query
      }
    }
  }