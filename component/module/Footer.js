import React from 'react'
import Link from 'next/link'

const Footer = () => {

  return (
    <section className='m-footer con-row'>
    <div className='container'>
        <ul className='footerRow '>
            <li>
                <h6>Our Initiatives</h6>
                <span>
                    <Link href="http://umeet.ujustbe.com/" ><a target="_blank">Umeet</a></Link>
                    <Link href="https://ujustcelebrate.vercel.app/" ><a target="_blank">Ujust Celebrate</a></Link>
                    <Link href="https://www.ujustbe.com/quantumleap.pdf" ><a target="_blank">Quantum Leap</a></Link>
                    {/* <Link href="#" ><a>Umeet</a></Link> */}
                </span>
            </li>
            <li>
                <h6>And More</h6>
                <span>
                    <Link href="/aboutus"><a>About Us</a></Link>
                    <Link href="https://www.ujustbe.com/contact.html"  ><a target="_blank">Connect with us</a></Link>
                    <Link href="https://www.ujustbe.com/privacy-policy.html" ><a target="_blank">Privacy Policy</a></Link>
                    {/* <Link href="#" ><a>Umeet</a></Link> */}
                </span>
            </li>
        </ul>
       
    </div>
    </section>
  )
}

export default Footer