import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import firebaseApp from '../firebaseConfig';
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, deleteDoc, arrayUnion, getDoc, updateDoc, query, Timestamp } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import Router from 'next/router';
import Link from 'next/link'
import Header from "../component/module/Header"

const db = getFirestore();

//Image import
import topbannerimg from '../public/images/topbanner.png';
import walogo from '../public/images/whatsapp.png'




const threecheckdata = [
    { name: "Contributor" },
    { name: "Selfless" },
    { name: "Integrity" },
    { name: "Authenticity" },   
];





const RegistrationForm = ()=> {
    const [phoneNum, setphoneNum] = useState('')
    const [username, setusername] = useState('')
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [singleUsers, setsingleUsers] = useState('');
    const [singleAdminUsers, setsingleAdminUsers] = useState('');

    // questions state

    const [onecheck, setoneCheck] = useState('');
    const [twocheck, setTwoCheck] = useState("");
    const [threecheck, setThreeCheck] = useState(threecheckdata);
    const [fourcheck, setFourCheck] = useState("");
    const [fivecheck, setFiveCheck] = useState("");
    const [sixcheck, setSixCheck] = useState("");
   
    const [showInputTwo, setShowInputTwo] = useState(false);

    const [oneQuestionInput, setOneQuestionInput] = useState("");
    const [twoQuestionInput, setTwoQuestionInput] = useState("");
 


    const [UserData, setUserData] = useState([]);
    const [userId, setuserId] = useState('');
    const [error, seterror] = useState(false);
    const [formsubmit, setformsubmit] = useState(false);
    const [formbgImage, setformbgImage] = useState('');
    const [mobileFormbg, setmobileFormbg] = useState('')
    const [eventName, seteventName] = useState('');

    // condition for input
 
 
    const [whatsappgroup, setwhatsappgroup] = useState("");


  //function for add data in firebase
  const HandleSubmitForm = async (event) => {
    event.preventDefault();

    const isLogin = localStorage.getItem("ucore");
    const usersDetails = JSON.parse(isLogin);
    console.log(usersDetails);

    const data = {
        username: username,
        phoneNum: phoneNum,
        PreOneAns: onecheck,
        preOneInput: oneQuestionInput,
        PreTwoAns: twocheck,
        preTwoInput:twoQuestionInput,
        PreThreeAns: threecheck,
        PreFourAns: fourcheck, 
        PreFiveAns: fivecheck,    
        PreSixAns: sixcheck, 
        preFormSubmit: true,
        createdBy:Timestamp.now(),

    };

    //if user empty throw error else merge the form data in firebase
    if (onecheck==="" || twocheck==="" || threecheck==="" || fourcheck==="" || fivecheck==="" || sixcheck==="" )
    {
        seterror(true);
        
        
        setThreeCheck(threecheckdata);
    }
    else {

        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        setformbgImage();
        const docRef = doc(db, usersDetails.eventName, phoneNum);
        await setDoc(docRef, data, { merge: true });

        // const docSnap = await getDoc(docRef);
        console.log("Form data", data);
        setformsubmit(true);

    };

    // clear all field after submit the data
    setoneCheck("");
    setOneQuestionInput("");
    setTwoCheck("");
    setTwoQuestionInput("");
    setThreeCheck(threecheck);
    setFourCheck("");
    setFiveCheck("");
    setSixCheck("");



}

    //target checked data for store in firestore
    const questionOne = (event) => {
        const target = event.target;
        if (target.checked) {
            setoneCheck(target.value);
            console.log(event.target.value);
        }

    };

    const questionTwo = (e) => {
        const target = event.target;
        if (target.checked) {
            setTwoCheck(target.value);
            console.log(event.target.value);
        }

    };

    const questionThree = (event) => {
        const {name,checked}= event.target;
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
  

    useEffect(() =>{
        setThreeCheck(threecheckdata);

    },[])  

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

    console.log(eventName);


    setLoading(true);

    // if(preFormSubmit){

    // Router.push("/dashboard");

    // }else{

    // }

    const getsingleDoc = async () => {

        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);
        const FormEventName = usersDetails.eventName;
        const FormPhoneNumber = usersDetails.phoneNum;


        const docRef = doc(db, FormEventName, FormPhoneNumber);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());

        if (docSnap.exists()) {
            setsingleUsers(docSnap.data());
            console.log(singleUsers);
            console.log("Document data:", docSnap.data());
            const prefillformsubmit = docSnap.data().preFormSubmit;
            if (prefillformsubmit) {

                Router.push("/dashboard");
            } else {

                // alert("kindly fill the form");
            }


        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }

    const getSingleAdminDoc = async () => {

        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);

        const docRef = doc(db, "AdminMonthlyMeet", eventName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setsingleAdminUsers(docSnap.data());
            console.log(singleAdminUsers);
            console.log("Admin Document data:", docSnap.data());
            //   console.log("Admin Document data:", docSnap.data().formimage);
            setformbgImage(docSnap.data().formImgUrls);
            setmobileFormbg(docSnap.data().mobileUrls);
            setwhatsappgroup(docSnap.data().whatsappLink);
            seteventName(docSnap.data().eventName);
            console.log(docSnap.data().whatsappLink);

            console.log(eventName);

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }



    }
    // getContent();
    getsingleDoc();
    getSingleAdminDoc();
}, []);

  return (
    <>

         <Header/>

        <section className="c-containerForm">

    <div className='topbanner'>
        <img className='desktopFormbg' src={formbgImage} />
        <img className='mobileFormbg' src={mobileFormbg} />

      
        {/* <Image src={topbannerimg} placeholder="blur" alt='logo' /> */}
        <div className="bannertext">
            <h1>{eventName}</h1>
        </div>
    </div>



    {/* form start  */}

    {
        formsubmit ?
            <div className="sucess">
                <h2> Thank you for sharing your responses.</h2>
                <h4> Kindly join the WhatsApp Group </h4>
                <div className='whatsappLink'>
                    <div className='walogo'>
                        <Image src={walogo} layout='responsive' />
                    </div>
                    <Link href={whatsappgroup} ><a className="whatsappbtn">Join WhatsApp Group</a></Link>
                </div>
                <Link href="/dashboard" ><a className="homelink">Go back to home to get zoom meeting link</a></Link>
            </div> : <div>
                <form onSubmit={HandleSubmitForm}>

                    <h2 className='h2'>
                        Fill this form to get introduce yourself to your own Responsibility
                    </h2>
                    {/* {
                error?<div className="error"><p>required</p></div>:null
                } */}
                    <div className="form-row">
                        <ul className="form-textfield">
                            <label>Name</label>
                            <li>
                                <input type="text"
                                    value={username}
                                    name="questionOne"
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
                                    name="questionOne"
                                    disabled
                                    onChange={(event) => {
                                        setphoneNum(event.target.value)
                                    }} />

                            </li>

                        </ul>
                    </div>

                         {/* 1st question */}
                        <div className="form-row radio-buttons">
                            <h2>1. Are you aware of the new version of UJustBe i.e. UJustBe Universe? <sup>*</sup></h2>
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
                            <h2>2. Do you think that you will adapt if UJustBe changes its Monthly Meeting format? <sup>*</sup></h2>

                            <ul>
                                <li>
                                    <label htmlFor="2A">
                                        <input
                                            id="2A"
                                            value="Yes"
                                            name="questionTwo"
                                            type="radio"
                                            onChange={questionTwo}
                                            checked={twocheck == 'Yes'} />
                                        <div className='custom_radio'></div>
                                        Yes
                                    </label>

                                </li>

                                <li>
                                    <label htmlFor="2B">
                                        <input
                                            id="2B"
                                            value="No"
                                            name="questionTwo"
                                            type="radio"
                                            onChange={questionTwo}
                                            checked={twocheck == 'No'} />
                                        <div className='custom_radio'></div>
                                        No</label>
                                </li>

                                {twocheck==="No" && (  <li>
                                    <input type="text"
                                            id="twoInput"
                                        value={twoQuestionInput}
                                        name="questionTwo"
                                        placeholder='Share your 2 reason'
                                        required
                                        onChange={(event) => {
                                            setTwoQuestionInput(event.target.value)
                                        }} />
                            </li> )}

                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>

                     

                        {/* 3nd question */}
                        <div className="form-row radio-buttons">
                            <h2>3. To which one of the following UJustBe’s core values you can adapt easily as a UJustBe Orbiter (Partner)? <sup>*</sup> </h2>
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
                                <h2>4. According to you, in which of the below roles, you need to be BOLD? <sup>*</sup></h2>
                                <ul>

                                    <li>
                                        <label htmlFor="4A">
                                            <input
                                                id="4A"
                                                value="Orbiter (Partner)"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Orbiter (Partner)'} />
                                            <div className='custom_radio'></div>
                                            Orbiter (Partner)</label>
                                    </li>

                                    

                                    <li>
                                        <label htmlFor="4B">
                                            <input
                                                id="4B"
                                                value="Cosmonaut (Listed Partner)"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Cosmonaut (Listed Partner)'} />
                                            <div className='custom_radio'></div>
                                            Cosmonaut (Listed Partner) </label>
                                    </li>

                                    <li>
                                        <label htmlFor="4C">
                                            <input
                                                id="4C"
                                                value="Mentor (Propeller)"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Mentor (Propeller)'} />
                                            <div className='custom_radio'></div>
                                            Mentor (Propeller)</label>
                                    </li>

                                    <li>
                                        <label htmlFor="4D">
                                            <input
                                                id="4D"
                                                value="All of the Above"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'All of the Above'} />
                                            <div className='custom_radio'></div>
                                            All of the Above </label>
                                    </li>
                                </ul>
                                {
                                    error ? <div className="error"><p>this is required</p></div> : null
                                }
                            </div>

                        

                         {/* 5th question */}
                         <div className="form-row radio-buttons">
                            <h2>5. As an Orbiter (Partner), being Bold to Adapt, which one of the below outcomes that you would achieve effortlessly?<sup>*</sup> </h2>
                            <ul>

                                    <li>
                                        <label htmlFor="5A">
                                            <input
                                                id="5A"
                                                value="Referral Fee "
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'Referral Fee '} />
                                            <div className='custom_radio'></div>
                                            Referral Fee </label>
                                    </li>

                                    <li>
                                        <label htmlFor="5B">
                                            <input
                                                id="5B"
                                                value="Holistic Personal Development in Relationships, Health & Wealth"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'Holistic Personal Development in Relationships, Health & Wealth'} />
                                            <div className='custom_radio'></div>
                                            Holistic Personal Development in Relationships, Health & Wealth </label>
                                    </li>

                                    <li>
                                        <label htmlFor="5C">
                                            <input
                                                id="5C"
                                                value="People Connection"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'People Connection'} />
                                            <div className='custom_radio'></div>
                                            People Connection</label>
                                    </li>

                                    <li>
                                        <label htmlFor="5D">
                                            <input
                                                id="5D"
                                                value="All of the Above"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'All of the Above'} />
                                            <div className='custom_radio'></div>
                                            All of the Above </label>
                                    </li>
                                </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>

                        {/* 6th question */}
                        <div className="form-row radio-buttons">
                            <h2>6. Which one of the below ways you can mould yourself as a Partner? <sup>*</sup>  </h2>
                            <ul>

                                <li>

                                    <label htmlFor="6A">
                                        <input
                                            id="6A"
                                            value="Being Part of Nucleus Team"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Being Part of Nucleus Team'} />
                                        <div className='custom_radio'></div>
                                        Being Part of Nucleus Team </label>
                                </li>
                                <li>
                                    <label htmlFor="6B">
                                        <input
                                            id="6B"
                                            value="By attending monthly and value meetings"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'By attending monthly and value meetings'} />
                                        <div className='custom_radio'></div>
                                        By attending monthly and value meetings</label>
                                </li>

                                <li>
                                    <label htmlFor="6C">
                                        <input
                                            id="6C"
                                            value="By Passing Referrals"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'By Passing Referrals'} />
                                        <div className='custom_radio'></div>
                                        By Passing Referrals </label>
                                </li>
                                <li>
                                    <label htmlFor="6D">
                                        <input
                                            id="6D"
                                            value="All of the Above"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'All of the Above'} />
                                        <div className='custom_radio'></div>
                                        All of the Above </label>
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

export default RegistrationForm