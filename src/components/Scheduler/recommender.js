import {Snackbar, Alert, Paper, Typography, Button, Box, Autocomplete, TextField, Grid, TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


export default function Recommender(props) {
  const difficultOptions = ["Easy", "Medium", "Hard"]
  return (
    <Box>
      <Grid item xs={12} justifyContent="center" alignItems="center">
      <Box display="flex" sx={{ direction: 'row' }}>
          <Box m="auto" display="flex">
            <Typography variant="h4" component="h4">
              Filters
            </Typography>
          </Box>
        </Box>
        <Box display="flex" sx={{ direction: 'row' }} justifyContent="center" alignItems="center">
          <Box m={1} display="flex">
            <Autocomplete 
              value={props.department}
              onChange={(event, newValue) => {
                props.setDepartment(newValue);
              }}
              sx={{ width: 300 }}
              disablePortal
              options={props.allDepartment} 
              renderInput={(params) => <TextField {...params} label="Department" />}
            />
          </Box> 
          <Box m={1} display="flex">
            <TextField 
            id="outlined-basic" 
            label="Max. Credit Hours" 
            variant="outlined"
            value = {props.maxHours}  
            onChange={props.onChangeMaxHour}
            sx={{ width: 300 }}
            />
          </Box>
        </Box>
        <Box display="flex" sx={{ direction: 'row' }} justifyContent="center" alignItems="center">
          <Box m={1} display="flex">
            <Autocomplete 
                value={props.difficulty}
                onChange={(event, newValue) => {
                  props.setDifficulty(newValue);
                }}
                sx={{ width: 300 }}
                disablePortal
                options={difficultOptions} 
                renderInput={(params) => <TextField {...params} label="Difficulty" />}
            />
          </Box>  
          <Box m={1} display="flex">
            <TextField 
            id="outlined-basic" 
            label="Interests e.g. Data Science" 
            variant="outlined"
            value = {props.interests} 
            onChange={props.onChangeInterests}
            sx={{ width: 300 }}
            />
          </Box>
        </Box>

         <Box display="flex" m={1} sx={{ direction: 'row' }}>
          <Box m="auto" display="flex">
            <Button variant="contained" size="medium" onClick= {props.onSubmitFilter} >Show me recommendations!</Button>
          </Box>
        </Box> 
      </Grid>

      <Grid item xs={12} justifyContent="center" alignItems="center">
        <TableContainer component={Paper} sx = {{maxHeight: 400}}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Department</TableCell>
                <TableCell align="center">Course Number</TableCell>
                <TableCell align="center">Course Name</TableCell>
                <TableCell align="center">Average GPA</TableCell>
                <TableCell align="center">Day of Instruction</TableCell>
                <TableCell align="center">Time of Instruction</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {props.classRecommendation.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">
                    {
                      props.userClasses.includes(row.department.toString() + " " + row.courseNumber.toString())
                      ? <Button color = "error" variant="outlined" size = "large" startIcon={<RemoveCircleIcon/>} onClick = {() => props.removeRecommendedClass(row.department.toString() + " " + row.courseNumber.toString())}> 
                          Remove
                        </Button> 
                      : <Button color = "success" variant="outlined" size = "large" startIcon={<AddCircleIcon/>} onClick = {() => props.addRecommendedClass(row.department.toString() + " " + row.courseNumber.toString())}>  
                          Add
                        </Button> 
                    }
                  </TableCell>
                  <TableCell align="center">{row.department}</TableCell>
                  <TableCell align="center">{row.courseNumber}</TableCell>
                  <TableCell align="center">{row.courseName}</TableCell>
                  <TableCell align="center">{row.avgGPA}</TableCell>
                  <TableCell align="center">{row.days}</TableCell>
                  <TableCell align="center">{row.timing}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal:'center' }}
          open={props.openAddError}
          onClose = {props.closeSnackBarGenerator}
          autoHideDuration={3000}
        >
          <Alert onClose={props.closeSnackBarGenerator} severity="error" sx={{ width: '100%' }}>
            Class conflicts with {props.oldClassAddGenerator}
          </Alert>
      </Snackbar>

      <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal:'center' }}
          open={props.openAddSuccess}
          onClose = {props.closeSuccessSnackBarGenerator}
          autoHideDuration={3000}
        >
          <Alert onClose={props.closeSuccessSnackBarGenerator} severity="success" sx={{ width: '100%' }}>
            Class added successfully!
          </Alert>
      </Snackbar>

      <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal:'center' }}
          open={props.openRemoveSuccess}
          onClose = {props.closeRemoveSuccessSnackBarGenerator}
          autoHideDuration={3000}
        >
          <Alert onClose={props.closeRemoveSuccessSnackBarGenerator} severity="success" sx={{ width: '100%' }}>
            Class Removed Successfully!
          </Alert>
      </Snackbar>
    </Box>
  );
}