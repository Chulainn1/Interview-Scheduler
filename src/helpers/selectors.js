// returns an array of appointments for the given day
export function getAppointmentsForDay(state, day) {

  const foundDay = state.days.find(element => element.name === day);

  if(!foundDay || state.days.length === 0) {
    return [];
  } 
   
  const appointments = foundDay.appointments.map((appointmentId) => 
    state.appointments[appointmentId]
  );
  return appointments;
}

// ---------------------------------------------------------------- //
// returns an object that contains the interview data
export function getInterview(state, interview) {
  
  let interviewData = {};
  if(interview) {
    interviewData = {...interview, interviewer: state.interviewers[interview.interviewer] }
  } else {
    interviewData = null
  }
  return interviewData;
}

// ---------------------------------------------------------------- //
// returns an array of interviewers
export function getInterviewersForDay(state, day) {

  const foundDay = state.days.find(element => element.name === day);

  if(!foundDay || state.days.length === 0) {
    return [];
  } 
  
  const interviewer = foundDay.interviewers.map((interviewerId) => 
    state.interviewers[interviewerId]
  );

  
  return interviewer;
}

// ---------------------------------------------------------------- //
// used to update the spots remaining on a day when a user books or deletes an appointment
export function updateSpots(days, id, value) {

  days.forEach(day => {
    if(day.appointments.includes(id)) {
      day.spots = parseInt(day.spots) + value;
    }
  })
  return days;
}
