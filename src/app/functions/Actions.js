const Update = (setOpen) =>
    setOpen(true);

const Delete = (data, setData, row) =>
    setData(data.filter((user, index) => index != parseInt(row)));

export { Update, Delete };