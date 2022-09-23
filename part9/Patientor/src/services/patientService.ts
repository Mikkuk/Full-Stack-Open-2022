import patients from '../data/patients';
import { v1 as uuid } from 'uuid';

import { NonSensitivePatientEntry, PatientEntry, NewPatientEntry } from '../types';

const getEntries = (): PatientEntry[] => {
    return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};

const findById = (id: string): PatientEntry | undefined => {
    const patient = patients.find((patient) => patient.id === id);
    if (patient) {
        return { ...patient };
    }
    return undefined;
};

const addPatient = ( entry: NewPatientEntry): PatientEntry => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const newId = uuid();
        const newPatientEntry = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: newId,
            ...entry
        };

        patients.push(newPatientEntry);
        return newPatientEntry;
    };

export default {
    getEntries,
    getNonSensitiveEntries,
    addPatient,
    findById
};