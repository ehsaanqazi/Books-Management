import { FC } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "../modules/user/Register";
import Login from "../modules/user/Login";
import ListBooks from "../modules/books/ListBooks";

const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ListBooks />} />
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
