import React, { useState, useEffect } from 'react';
import apiClient from '../auth/apiClient';
import { useParams, useNavigate } from 'react-router-dom';
import OrderItemsTable from './orderItems';
import FormattedPrice from '../assets/formatedprice';

const OrderDetails = () => {
  const { orderID } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State to toggle modal
  const [isCancelling, setIsCancelling] = useState(false); // State for cancellation process


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/api/orders/${orderID}`);
        setOrder(response.data.data);
      } catch (err) {
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderID]);

  const cancelOrder = async () => {
    try {
      setIsCancelling(true);
      await apiClient.put(`/api/order/update/${orderID}`,{status:'Cancelled'});
      setShowModal(false);
      navigate('/orders');
    } catch (err) {
      console.error('Error cancelling order:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (error)
    return (
      <div className="text-center py-10 mt-4">
        <p>{error}</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );

  const {
    order_number,
    owner,
    total_cost,
    vat,
    discount,
    served_by,
    shipping_address,
    status,
    items,
    payments,
    payment_mode,
  } = order;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-4 mb-4">
        <div>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Order Number:</span> {order_number}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Total Cost:</span> <FormattedPrice price={total_cost} />
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Payment Mode:</span> {payment_mode?.payment_mode_name || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Served By:</span> {served_by}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Status:</span>{' '}
            <span
              className={`px-2 py-1 rounded ${
                status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {status}
            </span>
          </p>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">User Information</h3>
        <p className="text-gray-600">
          <span className="font-semibold text-gray-800">Name:</span> {owner?.name || 'N/A'}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold text-gray-800">Email:</span> {owner?.email || 'N/A'}
        </p>
      </div>

      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Address</h3>
        {shipping_address ? (
          <p className="text-gray-600">{shipping_address.shipping_address}</p>
        ) : (
          <p className="text-gray-600">No address provided.</p>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2">Ordered Item(s)</h3>
      <div className="border-b pb-4 mb-4">
        <OrderItemsTable items={items} />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Payments</h3>
        {payments && payments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <li key={index} className="py-2">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Amount:</span> <FormattedPrice price={payment.amount} />
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Date:</span> {new Date(payment.created_at)?.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Payment ID:</span> {payment.payment_id}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No payments found for this order.</p>
        )}
      </div>

      {/* Cancel Order Button */}
      {status === 'Created' && (
        <div className="mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel Order
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={cancelOrder}
                className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
                  isCancelling ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
