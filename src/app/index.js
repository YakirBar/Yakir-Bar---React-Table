import './index.css';
import axios from 'axios';
import { ShowMessage } from './errors';
import { LoadingButton } from '@mui/lab';
import { ReactTable } from './components';
import { useState, useEffect } from 'react';
import { userBody, bankBody } from './jsons';
import { Box, TextField, Icon } from '@mui/material';

const App = () => {
    const [data, setData] = useState([]);
    const [banks, setBanks] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [rerender, setRerender] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    useEffect(() => {
        axios.post('http://54.194.238.190:8080/admin_get_organization_users',
            {
                "content": {
                    "organizationCode": "Ivory",
                    "pageNum": "1",
                    "searchText": search
                },
                userBody
            })
            .then((res) => setUsers(res.data.content.list))
            .catch((err) => setErrMessage(err.message))
    }, [rerender, search])

    useEffect(() => {
        let handlePromises = [];

        for (let i = 0; i < users.length; i++) {
            handlePromises.push(
                axios.post('http://54.194.238.190:8080/admin_get_user_accounts',
                    {
                        "content": {
                            "userId": users[i].userId
                        },
                        bankBody
                    })
            )
        };

        Promise.all(handlePromises)
            .then((res) => setBanks(res))
            .catch((err) => setErrMessage(err.message));
    }, [users])

    useEffect(() => {
        let handleData = [];

        for (let i = 0; i < users.length; i++) {
            handleData.push({
                ...users[i],
                subRows: banks[i].data.content.list
            })
        };

        setLoading(false)
        setData(handleData);
    }, [banks])

    useEffect(() => {
        setTimeout(() => {
            setErrMessage('')
        }, 5000);
    }, [errMessage]);

    return (
        <Box sx={{ ml: 25 }}>
            <LoadingButton loading={loading} onClick={() => { setRerender(!rerender); setLoading(true) }}>
                <Icon>refresh</Icon>
            </LoadingButton>
            <TextField
                size='small'
                sx={{ mb: 2 }}
                autoComplete='off'
                label='search data'
                onChange={(event) => setSearch(event.target.value)}
            />
            <ReactTable data={data} setData={setData} />
            {errMessage ? <ShowMessage message={errMessage} /> : null}
        </Box>
    );
};

export default App;