import React,{ useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc,updateDoc,query,Timestamp,orderBy } from "firebase/firestore";
import firebaseApp from '../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();

import { FiEdit } from 'react-icons/fi';

const BadgesList = () => {

    const [badgesData, setbadgesData] = useState([]);
    const [isLogin, setisLogin] = useState(false);


    useEffect(() => {

        const getContent = async () => {

            onSnapshot(collection(db, "badgesdata"), (snapshot) => {
                console.log("badgesdatas", snapshot);
                setbadgesData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            });
        }
        getContent();
    }, [])
    
  return (
      
    <section className='c-badgeslist box '>
        <h2>Badges Listing</h2>
    <table className='table-class'>
                        <thead>
                            <tr>
                                <th>Sr No.</th>
                                <th>Event Name</th>
                                <th>Badges Name</th>
                                <th>Badges Color</th>
                                <th>Badges Discription</th>
                                <th>Badges File</th>
                                <th>Badges Event File</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

        {/* // map the function */}
    {

    badgesData && badgesData.map((badgesdetails, key=i) => {
            // console.log("admin data", badgesdetails);
            return (

                        <tr key={key}>
                            <td>{key + 1}</td>
                         
                            <td className='tdeventimage'>{badgesdetails.eventName}</td>
                            <td className='tdeventimage'>{badgesdetails.badgesname}</td>
                            <td className='tdeventimage'>{badgesdetails.badgesbgcolor}</td>
                            <td className='tdeventimage'>{badgesdetails.badgesdiscription}</td>
                            <td className='tdeventimage'><img src={badgesdetails.badgesimgurls}/></td>
                            <td className='tdeventimage'><img src={badgesdetails.badgeseventUrls}/></td>
                           

                            <td className='tdevent'>
                                            <Link href={"badgesdetails/[bid]"} as={"badgesdetails/" + badgesdetails.id}>
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

  )
}

export default BadgesList