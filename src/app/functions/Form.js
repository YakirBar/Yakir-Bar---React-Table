import {
    Button,
    Dialog,
    TextField,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const Form = ({ data, setData, row, open, setOpen }) => {
    const { handleSubmit, control } = useForm();

    const submit = (values) => {
        const newData = [];
        for (let i = 0; i < data?.length; i++) {
            if (parseInt(row) === i) {
                newData.push({
                    ...values,
                    id: data[i].id,
                    lastLoginDate: data[i].lastLoginDate,
                    organizationCode: data[i].organizationCode,
                    userId: data[i].userId
                });
            } else {
                newData.push(data[i]);
            };
        };
        setData(newData);
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Update User Information</DialogTitle>
            <form onSubmit={handleSubmit(submit)}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Controller
                        name='firstName'
                        control={control}
                        defaultValue={data[row]?.firstName}
                        render={({ field: { onChange } }) => (
                            < TextField
                                size='small'
                                onChange={onChange}
                                placeholder='first name'
                                defaultValue={data[row]?.firstName}
                            />
                        )}
                    />
                    <Controller
                        name='lastName'
                        control={control}
                        defaultValue={data[row]?.lastName}
                        render={({ field: { onChange } }) => (
                            <TextField
                                size='small'
                                sx={{ mt: 1 }}
                                onChange={onChange}
                                placeholder='last name'
                                defaultValue={data[row]?.lastName}
                            />
                        )}
                    />
                    <Controller
                        name='email'
                        control={control}
                        defaultValue={data[row]?.email}
                        render={({ field: { onChange } }) => (
                            <TextField
                                size='small'
                                sx={{ mt: 1 }}
                                onChange={onChange}
                                placeholder='email'
                                defaultValue={data[row]?.email}
                            />
                        )}
                    />
                    <Button
                        type='submit'
                        sx={{ mt: 2 }}
                        variant='outlined'>
                        submit
                    </Button>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export { Form };