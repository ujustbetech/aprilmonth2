import React, { useState, useEffect } from 'react'
import { collection, addDoc, setDoc, doc, docs, getDocs, getDoc } from "firebase/firestore";
import firebaseApp from '../../firebaseConfig'
import { auth } from '../../firebaseConfig'
import { getFirestore, onSnapshot } from "firebase/firestore";
import Link from 'next/link';
import Layout from '../../component/Layout'
import Image from 'next/image'
import Router from 'next/router';
const db = getFirestore();

import { FiEdit } from 'react-icons/fi';

const EventList = () => {
    
    const [adminData, setadminData] = useState('');
    const [dashboardData, setdashboardData] = useState([]);
    const [isLogin, setisLogin] = useState(false);

    useEffect(() => {

        const getContent = async () => {

            onSnapshot(collection(db, "AdminMonthlyMeet"), (snapshot) => {
                console.log("MM", snapshot);
                setdashboardData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
            <Layout>
            {isLogin ?
        
            <section className='p-eventlist box'>

                <table className='table-class'>
                                    <thead>
                                        <tr>
                                            <th>Sr No.</th>
                                            <th>Dashboard Image</th>
                                            <th>FormBg Image</th>
                                            <th>Mobile Image</th>
                                            <th>Event name</th>
                                            <th>Date of Event</th>
                                            {/* <th>Zoom Link</th> */}
                                            {/* <th>Whatsapp Link</th> */}
                                            <th>User Login Url</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                    {/* // map the function */}
                {

                    dashboardData && dashboardData.map((admindata, key=i) => {
                        console.log("admin data", adminData);
                        return (

                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        {/* <td className='tdeventimage'><img src={admindata.image}/></td> */}
                                        {/* <td className='tdeventimage'><img src={admindata.formimage}/></td> */}
                                        <td className='tdeventimage'><img src={admindata.dashboardUrls}/></td>
                                        <td className='tdeventimage'><img src={admindata.formImgUrls}/></td>
                                        <td className='tdeventimage'><img src={admindata.mobileUrls}/></td>
                                        <td className='tdeventname'>{admindata.eventName}</td>
                                        <td className='tdeventdate'>{admindata.eventDate}</td>
                                        {/* <td className='tdzoomlink'>{admindata.zoomlink}</td> */}
                                        {/* <td className='tdwhatsapplink'>{admindata.whatsappLink}</td> */}
                                        <td className='tdeventid'>
                                            <Link   href={"/[id]"} as={"/" + admindata.id}>
                                                <a  target="_blank">{admindata.id}</a>
                                            </Link>
                                        </td>
                                        <td className='tdevent'>
                                            <Link href={"eventdetails/[pid]"} as={"eventdetails/" + admindata.id}>
                                                <a  ><FiEdit/>Details</a>
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
            </Layout>

            
        </>
    )
}

export default EventList
