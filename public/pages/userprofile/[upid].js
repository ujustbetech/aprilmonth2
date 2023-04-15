import React, { useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc, updateDoc, query, Timestamp, orderBy } from "firebase/firestore";
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Layout from '../../component/Layout';
import Footer from '../../component/module/Footer';
import Link from 'next/link';
import Router from 'next/router';
import { MdUpload } from 'react-icons/md'
import { FiEdit } from 'react-icons/fi';
import Image from "next/image"
import { AiOutlineCamera } from 'react-icons/ai';
import { FiSave } from 'react-icons/fi';
import { useRouter } from "next/router";
import BadgesPopup from './badgespopup';
import Swal from 'sweetalert2';
import { FiShare2 } from 'react-icons/fi'
// import { RWebShare } from "react-web-share";
import { IoShareOutline } from 'react-icons/io5'
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon, WhatsappShareButton, WhatsappIcon } from 'next-share';
const authlog = getAuth();
const storage = getStorage();
const db = getFirestore();

import profileimg from '../../public/images/profileplaceholer.jpg'
import BadgesDetails from '../admin/badgesdetails/[bid]';
import ujblogoimg from '../../public/images/ujblogo.png';



const UserProfile = ({ userprofiledetails }) => {
  const userprofileid = userprofiledetails.upid;
  // console.log(userprofileid);

  const [userData, setuserData] = useState([]);
  const [userDatanew, setuserDatanew] = useState([]);
  const [badgesData, setbadgesData] = useState([]);
  const [phoneNum, setphoneNum] = useState("");
  const [username, setusername] = useState("");
  const [videourl, setvideourl] = useState("");
  const [badgespopup, setbadgespopup] = useState([]);

  const [profileImgDisplay, setprofileImgDisplay] = useState("");
  const [profileDescInput, setprofileDescInput] = useState("");
  const [profileDescDisplay, setprofileDescDisplay] = useState("");
  const [fileName, setfileName] = useState("No file choosen"); //display selected file name
  const [isOpen, setIsOpen] = useState(false);
  const [isBadgesOpen, setisBadgesOpen] = useState(false);  //badges popup
  const router = useRouter();
  const [isedit, setEdit] = useState(true);
  const [isShare, setisShare] = useState(false);
  const baseURL = "https://uspacex.vercel.app/userprofile/"
  // const[badgebgcolor, setBadgebgcolor] = useState('');


  const toggleChecked = () => setIsOpen(isOpen => !isOpen);


  const handlebadgespopup = (badgeData) => {
    setisBadgesOpen(!isBadgesOpen);
    setbadgespopup(badgeData);
    console.log(badgespopup);


  }

  // base 64 converter
  const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object

        console.log("Called", reader);
        baseURL = reader.result;
        // console.log(baseURL);
        resolve(baseURL);
        ``
      };
      // console.log(fileInfo);
    });
  };

  //Profile image change 
  const handleProfileChange = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    const fileName = e.target.files[0].name;
    setfileName(fileName);
    console.log(fileName);

    const isLogin = localStorage.getItem("ucore");
    const usersDetails = JSON.parse(isLogin);
    const phoneNum = usersDetails.phoneNum;


    getBase64(file)
      .then(result => {
        file["base64"] = result;
        console.log("profile image", file);
        setprofileImgDisplay(result)
        const data = {

          profileImgDisplay: result,

        }
        const cityRef = doc(db, "usersdata", phoneNum);
        updateDoc(cityRef, data)
        console.log("image update", data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // update the users type
  // update the discription
  const HandleUpdateDesc = async (e) => {
    e.preventDefault();

    const isLogin = localStorage.getItem("ucore");
    const usersDetails = JSON.parse(isLogin);
    const phoneNum = usersDetails.phoneNum;
    const username = usersDetails.username;

    // console.log(usersDetails);

    const data = {

      // profileImg:profileImg,
      profileDescInput:profileDescInput,
      createdAt: Timestamp.now(),
    }
    // if(profileDescInput===""){

    //   alert("kindly fill the details");

    // }else{
      const cityRef = doc(db, "usersdata", userprofileid);
      updateDoc(cityRef, data)
      // console.log("discription update", data);
      alert("update successfully !")
      setEdit(true);
    // }
   
  }


  // while user edit the discription
  const HandleEditDesc = () => {
    setEdit(false);
  }

  // // logout
  // const handleLogout=()=>{

  //   Swal.fire({
  //       title: 'Close!',
  //       text: "Are you sure you want to logout?",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes'
  //     }).then((result) => {
  //       if (result.isConfirmed) {

  //         localStorage.removeItem("ucore"),

  //         Swal.fire({
  //           position: 'middle',
  //           icon: 'success',
  //           title: 'Logout',
  //           showConfirmButton: false,
  //           timer: 1500,

  //         }) 
  //         Router.push("/login");      


  //       }
  //     },

  //     )




  // }

  useEffect(() => {


    // get user data
    const getSingleDoc = async () => {
      const docRefdata = doc(db, "usersdata", userprofileid);
      const docSnapdata = await getDoc(docRefdata);
      console.log(docSnapdata.data());

      if (docSnapdata.exists()) {
        setprofileImgDisplay(docSnapdata.data().profileImgDisplay);
        setuserDatanew(docSnapdata.data().userbadge);
        setusername(docSnapdata.data().username);
        setvideourl(docSnapdata.data().youtubevideourl);
        setprofileDescInput(docSnapdata.data().profileDescInput)


        // setprofileDescInput(docSnapdata.data().profileDescInput);
      }
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

    }
    getSingleDoc();
    console.log(userDatanew);
  }, [])

  // get single doc of badges data
  useEffect(() => {

    const getBadgesData = async () => {

      onSnapshot(collection(db, "badgesdata"), (snapshot) => {
        console.log("badgesdatas", snapshot);
        setbadgesData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    }
    getBadgesData();
    // console.log(badgesData);
  }, [])


  return (
    <>

      {/* <section className='Header'> */}
      <header className='m-header'>
        <div className='logo'>
          <Image src={ujblogoimg} layout='responsive' />
        </div>
        <nav className={`navbar ${isOpen ? "openmenu" : ""}`}>
          <ul>
            <li ><Link href="/dashboard"><a className={router.pathname == "/dashboard" ? "active" : ""}>Home</a></Link></li>
            <li><Link href="/feedbackform"><a className={router.pathname == "/feedbackform" ? "active" : ""}>Feedback</a></Link></li>
            <li><Link href={"/userprofile/[upid]"} as={"/userprofile/" + userprofileid}><a className={router.pathname == "/userprofile/" + userprofileid ? "active" : ""}>Profile</a></Link></li>
            <li><Link href="/login"><a className={router.pathname == "/login" ? "active" : ""} >Logout</a></Link></li>

          </ul>
        </nav>
        <div className={`hamburgerMenu ${isOpen ? "active" : ""}`} onClick={toggleChecked}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>
      {/* </section> */}


      <section className='p-profile'>




        {/* navbar end here */}
        <div className='left-container '>
          <ul>
            <li className='custom-profile'>
              {/* <div> */}
              {
                profileImgDisplay ? <img src={profileImgDisplay} alt="profile" /> : <Image src="/images/profileplaceholer.jpg" lt="profile_placeholder" width={200} height={200} layout='responsive' priority="true" />
              }
              <input id="file-upload"
                type="file"
                name="profileimg"
                onChange={handleProfileChange}
              />

              <label htmlFor='file-upload' className='custom-file-upload'>
                <span htmlFor="file-upload"><AiOutlineCamera /></span>
              </label>
              {/* </div>   */}


            </li>
            <li>
              <h2 className='username'>{username}</h2>
              {/* <p>Partner</p> */}
              <div className='profileDesc'>

                <input type="text" name="profileDescInput"
                  value={profileDescInput}
                  placeholder="Designation"
                  disabled={isedit}
                  onChange={(event) => {
                    setprofileDescInput(event.target.value)
                  }} />

                {isedit ? <button className='editDesc' onClick={HandleEditDesc}><FiEdit /></button> : <button className='updateDesc' onClick={HandleUpdateDesc}><FiSave /></button>}
                {/* {isedit? null: <button onClick={HandleUpdateDesc}><FiSave/></button> } */}
              </div>
            </li>

          </ul>

          {/* <div className='share'> */}
            {/* <h2 className='share-label'>Share</h2> */}
            <div className='socialshare-btn'>
              <WhatsappShareButton
                url={baseURL + userprofileid}
                // title={users.contentName}
                separator=":: " >
                <WhatsappIcon size={48} round />
              </WhatsappShareButton>


              <FacebookShareButton
                url={baseURL + userprofileid}
                // quote={users.contDiscription}
                hashtag={"#uspacex"} >
                <FacebookIcon size={48} round />
              </FacebookShareButton>

              <TwitterShareButton
                url={baseURL + userprofileid}
                hashtag={"#uspacex"} >
                <TwitterIcon size={48} round />
              </TwitterShareButton>

              <LinkedinShareButton url={baseURL + userprofileid}
                hashtag={"#uspacex"}>
                <LinkedinIcon size={48} round />
              </LinkedinShareButton>
            </div>

          {/* </div> */}



        </div>



        <div className='right-container'>

          {/* badges section */}
          <div className='card-box'>
            <h2>Badges</h2>

            { !userDatanew && <p>There is no badges yet</p> }
        
          {/* {userDatanew && userDatanew.length < 1  ?
             <p>Loading...</p>: */}
             
             {/* userDatanew && userDatanew? <p>There is no badges yet</p>  */}

            <ul className='card-data'>
              
              {userDatanew && userDatanew.map((badges, key = i) => {
                
                return (
                
                  <>
                
                    <li className={badges.isChecked && badges.isChecked === true ? null : "hidden"}>
                      <div className='p-cardBox'>
                        <div className='cardImg' onClick={()=>handlebadgespopup(badges)}>
                          <img src={badges.badgesimgurls}  alt="badges_img" />
                        </div>

                        <div className='cardContent'>
                          <h3>{badges.isChecked && badges.isChecked === true ? "Honoured" : " U Just Missed"}</h3>
                          <p>{badges.badgesdiscription}</p>
                        </div>

                      </div>
                    </li>
            

                    {isBadgesOpen && <BadgesPopup
                      content={<>
                        <div className='badgespopup-view' style={{ backgroundColor: badgespopup.badgesbgcolor }}>
                          <img src={badgespopup.badgeseventUrls}  />
                          <h2>Congratulations</h2>
                          <h1>{username}</h1>
                          <p className='honoured-name'>You are honoured with the</p>
                          <p className='eventname'>{badgespopup.badgesname}</p>

                        </div>


                      </>}
                      handleClose={handlebadgespopup}
                    />}
                  </>

                )

              })}

            
            
            </ul>
             {/* } */}
            


          </div>


          {/* video section */}
          <div className='video-box con-row'>
            <h2>Exploration</h2>
            <ul>
              <li>

                <iframe src="https://www.youtube.com/embed/ASz1YSzwDY4" width="100%" height={300} frameBorder="0" allowFullScreen="allowfullscreen" />

              </li>
              <li>

                <iframe src="https://www.youtube.com/embed/-RQKQeJEC9g" width="100%" height={300} frameBorder="0" allowFullScreen="allowfullscreen" />

              </li>
            </ul>

          </div>

          {/* dewdrop / umeet / app */}
          <div className='connection-section con-row'>
            <h2>Connections</h2>

            <div className='upper-footer '>

              <ul className='footer-data'>
                <li>
                  <Link href="https://dewdrops.vercel.app/"><a target="_blank"><img src='/images/dewdrop.jpeg' /></a></Link>

                </li>
                <li>
                  <Link href="http://umeet-ujustbe.vercel.app/"><a target="_blank"><img src='/images/umeet.jpeg' /></a></Link>

                </li>
                <li>
                  <Link href="https://play.google.com/store/apps/details?id=com.app.ujustbe"><a target="_blank"><img src='/images/app.jpeg' /></a></Link>

                </li>
              </ul>

            </div>
          </div>
        </div>
        {/* footer section */}



        <div className='footer con-row'>
          <div className='main-footer'>

            <ul className='footerRow'>
              <li>
                <h6>Our Initiatives</h6>
                <span>
                  <Link href="http://umeet-ujustbe.vercel.app/" ><a a target="_blank">Umeet</a></Link>
                  <Link href="https://ujustcelebrate.vercel.app/" ><a a target="_blank">Ujust Celebrate</a></Link>
                  <Link href="https://www.ujustbe.com/quantumleap.pdf" ><a a target="_blank">Quantum Leap</a></Link>

                </span>
              </li>
              <li>
                <h6>And More</h6>
                <span>
                  <Link href="/aboutus"><a>About Us</a></Link>
                  <Link href="https://www.ujustbe.com/contact.html"  ><a a target="_blank">Connect with us</a></Link>
                  <Link href="https://www.ujustbe.com/privacy-policy.html" ><a a target="_blank">Privacy Policy</a></Link>

                </span>
              </li>
            </ul>
            <p></p>

          </div>

        </div>



      </section>





    </>




  )
}

export default UserProfile
export async function getServerSideProps({ query }) {
  console.log("query", query);
  return {
    props: {

      userprofiledetails: query
    }
  }
}
