import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

export default function StudentLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}