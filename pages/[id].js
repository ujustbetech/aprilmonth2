import React from 'react';
import Login from '../component/Login'

const Loginid = ({ eventsName }) => {
    console.log("EventsName:",eventsName.id);
    return (
        <div>
          <Login eventname={eventsName.id} />
        </div>
    )
}

export default Loginid

export async function getServerSideProps({ query }) {
    console.log("query", query.id);
    return {
        props: {
           
            eventsName: query
        }
    }
}