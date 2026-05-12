import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Keys from "./pages/Keys";
import GenerateKey from "./pages/GenerateKey";
import AuditLogs from "./pages/AuditLogs";
import Users from "./pages/Users";
import KeyDetail from "./pages/KeyDetail";
import About from "./pages/About";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Login,
    },

    {
        path: "/app",
        Component: () => (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),

        children: [
            {
                index: true,
                Component: Dashboard,
            },

            {
                path: "keys",
                Component: Keys,
            },

            {
                path: "keys/:id",
                Component: KeyDetail,
            },

            {
                path: "generate",
                Component: GenerateKey,
            },

            {
                path: "audit",
                Component: AuditLogs,
            },

            {
                path: "users",
                Component: Users,
            },

            {
                path: "about",
                Component: About,
            },
        ],
    },
]);