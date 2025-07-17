import api from "./api";

export default function RefreshTokenDemo() {
  const handleMultiRequests = async () => {
    const call = (i: number) =>
      api
        .get(`/data${i}`)
        .then(() => console.log(`✅ Call ${i} success for request /data${i}`))
        .catch(() => console.log(`❌ Call ${i} failed for request /data${i}`));
    await Promise.all([1, 2, 3, 4, 5].map(call));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                🔐
              </div>
              <h1 className="text-3xl font-bold">Token Refresh Demo</h1>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed">
              Initial access token is expired — only one refresh should occur.
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Test Multiple Requests
              </h2>
              <p className="text-slate-600 mb-6">
                Click the button below to fire 5 parallel requests and observe
                how the token refresh mechanism handles concurrent API calls.
              </p>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">
                    How it works:
                  </span>
                </div>
                <p className="text-sm text-slate-600 ml-4">
                  When multiple requests are made simultaneously with an expired
                  token, the system will refresh the token only once and retry
                  all failed requests.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={handleMultiRequests}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-out"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-lg">🚀</span>
                  <span>Fire 5 Parallel Requests</span>
                </div>
              </button>
            </div>

            {/* Info Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                  ℹ️
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-2">
                    Check Developer Console
                  </h3>
                  <p className="text-emerald-700 text-sm">
                    Open your browser's developer console to see the
                    success/failure messages for each request in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
