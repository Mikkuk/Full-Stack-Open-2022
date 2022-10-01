
import { Diagnosis, Entry } from "../types";
import { Table, TableHead, ListSubheader, ListItem, Icon } from "@material-ui/core";

import { TableCell } from "@material-ui/core";
import { TableRow } from "@material-ui/core";
import { List } from "@material-ui/core";

const EntryComponent = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {

  let icon: string;
  switch (entry.type) {
    case "Hospital":
      icon = "Local Hospital visit ";
      break;
    case "OccupationalHealthcare":
      icon = `Work related visit, employer: ${entry.employerName} `;
      break;
    case "HealthCheck":
      icon = "Routine health check ";
      break;
    default:
      icon = "";
  }

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
                <Icon>
                    {icon} 
                </Icon>
                    Date: {entry.date}
            </TableCell>
            <TableCell>
                Diagnose by: {entry.specialist}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
                {entry.description}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableHead>
            <TableRow>
                <TableCell>
                    <List>
                        <ListSubheader>Diagnoses:</ListSubheader>
                            {entry.diagnosisCodes?.map((diagnose: string) => (
                        <ListItem key={diagnose}>
                            {`${diagnose} `}
                            {diagnoses.find((diagnosis: Diagnosis) => diagnosis.code === diagnose)
                                ?.name
                            }
                        </ListItem>
                        ))}
                    </List>
                </TableCell>
            </TableRow>
        </TableHead>
      </Table>
    </div>
  );
};

export default EntryComponent;