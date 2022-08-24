import Schedulers from './scheduler'
import { Button, Box, Autocomplete, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


export default function ScheduleGenerator(props) {
  return(
    <Box>
      <Grid item xs={12} justifyContent="center" alignItems="center">
        <Box display="flex" sx={{ direction: 'row' }}>
          <Box m="auto" display="flex">
            <Autocomplete 
              value={props.searchInputValue}
              onChange={(event, newValue) => {
                props.setSearchInputValue(newValue);
              }}
              sx={{ width: 300 }}
              disablePortal
              options={props.allClasses} 
              renderInput={(params) => <TextField {...params} label="Add Class" />}
            />
            <Box alignItems="center" justifyContent="center" sx={{ml: 1}} display="flex" >
              <Button variant="contained" size="large" onClick = {props.onSearch}>Add Class</Button>
            </Box>
          </Box>
        </Box>
      </Grid>
      
        <Grid item xs={12}>
            <Schedulers schedules={props.userSchedules} onDelete={props.onDelete} actor = {props.actor}/>
        </Grid>
      <Dialog
        open={props.dialog}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Schedule Conflict!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The class you have chosen conflicts with {props.oldClassAdd}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
