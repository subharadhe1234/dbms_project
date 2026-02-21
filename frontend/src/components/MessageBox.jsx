const MessageBox = ({ type, message, onClear }) => {
  if (!message) return null;

  const styles = {
    success: "bg-emerald-50 border-emerald-500 text-emerald-800",
    error: "bg-rose-50 border-rose-500 text-rose-800",
  };

  const icons = {
    success: (
      <svg
        className="w-5 h-5 text-emerald-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5 text-rose-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`fixed  z-50 flex  items-center p-4 mb-4 border-l-4 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 ${styles[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3 text-sm font-semibold flex-1">{message}</div>
      <button
        onClick={onClear}
        className="ml-auto hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default MessageBox;
