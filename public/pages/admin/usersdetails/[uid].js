
import React, { useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc, updateDoc, query, Timestamp, orderBy } from "firebase/firestore";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Layout from '../../../component/Layout';
import Router from 'next/router';
import { MdUpload } from 'react-icons/md'
import { FiEdit } from 'react-icons/fi';
import { async } from '@firebase/util';


const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();

// const checkboxdata = [
//     { name: "i2intergrity" },
//     { name: "Release2responsibility" },
//     { name: "Selfless" },
//     { name: "Selflessshines" },
//     { name: "DynamicDecember " },
//     { name: "May" },
//     { name: "June" },
//     { name: "July" },
//     { name: "August" },
//     { name: "September" },
//     { name: "October" },
//     { name: "November" },
// ];

const UsersDetails = ({ userdetails }) => {
  const userid = userdetails.uid;
  // console.log(userid);

  const [singleUsersDetails, setsingleUsersDetails] = useState([]);

  const [username, setusername] = useState("")
  const [phoneNum, setphoneNum] = useState("")
  const [videoUrl, setvideoUrl] = useState("");
  const [eventName, seteventName] = useState("");
  const [usereditdata, setusereditdata] = useState(false);
  const [isEdit, setisEdit] = useState(true);
  const [userbadgeData, setUserbadgeData] = useState([]);
  const [eventcheckdata, seteventcheckdata] = useState([]);
  const [badgesData, setbadgesData] = useState([]);
  const [MergeArrayData, setMergeArrayData] = useState([]);
  const [error, seterror] = useState(false);


  const handleOnSubmit = async () => {
    console.log(eventcheckdata);
    const data = {
      youtubevideourl: videoUrl,
      // eventcheckdata: eventcheckdata,
      userbadge: badgesData,

    }

    if(videoUrl==="" ){
      alert("kindly fill empty field")
  }else{
      const newCityRef = doc(db, "usersdata", userid);
      console.log("users data", data);
      alert("users data added successfully")
      await updateDoc(newCityRef, data);
      // setvideoUrl("");
      Router.push("/admin/userslist");
  }
    


  }
  const handleOnSubmit2 = async () => {
    console.log(eventcheckdata);
    
    const data = {
      youtubevideourl: videoUrl,
      // eventcheckdata: eventcheckdata,
      userbadge: userbadgeData,

    }
    if(videoUrl==="" ){
      alert("kindly fill empty field")
    }else{
        const newCityRef = doc(db, "usersdata", userid);
        console.log("users data", data);
        alert("users data added successfully")
        await updateDoc(newCityRef, data);
        // setvideoUrl("");
        Router.push("/admin/userslist");

      }
  }

  const HandleEdit = () =>{
    setisEdit(false);
    usereditdata(true)
    
  
}

  const onValueChange = (item, index) => {
    console.log("test");
    const newData = [...badgesData];
    newData[index].isChecked = !item.isChecked;
    console.log("new data", newData);
    setbadgesData(newData);
  }

  const onValueChange2 = (item, index) => {
    console.log("test");
    const newData = [...userbadgeData];
    newData[index].isChecked = !item.isChecked;
    console.log("new data", newData);
    setUserbadgeData(newData);
  }



  
// program to merge and remove duplicate value from an array
  // function handleMergeArray() {
  //   for(var i = 0, l = userbadgeData.length; i < l; i++) {
  //     for(var j = 0, ll = badgesData.length; j < ll; j++) {
  //         if(userbadgeData[i].badgesname !== badgesData[j].badgesname) {
  //           userbadgeData.splice(i, 1, badgesData[j]);
  //               break;
  //           }
  //       }
  //   }
  //   console.log(userbadgeData);
  // }

//   function handleMergeArray(inArray){
//     // var arr = inArray.concat() // create a clone from inArray so not to change input array
//     // //create the first cycle of the loop starting from element 0 or n
//     // for(var i=0; i<arr.length; ++i) { 
//     //     //create the second cycle of the loop from element n+1
//     //     for(var j=i+1; j<arr.length; ++j) { 
//     //         //if the two elements are equal , then they are duplicate
//     //         if(arr[i] === arr[j]) {
//     //             arr.splice(j, 1); //remove the duplicated element 
//     //         }
//     //     }
//     console.log("Merged arrayC > "+ _.union(userbadgeData,badgesData) );
//     // }
//     // return arr;
//     // MergeArrayData = _.union(userbadgeData,badgesData);
// }
// MergeArrayData = userbadgeData.concat(badgesData);

// console.log("Removing duplicates using removeDuplicates > "+ handleMergeArray(MergeArrayData) );


  // const handleMergeArray=(userbadgeData,badgesData)=>{
    
  //   // for(let i=0;i<userbadgeData.length;i++){
  //   //   if(MergeArrayData.indexOf(userbadgeData[i]) == -1);
  //   //   MergeArrayData.push(userbadgeData[i])


 
        
  //   // }
  //   // for(let j=0;j<badgesData.length;j++){
  //   //   if(MergeArrayData.indexOf(badgesData[j]) == -1);
  //   //   MergeArrayData.push(badgesData[j])
      
  //   // }
  //    // merge two arrays
  //    let arr = userbadgeData.concat(badgesData);
  //    let MergeArrayData = [];
 
  //    // loop through array
  //    for(let i of arr) {
  //        if(MergeArrayData.indexOf(i) === -1) {
  //         MergeArrayData.push(i);
  //        }
  //    }
  //    console.log(MergeArrayData);
  //   // var myFinalArray = userbadgeData.concat(badgesData.filter((item) => userbadgeData.indexOf(item) < 0));

  //   // console.log(myFinalArray);

   

    

  // }
  // handleMergeArray(userbadgeData, badgesData);



  useEffect(() => {
    const getsingleusersdata = async () => {
      const docRef = doc(db, "usersdata", userid);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);

      if (docSnap.exists()) {
        setsingleUsersDetails(docSnap.data());
        // console.log(singleUser);
        console.log("Document data:", docSnap.data());
        setusername(docSnap.data().username);
        setphoneNum(docSnap.data().phoneNum);
        seteventName(docSnap.data().eventName);
        setUserbadgeData(docSnap.data().userbadge);
        setvideoUrl(docSnap.data().youtubevideourl);


      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

    }
    getsingleusersdata();
  }, [])

  useEffect(() => {
    seteventcheckdata(eventcheckdata);
  }, [])



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

    <Layout>

      <section className='c-form box '>
        <h2>User Details</h2>
        {/* <form  > */}
        <ul>

          {/* username */}
          <li className='form-row'>
            <h4>Name</h4>
            <div className='multipleitem usersdetails'>
              <input type="text"
                name="username"
                value={username}
                disabled
                onChange={(event) => { setusername(event.target.value) }}
                required >
              </input>

            </div>
          </li>


          {/* Phonenumber */}
          <li className='form-row'>
            <h4>Phone Number</h4>
            <div className='multipleitem usersdetails'>
              <input type="text"
                name="phonenumber"
                value={phoneNum}
                disabled
                onChange={(event) => { setphoneNum(event.target.value) }}
                required />
            </div>

          </li>



          {/* dyanmic checkbox */}
          <li className='checkbox-style'>
            <h4>Event Data</h4>

            <div className='multipleitem checkboxinput'>
             
          {  /* {badgesData && badgesData.map((eventdetails) => (
                // console.log(eventName)

                <>
                  <input

                    id={eventdetails.eventName}
                    name={eventdetails.eventName}
                    checked={eventdetails.eventName?.isChecked || false}
                    value={eventdetails.eventName}
                    type="checkbox"
                    onChange={(e) => { handlecheckbox(eventdetails, e) }}
                  //  onChange={(eventdetails) => { seteventcheckdata({eventdetails : eventdetails.eventName }); 
                  //}}

                  />

                  <label htmlFor={eventdetails.eventName}> {eventdetails.eventName} </label>
                </>

              ))} */}

              {
                userbadgeData && userbadgeData ? <>
                  {userbadgeData && userbadgeData.map((option, index) => (
                    <div className="form-check" key={option.eventName}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        // name="hobbies"
                        id={option.eventName}
                        value={option.eventName}
                        // checked="true"
                        // onChange={(e) => handleOnChange(e, option)}
                        checked={option.isChecked || false}
                        onChange={(e) => onValueChange2(option, index)}
                        key={option.eventName}
                      />
                      <label className="form-check-label" htmlFor={option.eventName}>
                        {option.eventName}
                      </label>
                    </div>
                  ))}
                </> : <>
                  {badgesData && badgesData.map((option, index) => (
                    <div className="form-check" key={option.eventName}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        // name="hobbies"
                        id={option.eventName}
                        value={option.eventName}
                        //checked="true"
                        // onChange={(e) => handleOnChange(e, option)}
                        checked={option.isChecked || false}
                        onChange={(e) => onValueChange(option, index)}
                        key={option.eventName}
                      />
                      <label className="form-check-label" htmlFor={option.eventName}>
                        {option.eventName}
                      </label>
                    </div>
                  ))}
                </>
              }

            </div>


          </li>


          {/* youtube video link  */}
       { videoUrl === "" ?  
        <li className='form-row'>
            <h4 htmlFor="validationCustom04">Youtube Video Url</h4>
            <div className='multipleitem '>
              <input type="text"
                placeholder='Link Video Url'
                name="videoUrl"
                value={videoUrl}
                onChange={(event) => { setvideoUrl(event.target.value) }} />
                                

              {/* <span class="valid-feedback">Looks good!</span> */}


            </div>
          </li> :
             <li className='form-row'>
              <h4 htmlFor="validationCustom04">Youtube Video Url</h4>
             <div className='multipleitem videoinput'>
              <input type="text"
                placeholder='Link Video Url'
                name="videoUrl"
                value={videoUrl}
                onChange={(event) => { setvideoUrl(event.target.value) }}
                 />
              
  
                {/* <span class="valid-feedback">Looks good!</span> */}
  
  
              </div>
        
            </li> }




          <li className='form-row'>
            <div>
            {
                userbadgeData && userbadgeData ? 
              <button className='submitbtn' type='submit' onClick={() => handleOnSubmit2()}>Submit</button>:<button className='submitbtn' type='submit' onClick={() => handleOnSubmit()}>Submit</button>
            }

              {/* <button className='resetbtn'>Reset</button> */}
            </div>

            {/* <div>
              <button onClick={handleMergeArray}>merge Array</button>
            </div> */}
          </li>

        </ul>
        {/* </form> */}

      </section>
    </Layout>

  )
}

export default UsersDetails
export async function getServerSideProps({ query }) {
  console.log("query", query);
  return {
    props: {

      userdetails: query
    }
  }
}