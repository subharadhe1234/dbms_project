import { XCircle } from "lucide-react";
import { useDB } from "../context/DBContext";

export default function ErrorToast() {
  const { error, clearError } = useDB();

  // If no error, render nothing
  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="flex items-start gap-3 max-w-sm
                   bg-neutral-900 border border-red-500/40
                   text-red-300 px-4 py-3 rounded-md shadow-lg"
      >
        {/* Icon */}
        <XCircle size={18} className="mt-0.5 text-red-400" />

        {/* Message */}
        <div className="flex-1 text-sm">
          <div className="font-medium text-red-400">Database Error</div>
          <div className="text-neutral-300 mt-1">{error}</div>
        </div>

        {/* Close */}
        <button
          onClick={clearError}
          className="text-neutral-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
