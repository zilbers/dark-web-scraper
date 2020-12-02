import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers({ date, setDate }) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date(date));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDate(() => date?.getTime());
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant='inline'
        format='MM/dd/yyyy'
        margin='normal'
        id='date-picker-inline'
        label='Choose Date'
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
