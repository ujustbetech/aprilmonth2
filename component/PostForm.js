import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import firebaseApp from '../firebaseConfig';
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, deleteDoc, arrayUnion, getDoc,Timestamp, updateDoc, query } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import Router from 'next/router';
import Link from 'next/link'
import zoomlogo from '../public/images/zoom.png'
import Header from "../component/module/Header"
const db = getFirestore();

//Image import
import topbannerimg from '../public/images/topbanner.png';

const threecheckdata = [
    { name: "There are consistent and bold Orbiters (Partners) who are passing at least one referral per month" },
    { name: "There are consistent and bold Cosmonauts (Listed Partners) who are creating impact by closing minimum one deal every month" },
    { name: "There are consistent and bold Propeller (Mentors) who are empowering at least one Orbiter to become active every month " },
    { name: "Only those, who are contributors, are growing in UJustBe Universe" },   
    { name: "All of the above" },   
      
];




const PostForm = () => {

    //state used for form
    const [phoneNum, setphoneNum] = useState('')
    const [username, setusername] = useState('')
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [singleUsers, setsingleUsers] = useState('');


    const [onecheck, setoneCheck] = useState('');
    const [twocheck, setTwoCheck] = useState('');
    const [threecheck, setThreeCheck] = useState(threecheckdata);
    const [fourcheck, setFourCheck] = useState([]);
    const [fivecheck, setFiveCheck] = useState('');

    const [sixcheck, setSixCheck] = useState('');
    // const [sevencheck, setSevenCheck] = useState('');

    const [oneQuestionInput, setOneQuestionInput] = useState("");
    const [fourQuestionInput, setFourQuestionInput] = useState("");

   
    const [UserData, setUserData] = useState([]);
    const [userId, setuserId] = useState('');
    const [error, seterror] = useState(false);
    const [formsubmit, setformsubmit] = useState(false)

    const [postfeedbackImg, setpostfeedbackImg] = useState('')
    const [mobileFormbg, setmobileFormbg] = useState('')
    const [eventName, seteventName] = useState('')
    const [secondInput, setsecondInput] = useState("");
    const [second, setsecond] = useState(false);
    const [whatsappgroup, setwhatsappgroup] = useState("");




    //function for add data in firebase
    const CreatForm = async (event) => {
        event.preventDefault();

        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);

        const data = {

            username: username,
            phoneNum: phoneNum,
            PostOneAns: onecheck,
            PostOneInput:oneQuestionInput,
            PostTwoAns: twocheck,
            PostThreeAns: threecheck,
            PostFourAns: fourcheck,
            PostFourInput:fourQuestionInput,
            PostFiveAns: fivecheck,
            PostSixAns:sixcheck,
            // PostSevenAns:sevencheck,
            postfeedbackImg: postfeedbackImg,
            createdBy:Timestamp.now(),


        };

        //if user empty throw error else merge the form data in firebase
          //if user empty throw error else merge the form data in firebase
        if (onecheck==="" || twocheck==="" || threecheck==="" || fourcheck==="" || fivecheck==="" || sixcheck==="")
        {
            seterror(true);
            setThreeCheck(threecheckdata);
            // setFiveCheck(fivecheckdata);
        }
        else {
            const isLogin = localStorage.getItem("ucore");
            const usersDetails = JSON.parse(isLogin);

            setpostfeedbackImg();
            const docRef = doc(db, usersDetails.eventName, phoneNum);

            await setDoc(docRef, data, { merge: true });
           
            console.log("Feedback data", data);

            setformsubmit(true);

        }

        //clear all field after submit the data
        setoneCheck("");
        setOneQuestionInput("");
        setTwoCheck("");
        setThreeCheck(threecheck)
        setFourCheck("");
        setFourQuestionInput("");
        setFiveCheck("");
        setSixCheck("");
        // setSevenCheck("");
        // setformbgImage("");
        // setwhatsappLink("");
        //   Router.push('/dashboard');
    }

    //target checked data for store in firestore

    const questionOne = (event) => {
        const target = event.target;
        if (target.checked) {
            setoneCheck(target.value);
            console.log(event.target.value);
        }

    };

    const questionTwo = (event) => {
        const target = event.target;
        if (target.checked) {
            setTwoCheck(target.value);
            console.log(event.target.value);
        }

    };
    const questionThree = (e) => {
        const {name,checked}= e.target;
        let tempThreeData=threecheck.map((threedetails)=>
        threedetails.name === name ? { ...threedetails, isChecked:checked } : threedetails);
        setThreeCheck(tempThreeData);

        console.log("threequestion",threecheck);
    };

    const questionFour = (event) => {
        const target = event.target;
        if (target.checked) {
            setFourCheck(target.value);
            console.log(event.target.value);
        }
    };
    const questionFive = (event) => {
        const target = event.target;
        if (target.checked) {
            setFiveCheck(target.value);
            console.log(event.target.value);
        }
    };



    const questionSix = (event) => {
        const target = event.target;
        if (target.checked) {
            setSixCheck(target.value);
            console.log(event.target.value);
        }
    };

    // const questionSeven = (event) => {
    //     const target = event.target;
    //     if (target.checked) {
    //         setSevenCheck(target.value);
    //         console.log(event.target.value);
    //     }
    // };

    useEffect(() =>{
       
        setThreeCheck(threecheckdata);
        // setFiveCheck(fivecheckdata);

    },[]);

    useEffect(() => {
        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);

        console.log(usersDetails.username);
        console.log(usersDetails.phoneNum);
        setusername(usersDetails.username);
        setphoneNum(usersDetails.phoneNum);
        seteventName(usersDetails.eventName);
        
        const eventName = usersDetails.eventName;
        // console.log(eventName);

        setLoading(true);

        const getContent = async () => {

            onSnapshot(collection(db, eventName), (snapshot) => {
                console.log("MMform", snapshot);

            });
        }
        const getsingleDoc = async () => {

            const isLogin = localStorage.getItem("ucore");
            const usersDetails = JSON.parse(isLogin);
            console.log(usersDetails);

            const docRef = doc(db, "AdminMonthlyMeet", eventName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setsingleUsers(docSnap.data());
                console.log(singleUsers);
                console.log("Document data:", docSnap.data());
                setpostfeedbackImg(docSnap.data().formImgUrls);
                setmobileFormbg(docSnap.data().mobileUrls);
                seteventName(docSnap.data().eventName);
                // setwhatsappgroup(docSnap.data().whatsappLink);
                console.log(docSnap.data().whatsappLink);


            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }

        }
        // getContent();
        getsingleDoc();
    }, []);


    return (
      <>

            <Header/>
            <section className="c-containerForm">

                <div className='topbanner'>
                    <img className='desktopFormbg' src={postfeedbackImg} />
                    <img className='mobileFormbg' src={mobileFormbg} />
                    {/* <Image src={topbannerimg} placeholder="blur" alt='logo' /> */}

                    

                    {/* <div class="topbanner-navbar ">
                        <div class="topnav">
                            <a href="#home">Home</a>
                            <a href="#news">Feedback</a>
                            <a href={"userprofile/[upid]"} as={"userprofile/" + phoneNum}>Profile</a>
                            <a href="#about">Logout</a>
                        </div>
                    </div> */}
                    <div className="bannertext">
                        <h1>{eventName}</h1>
                    </div>
                </div>

                {/* form start  */}

                {
                    formsubmit ? <div className="sucess">
                        <h2>  Thank you for sharing your responses. </h2>

                        <Link href="/dashboard" ><a className="homelink">Go back to home</a></Link>

                    </div> : <div>
                        <form>
                            {/* {
                        error?<div className="error"><p>required</p></div>:null
                        } */}
                            <div className="form-row">
                                <ul className="form-textfield">
                                <label>Name</label>
                                    <li>
                                        <input type="text"
                                            value={username}
                                            name="username"
                                            disabled
                                            onChange={(event) => {
                                                setusername(event.target.value)
                                            }} />

                                    </li>

                                </ul>
                            </div>
                            
                            <div className="form-row">
                                <ul className="form-textfield">
                                    <label>Phone Number</label>
                                    <li>
                                        <input type="text"
                                            value={phoneNum}
                                            name="phonenumber"
                                            disabled
                                            onChange={(event) => {
                                                setphoneNum(event.target.value)
                                            }} />

                                    </li>

                                </ul>
                            </div>

                                {/* 1st question */}
                        <div className="form-row radio-buttons">
                            <h2>1. Do you think that the Nucleus Team members represents the BOLD value in the Monthly Meetings?<sup>*</sup></h2>
                            <ul>

                                <li>

                                    <label htmlFor="1A">
                                        <input
                                            id="1A"
                                            value="Yes"
                                            name="questionOne"
                                            type="radio"
                                            onChange={questionOne}
                                            checked={onecheck == 'Yes'} />
                                        <div className='custom_radio'></div>
                                        Yes </label>
                                </li>
                                <li>
                                    <label htmlFor="1B">
                                        <input
                                            id="1B"
                                            value="No"
                                            name="questionOne"
                                            type="radio"
                                            onChange={questionOne}
                                            checked={onecheck == 'No'} />
                                        <div className='custom_radio'></div>
                                        No</label>
                                </li>

                                

                                {onecheck==="No" && (  <li>
                                        <input type="text"
                                             id="oneInput"
                                            value={oneQuestionInput}
                                            name="questionOne"
                                            placeholder='Share reason '
                                            required
                                            onChange={(event) => {
                                                setOneQuestionInput(event.target.value)
                                            }} />
                                </li> )}

                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>


                        {/* 2nd question */}
                        <div className="form-row radio-buttons">
                            <h2>2. Do you like to represent yourself the way Nucleus Team Member represented in the Monthly Meeting?<sup>*</sup></h2>

                            <ul>
                            <li>
                                    <label htmlFor="2B">
                                        <input
                                            id="2B"
                                            value="Yes"
                                            name="questionTwo"
                                            type="radio"
                                            onChange={questionTwo}
                                            checked={twocheck == 'Yes'} />
                                        <div className='custom_radio'></div>
                                        Yes</label>
                                </li>
                                <li>
                                    <label htmlFor="2A">
                                        <input
                                            id="2A"
                                            value="No"
                                            name="questionTwo"
                                            type="radio"
                                            onChange={questionTwo}
                                            checked={twocheck == 'No'} />
                                        <div className='custom_radio'></div>
                                        No
                                    </label>

                                </li>

                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>

                     

                        {/* 3nd question */}
                        <div className="form-row radio-buttons">
                            <h2>3. a participant, what did you observe in today’s Monthly Meeting?<sup>*</sup> </h2>
                            <ul>

                                <li >
                                    {threecheck && threecheck.map((threedata)=>(
                                    <>

                                    <div > 
 
                                                <input
                                                    id={threedata.name}
                                                    value={threedata}
                                                    name={threedata.name}
                                                    checked={threedata?.isChecked || false }
                                                    type="checkbox"
                                                    // required
                                                    onChange={questionThree} />
                                            
                                                <label  className='checkbox-label' htmlFor={threedata.name}> {threedata.name} </label>
                                    </div>
                                    </>
                                    ))}
                                </li>
                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>

                        {/* 4th question */}
                        <div className="form-row radio-buttons">
                                <h2>4. Do you think that you can explore and grow in UJustBe without being BOLD?<sup>*</sup></h2>
                                <ul>

                                    <li>
                                        <label htmlFor="4A">
                                            <input
                                                id="4A"
                                                value="Yes"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Yes'} />
                                            <div className='custom_radio'></div>
                                            Yes</label>
                                    </li>
                                    <li>
                                        <label htmlFor="4B">
                                            <input
                                                id="4B"
                                                value="No"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'No'} />
                                            <div className='custom_radio'></div>
                                            No</label>
                                    </li>

                                    

                                    {fourcheck==="Yes" && (  <li>
                                        <input type="text"
                                             id="fourInput"
                                            value={fourQuestionInput}
                                            name="questionFour"
                                            placeholder='then share How'
                                            required
                                            onChange={(event) => {
                                                setFourQuestionInput(event.target.value)
                                            }} />
                                </li> )}

                                </ul>
                                {
                                    error ? <div className="error"><p>this is required</p></div> : null
                                }
                            </div>

                        

                         {/* 5th question */}
                         <div className="form-row radio-buttons">
                                <h2>5. Which of the below 2 ways, you think is the best way to communicate your requirements?<sup>*</sup></h2>
                                <ul>

                                    <li>
                                        <label htmlFor="5A">
                                            <input
                                                id="5A"
                                                value="UJustBe App"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'UJustBe App'} />
                                            <div className='custom_radio'></div>
                                            UJustBe App</label>
                                    </li>
                                    <li>
                                        <label htmlFor="5B">
                                            <input
                                                id="5B"
                                                value="WhatsApp"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'WhatsApp'} />
                                            <div className='custom_radio'></div>
                                            WhatsApp</label>
                                    </li>

                                </ul>
                                {
                                    error ? <div className="error"><p>this is required</p></div> : null
                                }
                            </div>

                        {/* 6th question */}
                        <div className="form-row radio-buttons">
                            <h2>6. Will you like to be part of the Nucleus Team to empower other Orbiters (Partners) using your skills and experience?   <sup>*</sup>  </h2>
                            <ul>

                                <li>

                                    <label htmlFor="6A">
                                        <input
                                            id="6A"
                                            value="Yes"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Yes'} />
                                        <div className='custom_radio'></div>
                                        Yes </label>
                                </li>
                                <li>
                                    <label htmlFor="6B">
                                        <input
                                            id="6B"
                                            value="No"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'No'} />
                                        <div className='custom_radio'></div>
                                        No</label>
                                </li>

                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                         </div>



                            {/* submit button */}
                            <div>
                                <button
                                    type="submit"
                                    onClick={CreatForm}
                                >Submit
                                </button>
                            </div>

                        </form>
                    </div>
                }

                {/* form end here */}

            </section>
    </>
    )
}

export default PostForm


