import Image from 'next/image';
import ujblogo from '../../public/images/ujblogo.png'
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2'
import Router, { useRouter } from 'next/router';
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc, updateDoc, query, Timestamp, orderBy } from "firebase/firestore";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();


const Header = (props)=> {
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [phoneNum, setphoneNum] = useState("");
    const [userdata, setuserdata] = useState([])
    const [isLogin, setisLogin] = useState(false);
    const [eventName, seteventName] = useState('')
   
    const router = useRouter();
    const toggleChecked = () => setIsOpen(isOpen => !isOpen);
    // const [searchName, setsearchName] = useState('');
    // const data = router.query.vid;


    // logout
    const handleLogout=()=>{

      Swal.fire({
          title: 'Close!',
          text: "Are you sure you want to logout?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.isConfirmed) {
  
            localStorage.removeItem("ucore"),
  
            Swal.fire({
              position: 'middle',
              icon: 'success',
              title: 'Logout',
              showConfirmButton: false,
              timer: 1500,
  
            }) 
            Router.push("/" + eventName);      
              
           
          }
        },
        
        )
        
        
     
      
  }

     // get single doc of badges data
   useEffect(() => {
    const isLogin = localStorage.getItem("ucore");
    const usersinfo = JSON.parse(isLogin);
    console.log(usersinfo);
    const phoneNum = usersinfo.phoneNum;
    const localeventName = usersinfo.eventName;
    // console.log(phoneNum);

  //   if (!isLogin) {
  //     console.log("not Login");
  //     Router.push("/");
  // } 

    const getsingleusersdata = async () => {
      const docRef = doc(db, "usersdata", phoneNum  );
      const docSnap = await getDoc(docRef);
      // console.log(docSnap);

      if (docSnap.exists()) {
        setuserdata(docSnap.data());
        setphoneNum(docSnap.data().phoneNum);
        seteventName(docSnap.data().eventName);
        console.log("Document data:", docSnap.data());

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    

    }
  
   
    getsingleusersdata();
  }, [])
  console.log(eventName);

  useEffect(() => {

    const isLoginData = localStorage.getItem("ucore");
    const usersDetails = JSON.parse(isLoginData);

    //   get admin login data
    const getLoginData=async()=>{
    console.log("users login",isLoginData);

    if(!isLoginData ){
      setisLogin(false)
        Router.push("/" + eventName);
    } 
    else{
      setisLogin(true);
    }
   
}

getLoginData();

}, [])

    return (
        <>
        {/* //     {isLogin ? */}
       
            <header className='m-header'>
                <div className='logo'>
                    <Image src={ujblogo} layout='responsive' />
                </div>
                <nav className={`navbar ${isOpen ? "openmenu" : ""}`}>
                    <ul>
                        <li><Link href="/dashboard"><a className={router.pathname == "/dashboard" ? "active" : ""}>Home</a></Link></li>
                        {/* <li><Link href="/feedbackform"><a className={router.pathname == "/feedbackform" ? "active" : ""}>Feedback</a></Link></li> */}
                        <li><Link href={"/userprofile/[upid]"} as={"/userprofile/" + phoneNum }><a className={router.pathname == "/userprofile/" + phoneNum ? "active" : ""}>Profile</a></Link></li>
                        <li><Link href=""><a className={router.pathname == "/" + eventName ? "active" : ""}  onClick={handleLogout}>Logout</a></Link></li>
                       
                    </ul>
                </nav>
                <div className={`hamburgerMenu ${isOpen ? "active" : ""}`} onClick={toggleChecked}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </header>
            {/*   :<div className='loader'> <span className="loader2"></span> </div>} */}
            
 

        </>
    );
}
export default Header


