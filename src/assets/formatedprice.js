import React from 'react';

const FormattedPrice = ({ price,crossed=false }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            // minimumFractionDigits: 2,
            // maximumFractionDigits: 2
        }).format(price);
    };

    return crossed?<span className="text-sm line-through text-gray-400 ml-3">Kes. {formatPrice(price)}</span>:<span className='text-indigo-700 font-bold'>Kes. {formatPrice(price)}</span>;
};

export default FormattedPrice;
