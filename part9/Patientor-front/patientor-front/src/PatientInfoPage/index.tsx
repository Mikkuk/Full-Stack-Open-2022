import React, {} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

import { Patient, Diagnosis, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import EntryComponent from "./EntryComponent";
import { useStateValue } from "../state";


const PatientInfoPage = () => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = React.useState<Patient | undefined>();

    const [{ diagnoses }] = useStateValue();

    const diagnosisArray: Diagnosis[] = Object.entries(diagnoses).map(
      ([_id, diagnosis]: [id: string, diagnosis: Diagnosis]) => diagnosis
    );

React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const fetchedPatient = await axios.get<Patient>(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${apiBaseUrl}/patients/${id}`
        );

        setPatient(fetchedPatient.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!patient || patient?.id !== id) {
      void fetchPatient();
    }
  }, [patient]);

if (!patient) return <div>404</div>;


return (
    <div>
      <h1>
        {patient.name} {patient.gender}
      </h1>
      <p>ssn: {patient.ssn ? patient.ssn : "no access"}</p>
      <p>occupation: {patient.occupation}</p>
      <div>
      <h2>Entries:</h2>
      {patient.entries ? (
          patient.entries.map((entry: Entry) => (
            <EntryComponent
              diagnoses={diagnosisArray}
              key={entry.id}
              entry={entry}
            ></EntryComponent>
          ))
        ) : (
          <div>no entries found</div>
        )}
      </div>
    </div>
  );
};

export default PatientInfoPage;
