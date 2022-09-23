import React from "react";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseDescriptionPart extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CourseDescriptionPart {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseDescriptionPart {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CourseDescriptionPart {
  requirements: string[];
  type: "special";
}


type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;

type CourseParts = CoursePart[];

const Part = ({ part }: {part: CoursePart}) => {
  switch (part.type) {
    case "normal":
    return (
      <div>
        <dt style={{ fontSize: "25px" }}>{part.name} {part.exerciseCount}</dt>
        <dt style={{ fontStyle: "italic"}}>{part.description}</dt>
      </div>
    );
    case "groupProject":
    return (
      <div>
        <dt style={{ fontSize: "25px" }}>{part.name} {part.exerciseCount}</dt>
        <dt style={{ fontStyle: "italic"}}>project exercises {part.groupProjectCount}</dt>
      </div>
    );
    case "submission":
    return (
      <div>
        <dt style={{ fontSize: "25px" }}>{part.name} {part.exerciseCount}</dt>
        <dt style={{ fontStyle: "italic"}}>{part.description}</dt>
        <dt>submit to {part.exerciseSubmissionLink}</dt>
      </div>
    );
    case "special":
    return (
      <div>
        <dt style={{ fontSize: "25px" }}>{part.name} {part.exerciseCount}</dt>
        <dt style={{ fontStyle: "italic"}}>{part.description}</dt>
        <dt>required skills: {part.requirements.join(", ")}</dt>
      </div>
    );
  }
};

const Header = ({ name }: { name: string}): JSX.Element => (
    <h1>{name}</h1>
);

const Content = ({ courseParts }: {courseParts: CourseParts }): JSX.Element => (
  <div>
    {courseParts.map((coursePart) => {
      return (
        <div key = {coursePart.name}>
          <Part part={coursePart}></Part>
        </div>
      );
    })} 
  </div>
);

const Total = ({courseParts}: { courseParts: CourseParts }) => (
  <div>
      <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
  </div>
)

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the easy course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the hard course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
