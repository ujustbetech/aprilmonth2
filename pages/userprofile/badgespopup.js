import React,{useState,useEffect} from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc, updateDoc, query, Timestamp, orderBy } from "firebase/firestore";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();

const BadgesPopup = (props) => {

const [badgesData, setbadgesData] = useState([])
const[badgebgcolor, setBadgebgcolor] = useState('');


  useEffect(() => {
    const getContent = async () => {
      onSnapshot(collection(db, "badgesdata"), (snapshot) => {
        console.log("badgesdata", snapshot);
        setbadgesData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    }
    getContent();
    console.log(badgesData);
  }, [])

  return (
  <>
    {/* { badgesData && badgesData.map((badges, key = i) => { */}

        <div className="badgespopup-box">
            <div className="box" >
            <span className="close-icon" onClick={props.handleClose}>x</span>
              {props.content}
            </div>
      </div>
      
    {/* })} */}
  </>
  );
}

export default BadgesPopup