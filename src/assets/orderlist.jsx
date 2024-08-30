import React, { useState, useRef } from 'react';

const OrderList = ({ orders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const ordersRef = useRef(null);

  const handleToggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div ref={ordersRef}>
      <h2 className="text-1xl font-medium text-gray-600 mb-6">Orders</h2>
      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="relative p-4 border rounded-lg shadow-sm hover:bg-gray-50"
              onClick={() => handleToggleExpand(order.id)}
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-900 font-medium">
                  {`Order #${order.id} - Total: $${order.total} - Status: ${order.status}`}
                </p>
                <button
                  className={`absolute top-2 right-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-opacity duration-300 ${
                    expandedOrderId === order.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle add review logic
                  }}
                >
                  Add Review
                </button>
              </div>
              {expandedOrderId === order.id && (
                <div className="mt-4">
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id} className="py-2 border-b border-gray-200">
                        <p className="text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ${item.price}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default OrderList;
