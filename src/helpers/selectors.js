export function getAppointmentsForDay(state, day) {

  // find obj in state.days array when name === day
  const foundDay = state.days.find(element => element.name === day);

  if(!foundDay || state.days.length === 0) {
    return [];
  } 
  
  // the variable - appointments - contains the state.appointments at the appointmentIds defined by the foundDays appointments array. 
  const appointments = foundDay.appointments.map((appointmentId) => 
    state.appointments[appointmentId]
  );
  return appointments;
}


export function getInterview(state, interview) {
  
  let interviewData = {};

  if(interview) {
    interviewData = {...interview, interviewer: state.interviewers[interview.interviewer] }
  } else {
    interviewData = null
  }
  return interviewData;
}