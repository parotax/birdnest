import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useEffect, useState } from "react";
import ViolationTableRow from "./ViolationTableRow";
import "../styles.css";

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

let key = 0;

const ViolationTable = () => {
  const [violators, setViolators] = useState<Violator[]>([]);

  const getDrones = async () => {
    const data = await (
      await fetch("http://localhost:8080/api/violatingDrones")
    ).json();

    setViolators(data);
  };

  useEffect(() => {
    const setDrones = setInterval(() => {
      getDrones();
    }, 2000);
    return () => {
      clearInterval(setDrones);
    };
  }, []);

  return (
    <div className="table">
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton aria-label="expand row" size="small"></IconButton>
              </TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">E-mail</TableCell>
              <TableCell align="center">Phone number</TableCell>
              <TableCell align="center">Closest distance to nest</TableCell>
              <TableCell align="center">Last violation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {violators
              .slice(0)
              .reverse()
              .map((violator) => (
                <ViolationTableRow key={key++} violator={violator} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViolationTable;
