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


    // console.log(state.days[0].spots, "BEFORE")
    
    /*
    Where is the value of spots? 
    console.log(state.days[0].spots, "BEFORE") // 3

    How can we calculate the number of spots? 
      The # of spots has a relationship w/ the # of appointments that DON'T have an interview booked. 
    console.log(state.appointments[4].interview) //{student: "Chad Takahashi", interviewer: 9}

    When should we update the spots? 
      spots are updated when an interview is booked or canceled. Update state with the new number of spots applied in the .then of the axios request of bookInterview and cancelInterview. 

     The appointment id is known when an interivew is confirmed or canceled by the server. 
    */

    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
      console.log("axios is working")
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