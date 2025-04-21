import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Create the context
const MyContext = createContext();

// 2. Create a provider component
export const MyProvider = ({ children }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [openCardDetails, setOpenCardDetails] = useState(false);
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("yoyo_token") || "");

  const [userData, setUserData] = useState();
  const [isCurrencyChanged, setIsCurrencyChanged] = useState(false);

  return (
    <MyContext.Provider
      value={{
        openDialog,
        setOpenDialog,
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        openCardDetails,
        setOpenCardDetails,
        openDeleteDialog,
        setDeleteDialog,
        selectedItem,
        setSelectedItem,
        isEditing,
        setIsEditing,
        token,
        setToken,
        userData,
        setUserData,
        isCurrencyChanged,
        setIsCurrencyChanged,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
