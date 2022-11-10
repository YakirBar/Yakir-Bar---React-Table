import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ShowMessage = ({ message }) => {
    const [open, setOpen] = useState(true);

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={() => setOpen(false)} severity='error'>
                {message}, {'try again later'}
            </Alert>
        </Snackbar>
    );
};

export { ShowMessage };