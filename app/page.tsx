import Sidebar from '@/modules/sidebar';

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-lg">Name</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold">Name</span>
            <button className="border border-gray-300 rounded-full px-4 py-1 flex items-center gap-2">
              <span>📞</span> Contact
            </button>
          </div>
        </div>

        {/* Main Block */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-200">
          <div
            className="w-full h-full bg-gray-300"
            style={{ minHeight: '70vh' }}
          ></div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center gap-4 py-6 bg-white">
          <button className="bg-gray-800 text-white rounded-full px-6 py-2">
            + Add Block
          </button>
          <button className="bg-gray-800 text-white rounded-full px-6 py-2">
            ✏️ Design
          </button>
        </div>
      </main>
    </div>
  );
}
