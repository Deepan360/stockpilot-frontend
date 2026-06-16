import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <BrowserRouter>
     <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes> 
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
<Route path="/alerts" element={<Alerts />} />
<Route path="/analytics" element={<Analytics />} />
<Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;