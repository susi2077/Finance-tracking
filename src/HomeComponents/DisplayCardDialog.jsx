import React, { useContext, useState } from "react";
import MyContext from "../Context";
import { ArrowDownLeftSquare, PenIcon, Trash, X } from "lucide-react";

const DisplayCardDialog = () => {
  const {
    setOpenCardDetails,
    selectedItem,
    setOpenDialog,
    setSelectedItem,
    setIsEditing,
    setDeleteDialog,
  } = useContext(MyContext);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="w-full max-w-[400px] flex flex-col rounded-md"
    >
      <section
        className={`w-full flex flex-col ${
          selectedItem.type === "expense" ? "bg-red-600" : "bg-green-600"
        } rounded-t-md`}
      >
        <div className="w-full flex justify-between text-white pt-3 pb-1 px-3">
          <button
            onClick={(e) => {
              setOpenCardDetails(false);
              setSelectedItem("");
            }}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/30 rounded-full transition-all ease-in-out duration-300"
          >
            <X className="size-6" />
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setDeleteDialog(true);
                setOpenCardDetails(false);
              }}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/30 rounded-full transition-all ease-in-out duration-300"
            >
              <Trash className="size-6" />
            </button>
            <button
              onClick={() => {
                setOpenDialog(true);
                setOpenCardDetails(false);
                setIsEditing(true);
              }}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/30 rounded-full transition-all ease-in-out duration-300"
            >
              <PenIcon className="size-6" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center flex-col">
          <h1 className="text-3xl font-medium leading-relaxed tracking-wide text-white">
            {selectedItem.type === "expense" ? "EXPENSE" : "INCOME"}
          </h1>

          <p className="text-2xl text-white">
            {selectedItem.type === "expense" ? "-" : ""} NPR
            {selectedItem.amount}
          </p>

          <div className="flex justify-between w-full my-2">
            <div className="flex px-3 text-white">
              <span>
                {selectedItem.category.charAt(0).toUpperCase() +
                  selectedItem.category.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="flex gap-2 px-3 text-white">
              <span>
                {new Date(selectedItem.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>
                {new Date(
                  `2025-03-22T${selectedItem.time}:00`
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full bg-amber-200 px-3 py-2 rounded-b-md text-gray-800 min-h-28">
        {selectedItem.description
          ? `${selectedItem.description}`
          : "No description"}
      </div>
    </div>
  );
};

export default DisplayCardDialog;
