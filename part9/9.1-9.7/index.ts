import express from "express";
import calculateBMI from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    try {
        const weight = Number(req.query.weight);
        const height = Number(req.query.height);
        const bmi: string = calculateBMI(height, weight);

        if(!bmi || !height || !weight) {
            const error = 'malformatted parameters';
            throw error;
        }

        const data = {weight, height, bmi};
        res.send(data);
    } catch (error) {
        res.status(400).send({error: '...'});
    }
});

app.post('/exercises', (req, res) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const exercises: Array<number> = req.body.daily_exercises;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const target = Number(req.body.target);

        if(isNaN(Number(target))) {
            throw new Error('malformatted parameters');
        }

        if(!exercises || !target) {
            throw new Error('parameters missing');
        }

        const result = calculateExercises(exercises, target);
        res.send(result);
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        res.status(400).send({error: error.message});
    }
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});