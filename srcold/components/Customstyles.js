export const selectcustomStyles = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #e6e6e6',
        backgroundColor: state.isSelected ? '' : '',
        padding: 5,
        textTransform: 'capitalize',
        color: state.isSelected ? 'var(--secondary)' : 'var(--primary)',
        transition: '.3s',
        '&:hover': {
            color: 'var(--secondary)',
            cursor: 'pointer',
        },
    }),
    control: () => ({
        border: '2px solid #e6e6e6',
        boxShadow: '0 0 1.32vh #e6e6e6',
        borderRadius: '1.32vh',
        display: 'flex',
        cursor: 'pointer',
        transition: '.3s',
        '&:hover': {
            boxShadow: '0px 9px 2.65vh rgba(75, 72, 72, 0.3)',
        },
    }),
};
export const selectcustomStylesTranslated = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #e6e6e6',
        backgroundColor: state.isSelected ? '' : '',
        padding: 5,
        textTransform: 'capitalize',
        color: state.isSelected ? 'var(--secondary)' : 'var(--primary)',
        transition: '.3s',
        textAlign: 'right',
        '&:hover': {
            color: 'var(--secondary)',
            cursor: 'pointer',
        },
    }),
    control: () => ({
        border: '2px solid #e6e6e6',
        boxShadow: '0 0 1.32vh #e6e6e6',
        borderRadius: '1.32vh',
        display: 'flex',
        cursor: 'pointer',
        transition: '.3s',
        textAlign: 'right',
        '&:hover': {
            boxShadow: '0px 9px 2.65vh rgba(75, 72, 72, 0.3)',
        },
    }),
    placeholder: (provided, state) => ({
        ...provided,
        textAlign: 'right',
    }),
};

export const selectbordered = {
    option: (provided, state) => ({
        ...provided,

        backgroundColor: state.isSelected ? '' : '',
        padding: 5,

        textTransform: 'capitalize',
        color: '#000',
        fontSize: '15px',
        fontWeight: 500,
        transition: '.3s',
        '&:hover': {
            color: 'var(--secondary)',
            cursor: 'pointer',
        },
    }),
    control: () => ({
        textAlign: 'start',
        border: '1px solid #e6e6e6',
        display: 'flex',
        cursor: 'pointer',
        padding: 0,
        borderRadius: '10px',
        transition: '.3s',
        padding: 2,
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        '&:hover': {
            color: 'var(--secondary)',
        },
    }),
};
