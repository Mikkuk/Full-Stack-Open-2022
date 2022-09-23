import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';

import { PatientEntry } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getNonSensitiveEntries());
});

router.get('/', (_req, res) => {
    res.send();
});

router.post('/', (req, res) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const newPatientEntry = toNewPatientEntry(req.body);

        const addedPatient = patientService.addPatient(newPatientEntry);
        res.json(addedPatient);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong';
        if ( error instanceof Error) {
            errorMessage += ` Error: ` + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

router.get('/:id', (req, res) => {
    const patient: PatientEntry | undefined = patientService.findById(req.params.id);
    res.send(patient);
});

export default router;