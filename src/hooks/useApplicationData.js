import { useState, useEffect } from "react";
import axios from "axios";

import { updateSpots } from "helpers/selectors";


export default function useApplicationData() {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
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

  const setDay = day => setState({...state, day})
  

  // bookInterview will allow us to change the local state when we book an interview
  function bookInterview(id, interview, changeSpots) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = changeSpots ? updateSpots([...state.days], id, -1) : [...state.days]; 

    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
  
      setState(
        prev => ({...prev, days, appointments})
      )
    });
    
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

    const days = updateSpots([...state.days], id, 1); 

    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(() => setState(
      prev => ({...prev, days, appointments}) 
    ));
    
  }
  
  return {state, setDay, bookInterview, cancelInterview}
}