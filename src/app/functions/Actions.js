const Update = (setOpen) =>
    setOpen(true);

const Delete = (data, setData, row) =>
    setData(data.filter(user => user.id != parseInt(row)));

export { Update, Delete };