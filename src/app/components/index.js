import { useMemo } from 'react';
import { Table } from './Table';
import { IconButton, Icon } from '@mui/material';

const ReactTable = ({ data, setData }) => {
    const columns = useMemo(
        () => [
            {
                // Build our expander column
                id: 'expander', // Make sure it has an ID
                Cell: ({ row }) =>
                    // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
                    // to build the toggle for expanding a row
                    row.canExpand ? (
                        <span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    // We can even use the row.depth property
                                    // and paddingLeft to indicate the depth
                                    // of the row
                                    paddingLeft: `${row.depth * 2}rem`,
                                },
                            })}
                        >
                            {row.isExpanded ? <Icon>expand_more</Icon> : <Icon>expand_less</Icon>}
                        </span>
                    ) : null,
            },
            {
                Header: 'Name',
                columns: [
                    {
                        Header: '#',
                        accessor: (cell, index) => index,
                    },
                    {
                        Header: 'First Name',
                        accessor: (cell) => cell.firstName || `bank: ${cell.bank}`,
                    },
                    {
                        Header: 'Last Name',
                        accessor: (cell) => cell.lastName || `accountName: ${cell.accountName}`,
                    },
                ],
            },
            {
                Header: 'Info',
                columns: [
                    {
                        Header: 'Email',
                        accessor: (cell) => cell.email || `accountType: ${cell.accountType}`,
                    },
                    {
                        Header: 'Organization',
                        accessor: (cell) => cell.organizationCode || `branch: ${cell.branch}`,
                    },
                    {
                        Header: 'User ID',
                        accessor: (cell) => cell.userId || `account: ${cell.account}`,
                    },
                ],
            },
            {
                Header: 'Actions',
                columns: [
                    {
                        Header: 'Update',
                        accessor: (cell) => (cell.firstName || cell.lasttName) ? <IconButton><Icon>edit</Icon></IconButton> : null,
                    },
                    {
                        Header: 'Delete',
                        accessor: (cell) => (cell.firstName || cell.lasttName) ? <IconButton><Icon>delete</Icon></IconButton> : null,
                    },
                    {
                        Header: 'Menu',
                        accessor: (cell) => (cell.firstName || cell.lasttName) ? <IconButton><Icon>more_vert</Icon></IconButton> : null,
                    }
                ],
            },
        ],
        []
    )

    return (
        <Table columns={columns} data={data} setData={setData} />
    );
};

export { ReactTable };
