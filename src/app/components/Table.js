import { useState, useMemo } from 'react';
import { Form, Update, Delete } from '../functions';
import { useTable, useExpanded, useFilters, useSortBy } from 'react-table';

const Table = ({ columns, data, setData }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState();

    // Define a default UI for filtering
    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter }
    }) {
        const count = preFilteredRows.length;

        return (
            <input
                value={filterValue || ""}
                onChange={(e) => {
                    setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
                }}
                placeholder={`Search ${count} records...`}
            />
        );
    }

    const defaultColumn = useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded },
    } = useTable(
        {
            data,
            useFilters,
            defaultColumn,
            columns,
        },
        useFilters,
        useSortBy,
        useExpanded // Use the useExpanded plugin hook
    );

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                //<th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                <th {...column.getHeaderProps((column.getSortByToggleProps()))}>
                                    {column.render("Header")}
                                    {/* Render the columns filter UI */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                    <div>{(column.Header === 'First Name' || column.Header === 'Last Name') ?? column.canFilter ? column.render("Filter") : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td
                                        {...cell.getCellProps()}
                                        style={{ color: selected === cell.row.id ? 'red' : 'black' }}
                                        onClick={() => {
                                            setSelected(cell.row.id)
                                            cell.column.Header === 'Update' && Update(setOpen)
                                            cell.column.Header === 'Delete' && Delete(data, setData, cell.row.id)
                                        }}
                                    >{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Form data={data} setData={setData} row={selected} open={open} setOpen={setOpen} />
        </>
    );
};

export { Table };