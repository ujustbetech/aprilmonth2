import React, { useEffect, useState } from 'react'
import { auth } from '../firebaseConfig'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth'
import { collection, addDoc, increment, setDoc, doc, docs, getDocs, getDoc, updateDoc ,query} from "firebase/firestore";
import { getFirestore, onSnapshot } from '@firebase/firestore'
import axios from "axios";
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Image from 'next/image';


const db = getFirestore();

import logoimg from '../public/images/logo.png';
// import bgimg from "../public/images/backgroundfinal.jpeg";
import spaceximg from "../public/images/space.png";
import { async } from '@firebase/util';
// import { async } from '@firebase/util';


const Login = (props) => {
    const eventName = props.eventname;
       console.log(eventName);

    const router = useRouter();
    const [sendOtp, setsendOtp] = useState(true);
    const [verifyOtp, setverifyOtp] = useState(false);
    const [verifyName, setverifyName] = useState(false);

    const [verifynumber, setVerifynumber] = useState(false);

    const [mobilenumerror, setmobilenumerror] = useState(false);
    const [otpvaliderror, setotpvaliderror] = useState(false);
    const [nameerror, setnameerror] = useState(false);
    const [isError, setIsError] = useState(false);

    const [phoneNum, setphoneNum] = useState('')
    const [otp, setotp] = useState('');
    const [username, setusername] = useState('')
        const usersCollectionRef = collection(db, eventName);

    const [users, setUsers] = useState([]);
    const [eventData, seteventData] = useState([]);
    const [date, setdate] = useState();
    const [currentdate, setCurrentdate] = useState('');
    const [currenttime, setCurrentTime] = useState('');
    const [userLive, setuserLive] = useState(0);
    const [postEvent,setpostEvent]=useState("");




    //for recaptcha
    const configureCaptcha = () => {

        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                console.log('It works!');
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                handleSendOtp();
                console.log("recaptcha varified");
            },
            defaultCountry: "IN"
        }, auth);

    }

     // onchange number
     const handleNumber = event => {
        const result = event.target.value.replace(/\D/g, '');
        setphoneNum(result);
        if (event.target.value.length > 10 )  {
            setmobilenumerror(true);
         }
         setmobilenumerror(false);
      };


    //for send otp on mob
    const handleSendOtp = async (e) => {
        configureCaptcha();

        if (!phoneNum || phoneNum.length < 10) {
            // alert('Enter the number please')  
            setmobilenumerror(true);  


        } else {

            setVerifynumber(true);
            //varify mob number 
            axios.post('https://api.ujustbe.com/mobile-check', {

                "MobileNo": phoneNum
            })
                //if number exists
                .then(function (response) {
                    // setmobilenumerror(true)
                    //sent otp on mob number
                    const phoneNumber = "+91" + phoneNum;
                    const appVerifier = window.recaptchaVerifier;
                    console.log(phoneNumber);

                    //sign with number
                    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                        .then((confirmationResult) => {

                            // SMS sent. Prompt user to type the code from the message, then sign the
                            // user in with confirmationResult.confirm(code).
                            // confirmationResult.confirm(otp)
                            window.confirmationResult = confirmationResult;
                            console.log("otp has been sent");
                            setsendOtp(false);
                            setmobilenumerror(false);
                            setverifyOtp(true);
                            setVerifynumber(false);



                            // ...
                        })
                        .catch((error) => {
                            // Error; SMS not sent
                            // console.log(error);
                            console.log("otp has been not sent");
                         


                        });


                    //get data after otp get
                    console.log(response);
                    console.log("This Number is exists");


                })
                //if number is not exists
                .catch(function (error) {
                    // console.log("kindly enter your register number");

                    // alert("kindly enter your register number ");
                    setmobilenumerror(true)
                    setVerifynumber(false);
                    setphoneNum("");
                });
            // setsendOtp(false);
            // setotpVerify(true);
            // setverifyNumber(true);
            // setotpVerify(true);
            // //sent otp to mob number end here
            // setotpVerify(true);

        }
    }
    
    const handlekeysendotp = (event) => {
        if (event.key === 'Enter') {
            console.log('enter press here! ')
            handleSendOtp();
           
        }
    }

    // varification the otp
    const handleConfirmCode = async () => {
        const code = otp;
        console.log(code);
        setVerifynumber(true);
        window.confirmationResult.confirm(otp).then((result) => {
            // User signed in successfully.
            //alert("varification successful")
            setotp("");
            const user = result.user;
            console.log("user", user);
            setotp("");
            setverifyOtp(false);
            setotpvaliderror(false);
            setVerifynumber(false);

            setverifyName(true);


        }).catch((error) => {
            // alert("Enter valid code");
            // setIsError(true)
            setotpvaliderror(true);
            setVerifynumber(false);
            // User couldn't sign in (bad verification code?)
            console.log(error);

        });

        //  setverifyNumber(false);
        //  otpVerify(true);
    }

    const handlekeychange = (event) => {
        if (event.key === 'Enter') {
            console.log('enter press here! ')
            handleConfirmCode();
           
        }
    }

    //submit all data 
    const SubmitData = async (e) => {
        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);
        let dt = new Date().toLocaleDateString();
        let tm = new Date().toLocaleTimeString();

        event.preventDefault();

        setVerifynumber(true);
        const data = {
            username: username,
            phoneNum: phoneNum,
            loginTime: tm,
            logindate: dt,
            eventName: eventName,
        };

        if (!username) {
            // alert("Enter your Name please");
            setnameerror(true);
            setVerifynumber(false);

        } else {

            //add data to firebase
            console.log("data added to firebase", data);
            const cityRef = doc(db, eventName, phoneNum);
            const newCityRef = doc(db, "usersdata",phoneNum)

            setDoc(cityRef, data, { merge: true });
            setDoc(newCityRef, data, { merge: true });
            console.log("live people", doc.length);

            //localhost
            const usersDetails = JSON.parse(isLogin);
            localStorage.setItem('ucore', JSON.stringify(data));
            setphoneNum("");

            setusername("");

            setnameerror(false);
           
            setverifyName(false);

            // if()

            if(postEvent==="Yes"){

                router.push('/dashboard');
                

            }else{
                Router.push('/registration');
            }
             //redirect to next page
            // Router.push('/registration');
            
            //alert("you have successfully login");
          
           
        }
    }

    const handlekeysubmit = (event) => {
        if (event.key === 'Enter') {
            console.log('enter press here! ')
            SubmitData();
           
        }
    }


    useEffect(() => {
        //get all document from firebase
        const username = localStorage.getItem("username");
        const getAllData = async () => {


            // const querySnapshot = await getDocs(usersCollectionRef);
            // querySnapshot.forEach((doc) => {
            // // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            // });

            onSnapshot(collection(db, eventName), (snapshot) => {
                console.log("MM", snapshot);
                setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                const doclength = snapshot.docs.length;
                console.log(doclength);
                setuserLive(doclength);
                setUsers(localStorage.getItem('ucore'));
              

            })
           
        }

        const getEventData = async () => {

            const isLogin = localStorage.getItem("ucore");
            const usersDetails = JSON.parse(isLogin);
            console.log(usersDetails);
      
            const docRef = doc(db, "AdminMonthlyMeet", eventName);
            const docSnap = await getDoc(docRef); 
            
            if (docSnap.exists()) {
              seteventData(docSnap.data());
            // console.log(singleUser);
              console.log("event data:", docSnap.data());
            //   setpostEvent(doc.data().postEvent);
                setpostEvent(docSnap.data().postEvent);
                    
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }

        }
        
        console.log(postEvent);
        

        getEventData();
        getAllData();
    }, [])


    return (
        <>
            <div id="sign-in-button"> </div>
            <section className="c-background">

                <div className='signinContainer'>
                    <Image src={logoimg} placeholder="blur" alt='logo' width={350} height={400} />

                    {/* send otp on mob number */}


                    {sendOtp ? <div className='loginInput'>
                        <ul>
                            <li>
                             <input type="text"
                                    name="phoneNum"
                                    error={isError}
                                    value= {phoneNum}
                                    maxLength={10}
                                    onKeyPress={(e) => handlekeysendotp(e)}
                                    placeholder="Enter your Register Mobile number"
                                    onChange={handleNumber}
                                        // onChange={(e) =>{ setphoneNum(e.target.value);
                                        //     if (e.target.value.length > 10) {
                                        //         setIsError(true);}
                                        // }}
                                    size={25} />

                            </li>
                            <li>
                                <button type="submit" disabled={verifynumber} onClick={handleSendOtp}>{verifynumber ? "Verifying Number...":"GET OTP"}</button>
                            </li>
                        </ul>

                    </div> : null} {mobilenumerror ? <p>enter your 10 digit register number</p> : null}


                    {/* verify otp here */}
                    {verifyOtp ? <div className='loginInput'>
                        <ul>
                            <li>
                                <input type="password"
                                    name="otp"
                                    value={otp}
                                    error={isError}
                                    placeholder="Enter otp here"
                                    onKeyPress={(e) => handlekeychange(e)}
                                    onChange={(e) =>{ setotp(e.target.value);
                                        if (e.target.value.length > 6) {
                                            setIsError(true);}
                                                }}
                                    size={25} />

                            </li>

                            <li>
                                <button type='submit' disabled={verifynumber} onClick={() => handleConfirmCode()} >{verifynumber ? "Verifying OTP..." : "VERIFY"}</button>
                            </li>
                        </ul>
                    </div> : null} {otpvaliderror ? <p>enter six digit valid otp</p> : null}


                    {verifyName ? <div className='loginInput'>
                        <ul>
                            <li>
                                <input type="text"
                                    name="username"
                                    value={username}
                                    placeholder="Enter your Name"
                                    onKeyPress={(e) => handlekeysubmit(e)}
                                    onChange={(e) => setusername(e.target.value)}
                                    size={25} />

                            </li>
                            <li>
                                <button type="submit" disabled={verifynumber}  onClick={() => SubmitData()} >{verifynumber ? "Redirecting Home..." : "LOGIN"}</button>

                            </li>

                        </ul>

                    </div> : null} {nameerror ? <p>enter your name</p> : null}

                </div>
            </section>

        </>
    )
}

export default Login
