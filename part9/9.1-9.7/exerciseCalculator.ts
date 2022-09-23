interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

interface exerciseValues {
    value1: number;
    value2: Array<number>;
  }


const parseArgs = (args: Array<string>): exerciseValues => {
    if (args.length < 4) throw new Error('Not enough arguments');

    const arrOfValues = args.slice(3);

    const arrOfNumValues = arrOfValues.map(value => {
        return Number(value);
    });
  
    if (!isNaN(Number(args[2] && !isNaN(Number(arrOfNumValues))))) {
      return {
        value1: Number(args[2]),
        value2: arrOfNumValues
      };
    } else {
      throw new Error('Provided values were not numbers!');
    }
  };

const calculateExercises = (dailyHours: Array<number>, target: number): Result => {

    const days = dailyHours.filter(day => day > 0);
    const sum = dailyHours.reduce((a, b) => a + b, 0);
    const avg = (sum / dailyHours.length) || 0;
    let succes = true;
    let rating = 0;
    let description = "";
    if (avg < target) {
        succes = false;
    }

    if ((avg / target) === 1) {
        rating = 2;
    } else if ((avg / target) > 1) {
        rating = 3;
    } else if ((avg / target) < 1) {
        rating = 1;
    }

    if (rating === 1) {
        description = "You can do better!";
    } else if (rating === 2) {
        description = "You reached the goal!";
    } else if (rating === 3) {
        description = "You went above and beyond!!";
    }

    return {
        periodLength: dailyHours.length,
        trainingDays: days.length,
        success: succes,
        rating: rating,
        ratingDescription: description,
        target: target,
        average: avg
    };
};

try {
    const { value1, value2 } = parseArgs(process.argv);
    console.log(calculateExercises(value2, value1));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }

  export default calculateExercises;