
import React,{ useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc,updateDoc,query,Timestamp,orderBy } from "firebase/firestore";
import firebaseApp from '../../firebaseConfig'
import { auth } from '../../firebaseConfig'
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Router,{useRouter} from 'next/router';
import Link from 'next/link';
import { FiEdit } from 'react-icons/fi';

const authlog = getAuth();
const db = getFirestore();
const storage = getStorage();


const Userlist = (props) => {
   

    const [userData, setUserdata] = useState([]);
    const [isLogin, setisLogin] = useState(false);
  


    useEffect(() => {

      const getContent = async () => {

          onSnapshot(collection(db, "usersdata"), (snapshot) => {
              console.log("usersdata", snapshot);
              setUserdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          });
      }
      getContent();
  }, [])

 useEffect(() => {

    const adminlogin=localStorage.getItem("ucoreadmin");

     //   get admin login data
     const getLoginData=async()=>{
      console.log("admin login",adminlogin);

      if(!adminlogin){
        setisLogin(false);
          Router.push('/admin/login');
      }
      else{
        setisLogin(true);
      }
  }

  getLoginData();
  
  }, [])
    
    
  return (
    <>
  

    {isLogin ?
    //   console.log(userData),
        <section className='c-userslist box '>
            <h2>Users Listing</h2>
            <table className='table-class'>
                                <thead>
                                    <tr>
                                        <th>Sr No.</th>
                                        <th>User Name</th>
                                        <th>Phone Number</th>
                                        <th>Action</th>
                                        <th>userprofilefrontend</th>

                                    
                                    </tr>
                                </thead>
                                <tbody>

                {/* // map the function */}
            {

                userData && userData.map((usersdetails, key=i) => {
                    // console.log("admin data", badgesdetails);
                    return (

                        <tr key={key}>
                            <td>{key + 1}</td>
                            
                            <td className='tdeventimage'>{usersdetails.username}</td>
                            <td className='tdeventimage'>{usersdetails.phoneNum}</td>
                            <td className='tdevent'>
                                            <Link href={"usersdetails/[uid]"} as={"usersdetails/" + usersdetails.id}>
                                                <a><FiEdit/>Details</a>
                                            </Link>
                            </td>
                            <td className='tdevent'>
                                            <Link href={"/userprofile/[upid]"} as={"/userprofile/" + usersdetails.id}>
                                                <a><FiEdit/>Details</a>
                                            </Link>
                            </td>
                        </tr>                        
                    )
                })
            }

            </tbody>
            </table>
        </section>
        :<div className='loader'> <span className="loader2"></span> </div>}
    </>
  )
}

export default Userlist

  