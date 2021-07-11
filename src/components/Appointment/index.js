import React from "react";
import "components/Appointment/styles.scss"

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";


export default function Appointment(props) {
  // console.log(props);
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const CONFIRM = "CONFIRM";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const EDIT = "EDIT";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING); // transition to he SAVING mode when starting the save operation

    // Promise to wait for the axios put in Application.js
    Promise.resolve(props.bookInterview(props.id, interview))
    .then(() => transition(SHOW));
  }

  function deleteAppointment() {
    transition(DELETING);

    Promise.resolve(props.cancelInterview(props.id))
    .then(() => transition(EMPTY))
  }
 
  console.log(props.interview.interviewer)
  return (
    <article className="appointment">
      <Header time={props.time}/> 
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
      />
      
      )}
      {mode === CREATE && 
      (<Form
        interviewers={props.interviewers}
        onSave={save}
        onCancel={() => back(EMPTY)}
      />
      )}
      {mode === SAVING && (
        <Status message="Saving"/>
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={deleteAppointment}
          onCancel={() => back()}
        />
      )}
      {mode === DELETING && (
        <Status message ="Deleting"/>
      )}
      {mode === EDIT && (
        <Form
        name={props.interview.student}
        interview={props.interview.interviewer.id}
        interviewers={props.interviewers}
        onSave={save}
        onCancel={() => back(EMPTY)}
      />
      )}
    </article>
  );
}
