import { useState } from "react";
import { useInvoiceStore } from "../../store/invoiceSlice";
import { X } from "lucide-react";
import Button from "@mui/material/Button";

const CommentModal: React.FC = () => {
  const { selectedInvoice, setSelectedInvoice, addComment } = useInvoiceStore();
  const [newComment, setNewComment] = useState("");

  if (!selectedInvoice) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(selectedInvoice.id, newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Comments - {selectedInvoice.invoiceNumber}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedInvoice.clientName}
            </p>
          </div>
          <Button
            onClick={() => setSelectedInvoice(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
          {selectedInvoice.comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          ) : (
            selectedInvoice.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3 ">
                <p className="text-sm text-gray-700">{comment.text}</p>
                <div className="flex flex-col justify-between items-end mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.userName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
          />
          <div className="mt-3 flex justify-end space-x-3 gap-3">
            <Button
              variant="outlined"
              onClick={() => setSelectedInvoice(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
