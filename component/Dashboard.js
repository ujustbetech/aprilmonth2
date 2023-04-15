import React, { useEffect, useState } from 'react'
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, arrayUnion, getDoc, updateDoc,query } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { auth } from '../firebaseConfig';
import { async } from '@firebase/util';
import Router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import zoomlogo from '../public/images/zoom.png'
import AgendaPopup from './AgendaPopup';
const db = getFirestore();

import { FaRegUser } from "react-icons/fa";


import zoomimg from '../public/images/zoom.png';
import Header from './module/Header';

const Dashboard = () => {

    const [users, setUsers] = useState('')
    const usersCollectionRef = collection(db, "DynamicDecember");
    const [phoneNum, setphoneNum] = useState('')
    const [username, setusername] = useState('')
    const [userLive, setuserLive] = useState(0);
    const [singleUsers, setsingleUsers] = useState('');
    const [eventName, seteventName] = useState('')
    const [eventDate, seteventDate] = useState('')
    const [zoomlink, setzoomlink] = useState('')
    const [DashbaordBgImg, setDashbaordBgImg] = useState('')
    const [mobileFormbg, setmobileFormbg] = useState('')
    const [eventData, seteventData] = useState([]);
    // const [userData, setuserData] = useState([]);
    const [postEvent,setpostEvent]=useState("");
    const [EventAgenda,setEventAgenda]=useState("");
    const [userData, setUserdata] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    let dt = new Date().toLocaleDateString();
    let tm = new Date().toLocaleTimeString();

    // feedback button function
    const feedbackForm = () => {

        Router.push('/feedbackform');
        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);

    }

    

    const togglePopup = () => {
        setIsOpen(!isOpen);
      }

    useEffect(() => {
        //get all document from firebase
        const isLogin = localStorage.getItem("ucore");
       
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails.username);
        setusername(usersDetails.username);
        setphoneNum(usersDetails.phoneNum);
        const localeventName = usersDetails.eventName;
        // console.log(usersDetails.eventName);

        const getContent = async () => {

            onSnapshot(collection(db, localeventName), (snapshot) => {
                console.log("MM", snapshot);
                // setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                const doclength = snapshot.docs.length;
                console.log(doclength);
                setuserLive(doclength);
                // console.log();

            });
        }

        const getsingleDoc = async () => {

            const isLogin = localStorage.getItem("ucore");
            const usersDetails = JSON.parse(isLogin);
            console.log(usersDetails);

            const docRef = doc(db, "AdminMonthlyMeet", localeventName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("get single Document data:", docSnap.data());
                setsingleUsers(docSnap.data());
                console.log(singleUsers);
                seteventName(docSnap.data().eventName);
                setzoomlink(docSnap.data().zoomlink);
                seteventDate(docSnap.data().eventDate);
                setmobileFormbg(docSnap.data().mobileUrls);
                setDashbaordBgImg(docSnap.data().dashboardUrls);
                setEventAgenda(docSnap.data().Agenda);
                setpostEvent(docSnap.data().postEvent);
                console.log("eventname",eventName);


            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");

            }
            console.log(EventAgenda);

        }

        const getuserdata = async () => {
  
            onSnapshot(collection(db, "usersdata"), (snapshot) => {
                console.log("usersdata", snapshot);
                setUserdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            });
        }

        // // user single data
        // const getuserDoc = async () => {

        //     const isLogin = localStorage.getItem("ucore");
        //     const usersinfo = JSON.parse(isLogin);
        //     const geteventName = usersinfo.eventName;
        //     console.log(usersinfo);

        //     const docRefdata = doc(collection(db,geteventName,phoneNum));
        //     const docSnapdata = await getDoc(docRefdata);
        //     // console.log(docSnapdata.data());

        //     if (docSnapdata.exists()) {
        //         console.log("users single data:", docSnapdata.data());
        //         setuserData(docSnapdata.data());
        //         console.log(userData);
              


        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");

        //     }
           
            

        // }
        // console.log(userData);

        const getEventData = async () => {
         
            const q = query(collection(db, "AdminMonthlyMeet")) ;
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              setpostEvent(doc.data().postEvent);
            });

            
           
           
        }
        console.log(postEvent);
     
        
        getContent();
        getEventData();
        getsingleDoc();
        getuserdata();
        // getuserDoc();

    }, []);

    
    useEffect(() => {

        const isLoginData = localStorage.getItem("ucore");

        //   get admin login data
        const getLoginData=async()=>{
        console.log("users login",isLoginData);

        if(!isLoginData){
         
            Router.push('/admin/login');
        }
       
    }

    getLoginData();
    
    }, [])

    // useEffect(() => {

    //     const getuserdata = async () => {
  
    //         onSnapshot(collection(db, "usersdata"), (snapshot) => {
    //             console.log("usersdata", snapshot);
    //             setUserdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //         });
    //     }
    //     getuserdata();
    // }, [])


    return (
        <>
         
            <Header/>
            <section className="c-dashboard">
                <img className="desktopFormbg" src={DashbaordBgImg} />
                <img className='mobileFormbg' src={mobileFormbg} />

                {/* <div className={"topbanner-navbar .m-header"}>
                    <div class="topnav">
                        <a href="#home">Home</a>
                        <a href="#news">Feedback</a>
                        <Link href={"/userprofile/[upid]"} as={"/userprofile/" + phoneNum }><a>Profile</a></Link>
                        <a href="#about">Logout</a>
                    </div>
                </div> */}
                
                <div className='dashboard-container'>
                    <h2>Welcome {username}</h2>

                    {/* <h1 className='EvenName'>DYNAMIC <span>DECEMBER</span></h1> */}
                    <h1 className='EvenName'>{eventName}</h1>
                    <div className="ShapeCircle2">
                        <h6>{eventDate}</h6>
                        <h2>{userLive}</h2>
                        <h4>Live Now</h4>
                    </div>

                    <div className="c-mainmeet">
                        <ul>

                            <li className="Meetinglink">
                                {/* <Image  src={zoomimg} placeholder="blur" alt='zoomimg' /> */}
                                {/* <Image src={walogo} layout='responsive' /> */}
                                <div className='zoomLogo'>
                                    <Image src={zoomlogo} layout='responsive' />
                                </div>
                                <Link href={zoomlink} ><a target="_blank"><u>{zoomlink}</u></a></Link>

                            </li>
                        {/* {postEvent=="No" ?   */}
                          <li className="btn">
                                
                            {/* </li>   */}
                            {/* <li className="btn"> */}
                                <button
                                    type="submit"  onClick={togglePopup} >Agenda of Event</button> 
                               {/* <button  className='feedback-btn'
                                    type="submit"
//                                      disabled
                                    onClick={() => feedbackForm()}>Fill Your Feedback</button> */}
                            </li>
                            {/* } */}

                            {/* <iframe src="https://us02web.zoom.us/j/83409189705?pwd=dS9mWkdaVlhtdkJjVTdlRndwNWFXZz09#success" width={500} height={300} allow="camera; microphone; fullscreen; speaker; display-capture"></iframe> */}
                        </ul>
                    </div>
                </div>


                {isOpen && <AgendaPopup
                    content={ <>
                        <h2>Event Agenda</h2>
                        <div className='agendaDetails' dangerouslySetInnerHTML={{ __html: EventAgenda }}></div>
                        {/* <ul><li>{EventAgenda}</li></ul> */}
                    </>}
                    handleClose={togglePopup}
                    />}
            </section>
        </>
    )
}

export default Dashboard
