import React, { useState, Suspense, lazy } from "react";
import { MessageSquare, X } from "lucide-react";

const InboxComponent = lazy(() => import("@/components/HomeSection/Chat/InboxComponent"));

const FloatingChat = ({ user }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center transition"
        >
          <MessageSquare size={30} />
        </button>
      )}

      {open && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between bg-gray-50">
            <h3 className="font-semibold text-gray-700">Inbox</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<div className="p-4 text-center">Caricamento chat…</div>}>
              <InboxComponent user={user} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;


