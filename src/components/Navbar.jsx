function Navbar() {
  return (
    <nav className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">ChefQueue</h1>
      <div className="flex gap-6">
        <button>Dashboard</button>
        <button>Orders</button>
        <button>Kitchen</button>
      </div>
    </nav>
  );
}

export default Navbar;