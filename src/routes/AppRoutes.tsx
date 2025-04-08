import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { UnAuthRoutes } from "./UnAuthRoutes";
import { SideMenu } from "../components/SideMenu/SideMenu";

function AppRoutes() {
  return (
    <Router basename="/simsn-interface-v2">
      <SideMenu />
      <Routes>
        {AuthRoutes}
        {UnAuthRoutes}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
