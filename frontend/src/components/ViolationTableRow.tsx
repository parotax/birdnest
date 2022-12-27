import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface Violator {
  pilotId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdDt: string;
  email: string;
  lastViolation: number;
  closestToNest: number;
  serialNumber: string;
}

interface Props {
  violator: Violator;
}

const sinceLastViolation = (lastViolation: number) => {
  const seconds = (Date.now() - lastViolation) / 1000;

  if (seconds > 60) {
    return Math.floor(seconds / 60) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

const ViolationTableRow = (props: Props) => {
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small"></IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {props.violator.firstName + " " + props.violator.lastName}
        </TableCell>
        <TableCell align="center">{props.violator.email}</TableCell>
        <TableCell align="center">{props.violator.phoneNumber}</TableCell>
        <TableCell align="center">
          {Math.round(props.violator.closestToNest / 100) / 10 + "m"}
        </TableCell>
        <TableCell align="center">
          {sinceLastViolation(props.violator.lastViolation)}
        </TableCell>
      </TableRow>
    </>
  );
};

export default ViolationTableRow;
