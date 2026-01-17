export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
                    <span className="text-green-600 text-xs font-medium">+12% from last week</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Active Offers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
                    <span className="text-gray-400 text-xs font-medium">Max 5 allowed</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Profile Score</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">98%</p>
                    <span className="text-green-600 text-xs font-medium">Excellent</span>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center py-20">
                <h3 className="text-lg font-medium text-gray-900">Manage Your Store</h3>
                <p className="text-gray-500 mt-2">Edit operating hours, upload new photos, and create flash sales.</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Settings</button>
            </div>
        </div>
    );
}
