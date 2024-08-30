import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, calories, fat, carbs, protein, comments) {
  return { name, calories, fat, carbs, protein, comments };
}

export default function BasicTable({ data }) {
  console.log(data);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead style={{ background: "#dededf" }}>
          <TableRow>
            <TableCell align="start">Name</TableCell>
            <TableCell align="start">CDSID</TableCell>
            <TableCell align="start">Location</TableCell>
            <TableCell align="start">Asset Category</TableCell>
            <TableCell align="start">Asset Type</TableCell>
            <TableCell align="start">Asset ID</TableCell>
            <TableCell align="start">Project</TableCell>
            <TableCell align="start">Comment</TableCell> {/* New Comments Column */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                {row.name}
              </TableCell>
              <TableCell align="start">{row.cdsid}</TableCell>
              <TableCell align="start">{row.location}</TableCell>
              <TableCell align="start">{row.asset_category}</TableCell>
              <TableCell align="start">{row.asset_type}</TableCell>
              <TableCell align="start">{row.asset_id}</TableCell>
              <TableCell align="start">{row.project}</TableCell>
              <TableCell align="start">
                {row.comment || "No Comment"} {/* Display comments if available, otherwise empty */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
