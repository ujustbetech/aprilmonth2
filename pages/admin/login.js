import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { auth } from '../../firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import { collection, ref, push,addDoc, setDoc, doc, docs, getDocs, arrayUnion,getDoc,updateDoc } from "firebase/firestore";
import { getFirestore ,onSnapshot} from "firebase/firestore";
const db = getFirestore();
import Router from 'next/router';

// import images
// import bgimg from "../../public/images/backgroundfinal.jpeg"
import officeimg from "../../public/images/office.png";
import ujblogoimg from '../../public/images/ujblogo.png';


const authlog = getAuth();

const Login = () => {
    const [loginsuccess,setloginsuccess]=useState(true)
    const [adminLoginStatus,setadminLoginStatus]=useState(true)

    
    const [successful,setsuccessfull]=useState(false);
    const [currentuser, setcurrentuser] = useState('');
    const [date, setdate] = useState();
    const [currentdate, setCurrentdate] = useState('');
    const [currenttime, setCurrentTime] = useState('');
    let dt = new Date().toLocaleDateString();
    let tm = new Date().toLocaleTimeString();
    const usersCollectionRef = collection(db, "AdminMonthlyMeet");

    const handleMicrosoftLogin = async () => {
        const isLogin = localStorage.getItem("ucoreadmin");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);
        const microsoftProvider = new OAuthProvider('microsoft.com');
        
        signInWithPopup(auth, microsoftProvider).then((res) => {
            let dt = new Date().toLocaleDateString();
            let tm = new Date().toLocaleTimeString();
            setcurrentuser(res.user.displayName);

                let data = {
                    currentuser: res.user.displayName,
                    currentTime: tm,
                    Date: dt,
                } 

                console.log("response",res );
                console.log(data);
                const usersDetails = JSON.parse(isLogin)
                localStorage.setItem('ucoreadmin', JSON.stringify(data))
    
                Router.push("/admin/addEvent")

            }).catch((err) => {
                console.log(err);
            })
    
    }
    useEffect(()=>{

        const Adminlogin = localStorage.getItem("ucoreadmin");
            
        const getData=async()=>{
            console.log("admin login",Adminlogin);
    
            if(Adminlogin != null){
                setadminLoginStatus(false);
                Router.push('/admin/addEvent');
            }
            else{
                setadminLoginStatus(true);
            }
        }
        getData();
    
    }, [])

    return (
        <div>

        
       
             <section className="c-background">
             {   adminLoginStatus ? null:
                        <div className='loaderAdmin'> 
                                <p>Checking if you have already logged In...</p> 
                        </div>
            
        }
                 {/* <h2>Release through Responsibility</h2> */}
                <div className="signin-box">
                    <Image src={ujblogoimg} width={120} height={120} alt="logo" />
                    
                 {loginsuccess ?    <div>

                            <h1>Welcome</h1>
                            <button
                                onClick={() => handleMicrosoftLogin()}    >
                                <Image src={officeimg} width={30} height={30} alt="images" />
                                <p>Get In</p>
                            </button>
                        </div>:null }{successful ? <p>you have successfully login</p>: null}
                     
                       
                    
                </div>
            </section>
        </div>
    )
}

export default Login
