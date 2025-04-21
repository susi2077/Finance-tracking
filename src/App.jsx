import { useContext, useEffect, useState } from "react";
import HomePage from "./HomePage";

import TransactionDialog from "./HomeComponents/TransactionDialog";
import MyContext from "./Context";
import DisplayCardDialog from "./HomeComponents/DisplayCardDialog";
import DisplayDeleteDialog from "./HomeComponents/DisplayDeleteDialog";
import axios from "axios";
import endpoint from "./api";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ExpenseIncomeVisualization from "./HomeComponents/ExpenseIncomeVisualization";
import Settings from "./HomeComponents/Setting";
import AuthForm from "./AuthComponent/AuthComponent";
import Dashboard from "./HomeComponents/Dashboard";

function App() {
  const {
    openDialog,
    setOpenDialog,
    openCardDetails,
    setOpenCardDetails,
    setSelectedItem,
    setIsEditing,
    openDeleteDialog,
    setDeleteDialog,
    setUserData,
    token,
    isCurrencyChanged,
    setToken,
  } = useContext(MyContext);

  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${endpoint}/user/verify-user/${token}`);
      setUserData(response.data.userDetails);
      // console.log("The user data is: ", response);
    } catch (error) {
      console.log(error);
      localStorage.removeItem("yoyo_token");
      setToken(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [isCurrencyChanged]);

  const pathname = window.location.pathname;

  return (
    <div className="w-full h-[100vh] relative flex ">
      {pathname !== "/" && <HomePage />}
      <div className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<ExpenseIncomeVisualization />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      {openDialog && (
        <div
          onClick={() => {
            setOpenDialog(false);
            setSelectedItem("");
            setIsEditing(false);
          }}
          className="backdrop-blur-[3px] bg-black/20 z-[30] absolute inset-0 flex items-center justify-center p-4"
        >
          <TransactionDialog />
        </div>
      )}

      {openCardDetails && (
        <div
          onClick={() => {
            setOpenCardDetails(false);
            setSelectedItem("");
            setIsEditing(false);
          }}
          className="backdrop-blur-[3px] bg-black/20 z-[30] absolute inset-0 flex items-center justify-center p-4"
        >
          <DisplayCardDialog />
        </div>
      )}

      {openDeleteDialog && (
        <div
          onClick={() => {
            setDeleteDialog(false);
          }}
          className="backdrop-blur-[3px] bg-black/20 z-[30] absolute inset-0 flex items-center justify-center p-4"
        >
          <DisplayDeleteDialog />
        </div>
      )}
    </div>
  );
}

export default App;
