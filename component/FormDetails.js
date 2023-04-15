import React, { useEffect, useState } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc, updateDoc, deleteDoc, query } from "firebase/firestore";
import firebaseApp from '../firebaseConfig';
import { getFirestore, onSnapshot } from "firebase/firestore";
import Image from 'next/image';
const db = getFirestore();

//Image import
import topbannerimg from '../public/images/topbanner.png';
const FormDetails = () => {

        //state used for form
        const [users, setUsers] = useState([]);
        const [communiction, setCommuniction] = useState('');  
        const [twocheck, setTwoCheck] = useState('');
         const [threecheck, setThreeCheck] = useState('');
        const [fourcheck, setFourCheck] = useState([]);
        const [fivecheck, setFiveCheck] = useState('');
        const [UserData, setUserData] = useState([]);
        const [userId, setuserId] = useState('');
        const [error, seterror] = useState(false);
        const [formsubmit, setformsubmit] = useState(false)
        const usersCollectionRef = collection(db, "MonthlyMeetDynamicDecember");

        //function for add data in firebase
  const CreatForm = async (event) => {
    event.preventDefault();

    const data = {
      oneAns:communiction,
      twoAns: twocheck,
      threeAns: threecheck,
      fourAns: fourcheck,
      fiveAns: fivecheck,
    

    };

    //if user empty throw error else merge the form data in firebase
    if (userId === "") {
        seterror(true)
    }
    else {
        const cityRef = doc(db, 'MonthlyMeetDynamicDecember', userId);
        await setDoc(cityRef, data, { merge: true });
        console.log("Form data", data);
        setformsubmit(true);
    }
    
    //clear all field after submit the data
        setCommuniction("");
        setTwoCheck("");
        setThreeCheck("");
        setFourCheck("");
        setFiveCheck("");
      
    }

    //target checked data for store in firestore
    const questionTwo = (event) => {
        const target = event.target;
        if (target.checked) {
          setTwoCheck(target.value);
        }
      };
    
      const questionThree = (event) => {
        const target = event.target;
        if (target.checked) {
          setThreeCheck(target.value);
        }
      };
    
      const questionFour = (event) => {
        const target = event.target;
        if (target.checked) {
          setFourCheck(target.value);
        }
      };
    
      const questionFive = (event) => {
        const target = event.target;
        if (target.checked) {
          setFiveCheck(target.value);
        }
      };

      //get user if from adduser component
      const getUserId = (event) => {
        const target = event.target.value;
    
        setuserId(target);
        seterror(false);
        console.log(userId);
      };
    
      useEffect(() => {
        const getContent = async () => {
          const data = await getDocs(usersCollectionRef);
          // onSnapshot(collection(db, "dewdropusers3"), (snapshot) => {
          //   console.log("Suraj", snapshot);
          //   setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          // })
          setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          console.log(data);
        };
    
        getContent();
      }, []);
    
     


    return (
     <>
           {/* map the userdata  */}
        <ul>

{
    users && users.map((formUser,key=i)=>{
        console.log(formUser);
        return(
        
            <ul className="mappage">
                <li key={key}>
                {/* <p>id: {formUser.id}</p> */}
                <h2>Name: {formUser.username}</h2>
                <h4> 1. What according to you is the best means of communication? : {formUser.oneAns} </h4>
                <h4>2. What kind of a listener are you? :  {formUser.twoAns} </h4>
                <h4>3. Do you easily adapt yourself to the mode of communication being used? :  {formUser.threeAns}</h4>
                <h4>4. Have you ever experienced a setback in business due to lack of communication? :  {formUser.fourAns}</h4>
                <h4>5. How adaptable are you to communicate with strangers for business? : {formUser.fiveAns}</h4>

              
                {/* {arr.map((x, i) => <option key={i}>{x}</option>)} */}
               

            
                </li>
            </ul>
           
        )
    })
}{
    users?<div></div>:null
}
</ul>
     </>
    )
}

export default FormDetails
