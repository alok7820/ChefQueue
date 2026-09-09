function OrderCard({ order }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between mb-3">
        <h3 className="text-lg font-bold">Order #{order.id}</h3>
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
          {order.status}
        </span>
      </div>

      <p className="text-gray-600">Customer: {order.customer}</p>
      <p className="text-gray-600">Items: {order.items}</p>
      <p className="text-gray-600">Estimated Time: {order.time}</p>

      <button className="mt-4 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
        Update Order
      </button>
    </div>
  );
}

export default OrderCard;