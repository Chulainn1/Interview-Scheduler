import React, {useState, useEffect} from "react";

import "components/Application.scss";

import DayList from "components/DayList";
import Appointment from "components/Appointment"
import { getAppointmentsForDay } from "helpers/selectors";

const axios = require('axios');



// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "Jane",
//       interviewer: {
//         id: 2,
//         name:"Tori Malcolm",
//         avatar:"https://i.imgur.com/Nmx0Qxo.png",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "John",
//       interviewer: {
//         id: 3,
//         name:"Mildred Nazir",
//         avatar:"https://i.imgur.com/T2WwVfS.png",
//       }
//     }
//   },
//   {
//     id: "last",
//     time: "4pm",
//     interview: {
//       student: "Jasmine",
//       interviewer: {
//         id: 4,
//         name:"Cohana Roy",
//         avatar:"https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   }
// ];


export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const setDay = day => setState({...state, day})
  // const setDays = days => setState(prev => ({...prev, days}));

  // useEffect(() => {
  //   axios.get('/api/days')
  //     .then(response => 
  //       setState(prev => ({...prev, days: response.data}))
  //     )  
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  // }, []);
  useEffect(() => {
    const days = '/api/days'
    const appointments = '/api/appointments'
    const interviewers = '/api/interviewers'
    Promise.all([
      axios.get(days),
      axios.get(appointments),
      axios.get(interviewers)
    ]).then((all) => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    }).catch(function (error) {
        console.log(error);
    })
  }, []);
  console.log(state.interviewers)
  
  const appointment = dailyAppointments.map(appointment => {
    return <Appointment key={appointment.id} {...appointment}/>
  })
  

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
      <DayList
        days={state.days}
        day={state.day}
        setDay={setDay}
      />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {appointment}
      </section>
    </main>
  );
}



