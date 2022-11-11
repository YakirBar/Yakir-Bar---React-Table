import update from 'immutability-helper';
import { Form, Update, Delete } from '../functions';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { useState, useMemo, useCallback, useRef } from 'react';
import { useTable, useExpanded, useFilters, useSortBy } from 'react-table';

const Table = ({ columns, data, setData }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState();

    const getRowId = useCallback(row => {
        return row?.id
    }, [])

    const moveRow = (dragIndex, hoverIndex) => {
        const dragRecord = data[dragIndex]
        if (dragIndex && hoverIndex) {
            setData(
                update(data, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragRecord],
                    ],
                })
            )
        }
    }

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
            getRowId
        },
        useFilters,
        useSortBy,
        useExpanded // Use the useExpanded plugin hook
    );

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <th></th>
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
                        {/* {rows.map((row, i) => {
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
                        })} */}
                        {rows.map(
                            (row, index) =>
                                prepareRow(row) || (
                                    <Row
                                        index={index}
                                        row={row}
                                        moveRow={moveRow}
                                        {...row.getRowProps()}
                                        selected={selected}
                                        setSelected={setSelected}
                                        setOpen={setOpen}
                                        data={data}
                                        setData={setData}
                                    />
                                )
                        )}
                    </tbody>
                </table>
            </DndProvider>
            <Form data={data} setData={setData} row={selected} open={open} setOpen={setOpen} />
        </>
    );
};

const DND_ITEM_TYPE = 'row'

const Row = ({ row, index, moveRow, selected, setSelected, setOpen, data, setData }) => {
    const dropRef = useRef(null)
    const dragRef = useRef(null)

    const [, drop] = useDrop({
        accept: DND_ITEM_TYPE,
        hover(item, monitor) {
            if (!dropRef.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = dropRef.current.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveRow(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag, preview] = useDrag(
        { type: DND_ITEM_TYPE, index },
        // {
        //     collect: monitor => ({
        //         isDragging: monitor.isDragging(),
        //     })
        // },
    )

    const opacity = isDragging ? 0 : 1

    preview(drop(dropRef))
    drag(dragRef)

    return (
        <tr ref={dropRef} style={{ opacity }}>
            <td ref={dragRef}>move</td>
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
};

export { Table };