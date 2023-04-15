
import React,{ useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc,updateDoc,query,Timestamp,orderBy } from "firebase/firestore";
import firebaseApp from '../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import Router, { useRouter } from 'next/router';
const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();

// icon
 import { MdUpload } from 'react-icons/md'
import { async } from '@firebase/util';


const UserBadges = () => {
  
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

    const [EventCategory, setEventCategory] = useState(""); 
    const [eventData,seteventData]=useState([]);
    const [AdminEventData,setAdminEventData]=useState([]);
    const[badgebgcolor, setBadgebgcolor] = useState('');

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
  console.log(badgesUrls);



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
    
            setbadgeseventImages((badgesImages) => [...badgesImages, newImage]);
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
                        setbadgeseventUrls((badgesUrls) => [...badgesUrls, badgeseventimg]);
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
  console.log(badgeseventUrls);






  const handleSubmitBadges=async(event)=>{
    event.preventDefault();

    const data={
        badgesUpdatetime:Timestamp.now(),
        badgesname:badgesName,
        badgesdiscription:badgesDisc,
        badgesimgurls:badgesUrls,
        eventName:EventCategory,
        badgesbgcolor:badgebgcolor,
        badgeseventUrls:badgeseventUrls,

    }

    if(badgesImages==="" || badgesDisc==="" || badgesUrls==="" || badgesName==="" ||badgesImgName==="" ||badgebgcolor===""){
        seterror(true);
    }else{
        // const cityRef = doc(db,"badgesdata");
        const newCityRef = doc(collection(db, "badgesdata"))

        // const newCityRef = doc(collection(db, "badgesdata"));
        console.log("badges data",data);
        alert("badges data added successfully")
 
        await setDoc(newCityRef, data);
        Router.push("/admin/badgeslist");

        // await setDoc(doc(db, "badgesdata"), data);

        setbadgesDisc("");
        setbadgesName("");
        setbadgesImages("");
        setbadgesImgName("");
        setbadgesUrls("");
        
        setbadgeseventImgName("");
        setbadgesImages("");
        setbadgeseventUrls("");
   
        setEventCategory("");
        setBadgebgcolor("");

    }

  }

    //get event data functionality
  const GetEventCategory = (e) => {
    const target = event.target.value;
    setEventCategory(target);
    console.log(EventCategory);
}


useEffect(() => {

    const getContent = async () => {

        onSnapshot(collection(db, "AdminMonthlyMeet"), (snapshot) => {
            console.log("MM", snapshot);
            seteventData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
    }
    getContent();
}, [])



  return (
    <>
        <section className='c-form  box badgesinput'>
                <h2>Add Badges</h2>
                <form onSubmit={handleSubmitBadges} >
                <ul>

                    {/* select Event category input */}
                    <li className='form-row '>
                        <h4>Event Category</h4>
                        <div className='multipleitem'>

                            <select onChange={GetEventCategory}>
                                <option selected>Select Event Category</option>
                                {
                                    eventData && eventData.map(categoryevent => {
                                        // console.log(categoryevent);
                                        return (

                                            <option value={categoryevent.eventName} onClick={(e) => GetEventCategory(categoryevent)}>{categoryevent.eventName}</option>

                                        )
                                    })
                                }
                            </select>

                        </div>
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
                            <button className='submitbtn' type='submit'>Submit</button>
                        

                            {/* <button className='resetbtn'>Reset</button> */}
                        </div>    
                    </li>

                </ul>
            </form>

        </section>

        
    </>
 
  )
}

export default UserBadges