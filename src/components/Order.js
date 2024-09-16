import React, { useState } from 'react';
import FormattedPrice from '../assets/formatedprice';
import { toSentenceCase } from '../assets/textUtil';
import apiClient from '../auth/apiClient';

const Order = ({ order, expandedOrderId, handleToggleExpand, handleOpenReviewModal =null, handlePay=null,showPay=true }) => {
  const [expanded, setExpanded] = useState(expandedOrderId === order.id);

  const parseItems = (items) => {
    try {
      const parsedItems = JSON.parse(items[0]['items']);
      return parsedItems;
    } catch (error) {
      console.error('Error parsing items:', error);
      return {};
    }
  };

  return (
    <li
      key={order.id}
      className="relative p-6 border rounded-lg shadow-sm hover:bg-gray-100 group"
      onClick={() => handleToggleExpand(order.id)}
    >
      <div className="flex justify-between items-center">
        <p className="text-gray-900 font-semibold">
          {`Order #${order.order_number} - Status: ${order.status}`}
        </p>
        <p className="text-gray-600">
          {order.shipping_address?.shipping_address}
        </p>
      </div>

      {expandedOrderId === order.id && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ordered Items</h3>
          <ul className="space-y-4">
            {Object.entries(parseItems(order.items)).map(([key, item]) => (
              <li
                key={key}
                className="flex items-center justify-between py-3 border-b last:border-none border-gray-300"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images?.[0]?.img_url
                      ? `${apiClient.defaults.baseURL}${item.product.images[0].img_url.replace(/^\//, '')}`
                      : '/path/to/placeholder-image.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-gray-900 font-medium">{toSentenceCase(item.product.name)}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x <FormattedPrice price={item.price} />
                    </p>
                  </div>
                </div>
                <div className="text-gray-900 font-medium">
                  <FormattedPrice price={item.total} />
                </div>
                {order.status === 'Delivered' && (
                  <button
                    onClick={() => handleOpenReviewModal(item)}
                    className="ml-4 p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-800 transition duration-300"
                  >
                    Add Review
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="text-right mt-6">
            <span className="text-xl font-semibold text-gray-900">
              Total: <FormattedPrice price={order.total_cost || 0} />
            </span>
          </div>
        </div>
      )}

      {(order.payment === null && showPay) &&(
        <button
          onClick={() => handlePay(order)}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 group-hover:block hidden"
        >
          Pay
        </button>
      )}
    </li>
  );
};

export default Order;
