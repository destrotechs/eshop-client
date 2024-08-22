import React from 'react';

const FormattedPrice = ({ price }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            // minimumFractionDigits: 2,
            // maximumFractionDigits: 2
        }).format(price);
    };

    return <span className='text-indigo-700 font-bold'>Kes. {formatPrice(price)}</span>;
};

export default FormattedPrice;
