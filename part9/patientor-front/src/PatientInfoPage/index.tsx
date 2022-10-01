import React, {} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

import { Patient, Diagnosis, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import EntryComponent from "./EntryComponent";
import { useStateValue } from "../state";
import {Button} from "@material-ui/core";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/EntryForm";




const PatientInfoPage = () => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = React.useState<Patient | undefined>();
    const [, dispatch] = useStateValue();

    const [{ diagnoses }] = useStateValue();

    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();
    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
      setModalOpen(false);
      setError(undefined);
    };
    

    const diagnosisArray: Diagnosis[] = Object.entries(diagnoses).map(
      ([_id, diagnosis]: [id: string, diagnosis: Diagnosis]) => diagnosis
    );

    const submitNewEntry = async (values: EntryFormValues) => {
      try {
        const { data: newPatient } = await axios.post<Patient>(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${apiBaseUrl}/patients/${id}/entries`,
          values
        );
        dispatch({ type: "ADD_PATIENT", payload: newPatient });
        closeModal();
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || "Unrecognized axios error");
          setError(String(e?.response?.data?.error) || "Unrecognized axios error");
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    };

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
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientInfoPage;
