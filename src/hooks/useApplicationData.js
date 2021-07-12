import { useState, useEffect } from "react";
import axios from "axios";


export default function useApplicationData() {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({...state, day})
  
  

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

  return {state, setDay, bookInterview, cancelInterview}
}