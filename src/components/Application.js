import React, {useState, useEffect} from "react";

import "components/Application.scss";

import DayList from "components/DayList";
import Appointment from "components/Appointment"
import { getAppointmentsForDay } from "helpers/selectors";
import { getInterviewersForDay } from "helpers/selectors";
import { getInterview } from "helpers/selectors";

const axios = require('axios');


export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({...state, day})
  
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  

  // bookInterview will allow us to change the local state when we book an interview
  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.put(`/api/appointments/${id}`, {interview} )
    .then(() => setState({
      ...state,
      appointments
    }));
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
    .then(() => setState({
      ...state,
      appointments
    }));
    
  }

  const appointment = dailyAppointments.map(appointment => {
    return <Appointment key={appointment.id} {...appointment} interviewers={dailyInterviewers}  bookInterview={bookInterview} cancelInterview={cancelInterview}/>
  })



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



