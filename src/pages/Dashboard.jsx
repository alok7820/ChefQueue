import OrderCard from "../components/OrderCard";

function Dashboard() {
  const orders = [
    { id: 101, customer: "Rahul", items: 3, status: "Pending", time: "15 min" },
    { id: 102, customer: "Aman", items: 2, status: "Preparing", time: "10 min" },
    { id: 103, customer: "Priya", items: 4, status: "Ready", time: "5 min" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Kitchen Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold">25</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-gray-500">Pending</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-gray-500">Preparing</h3>
          <p className="text-3xl font-bold">6</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-gray-500">Completed</h3>
          <p className="text-3xl font-bold">11</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-3">🤖 AI Kitchen Assistant</h2>
        <p className="text-gray-600">Current kitchen workload is normal.</p>
        <p className="mt-2">
          Estimated average preparation time:
          <span className="font-bold ml-2">15 minutes</span>
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Current Orders</h2>

      <div className="grid md:grid-cols-3 gap-5">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;