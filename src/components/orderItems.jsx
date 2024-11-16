import React from 'react';
import FormattedPrice from '../assets/formatedprice';
import apiClient from '../auth/apiClient';
import { Link } from 'react-router-dom';
const OrderItemsTable = ({ items }) => {
  
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
const orderItems = parseItems(items);
console.log('OrderItems', orderItems);
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2  text-left">Image</th>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Discount</th>
            <th className="px-4 py-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item, index) => {
            // const parsedItem = parseItems(item.items);
            // const productDetails = parsedItem[3]?.product || {};
            // const { name, price, discount } = productDetails;
            // const { quantity, total } = parsedItem[4] || {};

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                <Link to={`/product/${item.product.id}`}>
                      <img
                        src={item.product.images?.[0]?.img_url
                          ? `${apiClient.defaults.baseURL}${item.product.images[0].img_url.replace(/^\//, '')}`
                          : '/path/to/placeholder-image.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </Link>
                </td>
                <td className="px-4 py-2">{item.product.name || 'N/A'}</td>
                <td className="px-4 py-2"><FormattedPrice price={item.price}/></td>
                <td className="px-4 py-2">{item.quantity || 0}</td>
                <td className="px-4 py-2">{item.discount ? `${item.discount}%` : 0}</td>
                <td className="px-4 py-2"><FormattedPrice price={item.total}/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
