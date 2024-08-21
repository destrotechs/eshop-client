import React from 'react';

const FormattedPrice = ({ price }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            // minimumFractionDigits: 2,
            // maximumFractionDigits: 2
        }).format(price);
    };

    return <span>Kes. {formatPrice(price)}</span>;
};

export default FormattedPrice;
