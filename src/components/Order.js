import React, { useState, useEffect } from 'react';
import FormattedPrice from '../assets/formatedprice';
import { toSentenceCase } from '../assets/textUtil';
import apiClient from '../auth/apiClient';
import { Link } from 'react-router-dom';
const Order = ({ order, expandedOrderId, handleToggleExpand, handleOpenReviewModal = null, handlePay = null, showPay = true }) => {
  const [expanded, setExpanded] = useState(expandedOrderId === order.id);
  const [reviewStatus, setReviewStatus] = useState({}); // Store if each product has a review by the user

  const parseItems = (items) => {
    try {
      const parsedItems = JSON.parse(items[0]['items']);
  
      // Return parsedItems only if it's an array; otherwise, convert it.
      return Array.isArray(parsedItems) ? parsedItems : Object.values(parsedItems);
    } catch (error) {
      console.error('Error parsing items:', error);
      return [];
    }
  };
  
  
  // Function to check if the user has reviewed each product
  const checkReviews = async () => {
    const statuses = {};
    
    const items = parseItems(order.items);
    for (const item of items) {
      if (item?.product?.id) { // Ensure product and id are defined
        try {
          const response = await apiClient.get(`/api/products/${item.product.id}/user-review`);
          statuses[item.product.id] = response.data.data.hasReview;
        } catch (error) {
          console.error('Error checking review status:', error);
        }
      } else {
        console.warn('Item product or id is missing:', item);
      }
    }
    setReviewStatus(statuses);
  };
  

  useEffect(() => {
    checkReviews();
  }, [order.items]);

  const shortenString = (str) => {
    if (str.length > 10) {
      return str.substring(0, 10) + '...';
    }
    return str;
  };

  return (
    <li
      key={order.id}
      className={`relative p-1 border rounded-md shadow-sm group list-none ${
        Array.isArray(order.payments) &&
        order.payments.length > 0 &&
        order.payments.every(payment => typeof payment.amount === 'number' || !isNaN(Number(payment.amount)))
          ? order.payments.reduce((sum, payment) => {
              const amount = Number(payment.amount);
              return sum + (isNaN(amount) ? 0 : amount);
            }, 0) === parseInt(order.total_cost)
            ? "bg-green-300"
            : "hover:bg-gray-300"
          : "hover:bg-gray-300"
      }`}
      onClick={() => handleToggleExpand(order.id)}
    >
      <div className="grid grid-cols-3 divide-x">
        <p className="text-gray-900 font-semibold p-2">
          {`Order #${expandedOrderId === order.id ? order.order_number : shortenString(order.order_number)}`}
        </p>
        <p className="text-gray-900 font-semibold p-2 flex justify-content-end">
          <FormattedPrice price={order.total_cost} />
        </p>
        <p className="text-gray-600 p-2">
          {order.shipping_address?.shipping_address}
        </p>
      </div>

      {expandedOrderId === order.id && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ordered Item(s)</h3>
          <ul className="space-y-4">
            {Object.entries(parseItems(order.items)).map(([key, item]) => {
              const hasReview = reviewStatus[item.product.id];
              

              return (
                <li
                  key={key}
                  className="flex items-center justify-between py-3 border-b last:border-none border-gray-300"
                >
                  <div className="flex items-center space-x-4">
                  <Link to={`/product/${item.product.id}`}>
                  <img
                      src={item.product.images?.[0]?.img_url
                        ? `${apiClient.defaults.baseURL}${item.product.images[0].img_url.replace(/^\//, '')}`
                        : '/path/to/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    /></Link>
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
                  {order.status === 'Delivered' && !hasReview && (
                    <button
                      onClick={() => handleOpenReviewModal(item)}
                      className="ml-4 p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-800 transition duration-300"
                    >
                      Add Review
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="text-right mt-6">
            <span className="text-xl font-semibold text-gray-900">
              Total: <FormattedPrice price={order.total_cost || 0} />
            </span>
          </div>
        </div>
      )}

      {(order?.payments?.length === 0 && showPay) && (
        <button
          onClick={() => handlePay(order)}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 block sm:hidden group-hover:block"
        >
          Pay
        </button>
      )}
    </li>
  );
};

export default Order;
