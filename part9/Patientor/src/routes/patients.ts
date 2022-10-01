import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';
import { v1 as uuid } from 'uuid';

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

router.post('/:id/entries', (req, res) => {
    const id = req.params.id;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newEntry = req.body;
    newEntry.id = uuid();

    if (
        !newEntry.type ||
        !newEntry.date ||
        !newEntry.specialist ||
        !newEntry.description ||
        !newEntry.diagnosisCodes
      ) {
        res.status(400).send("Fields missing").end();
      }

    if (newEntry.type === "OccupationalHealthcare") {
        if (!newEntry.sickLeave.startDate || !newEntry.sickLeave.endDate) {
            res.status(400).send("Fields missing").end();
        }
    }
    if (newEntry.type === "Hospital") {
        if (!newEntry.discharge.date || !newEntry.discharge.criteria) {
            res.status(400).send("Fields missing").end();
        }
    }
    if (newEntry.type === "HealthCheck") {
        if (!newEntry.healthCheckRating) {
          res.status(400).send("Fields missing").end();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (patientService.addEntry(id, newEntry)) {
        res.status(201).send("Entry added");
    } else {
        res.status(404).send("Patient not found");
    }
});

router.get('/:id', (req, res) => {
    const patient: PatientEntry | undefined = patientService.findById(req.params.id);
    res.send(patient);
});

export default router;