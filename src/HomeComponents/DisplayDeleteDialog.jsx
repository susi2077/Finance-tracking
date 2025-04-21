import React, { useContext, useState } from "react";
import axios from "axios";
import MyContext from "../Context";
import endpoint from "../api";

const DisplayDeleteDialog = () => {
  const { openDeleteDialog, setDeleteDialog, selectedItem } =
    useContext(MyContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setDeleteDialog(false);
    setError(null);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      setTimeout(async () => {
        await axios.delete(
          `${endpoint}/transaction/delete-transaction/${selectedItem._id}`
        );
        setIsDeleting(false);
        setDeleteDialog(false);
      }, 1000);

      // Optional: You might want to refresh data or update state after successful deletion
      // For example: fetchItems(); or removeItemFromState(itemToDelete.id);
    } catch (err) {
      setIsDeleting(false);
      setError("Failed to delete item. Please try again.");
      console.error("Delete error:", err);
    }
  };

  if (!openDeleteDialog) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="bg-white rounded-lg p-6 max-w-md w-full"
    >
      <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>

      <p className="mb-6">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleClose}
          className="px-4 py-2 border rounded"
          disabled={isDeleting}
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DisplayDeleteDialog;
