
import React from 'react'
import { AiOutlineHome } from "react-icons/ai";
import { MdEventAvailable } from "react-icons/md";

import { MdOutlineContentPaste } from "react-icons/md";
import { RiListSettingsLine } from "react-icons/ri";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import { BsAward } from "react-icons/bs";
import { FiAward } from "react-icons/fi";
import Link from 'next/link'
import { useRouter } from "next/router";

const Navbar = (props) => {
    console.log("nav props",props.expand);

    const router = useRouter();

    return (
         <>
            <nav className={props.expand ? 'm-navbar expand' : 'm-navbar unexpand' }>
        
                <ul>

                    {/*  event */}
                   
                    <li>
                        <Link href="/admin/eventList">
                            <a>
                                <span className="icons"><MdEventAvailable /></span>
                                <span className="linklabel">Event</span>

                                <span className='submenuIcon'><MdOutlineKeyboardArrowDown/></span>
                            </a>
                          
                        </Link >
                            <ul>
                                <li>
                                    <Link href="/admin/addEvent">
                                        <a> Add Event </a>
                                    </Link>
                                   
                                </li>
                                <li>
                                    <Link  href="/admin/eventList">
                                        <a> Event Listing</a>
                                    </Link>
                                  
                                </li>
                            

                            </ul>
      
                    </li>

                    {/* Users */}

                    <li>
                        <Link href="/admin/userslist">
                            <a>
                                <span className="icons"><FaRegUser /></span>
                                <span className="linklabel">Users</span>

                                <span className='submenuIcon'><MdOutlineKeyboardArrowDown/></span>
                            </a>
                          
                        </Link >
                            <ul>
                                <li>
                                    <Link href="/admin/userslist">
                                        <a> Users Listing </a>
                                    </Link>
                                   
                                </li>
                             
                            

                            </ul>
      
                    </li>

                    {/* badges */}
                    <li>
                        <Link href="/admin/addbadges">
                            <a>
                                <span className="icons"><FaAward /></span>
                                <span className="linklabel">Rewards</span>

                                <span className='submenuIcon'><MdOutlineKeyboardArrowDown/></span>
                            </a>
                          
                        </Link >
                            <ul>
                                <li>
                                    <Link href="/admin/addbadges">
                                        <a> Add Badges </a>
                                    </Link>
                                   
                                </li>
                                <li>
                                    <Link href="/admin/badgeslist">
                                        <a> Badges List </a>
                                    </Link>
                                   
                                </li>
                             
                            

                            </ul>
      
                    </li>


                    {/* <li> */}
                        {/* <Link href="/">
                            <a>
                                <span className="icons"><AiOutlineHome /></span>
                                <span className="linklabel">Dashboard</span> 
                            </a>
                        </Link> */}
                    {/* </li> */}
                    
                    
                        {/* setting */}
                    <li>
                        <Link href="/">
                            <a>
                                <span className="icons"><RiListSettingsLine /></span>
                                <span className="linklabel">Setting</span> </a>
                        </Link>
                    </li>



                </ul>
            </nav>
        </>
    )
}

export default Navbar
