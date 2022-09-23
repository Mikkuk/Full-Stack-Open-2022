interface Values {
    value1: number;
    value2: number;
  }

const parseArguments = (args: Array<string>): Values => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');
  
    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
      return {
        value1: Number(args[2]),
        value2: Number(args[3])
      };
    } else {
      throw new Error('Provided values were not numbers!');
    }
  };

const calculateBMI = (height: number, weight: number) : string => {

    if (height === 0) throw new Error("cant divide by 0");
    const heightInMeters = height/100;
    const BMI = weight/(heightInMeters**2);
    
    if ( BMI <= 18.4 ) {
        return "Underweight";
    } else if (BMI >= 18.5 && BMI <= 24.9 ) {
        return "Normal range";
    } else if (BMI >= 25.0) {
        return "overweight";
    } else {
      return "error";
    }
};

try{
    const { value1, value2 } = parseArguments(process.argv);
    console.log(calculateBMI(value1, value2));
} catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}

export default calculateBMI;