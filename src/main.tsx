import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Statistics from "./pages/Statistics";
import Users from "./pages/Users";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/ru";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import Protected, {
  ProtectedAdmin,
  ProtectedTherapist,
} from "./components/Protected";
import Patient from "./pages/Patient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
dayjs.extend(customParseFormat);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <DatesProvider
        settings={{
          locale: "ru",
          consistentWeeks: true,
          timezone: "UTC",
        }}
      >
        <ModalsProvider>
          <Notifications autoClose={2000} />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Protected>
                    <Login />
                  </Protected>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <Protected>
                    <Dashboard />
                  </Protected>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedTherapist>
                      <Patients />
                    </ProtectedTherapist>
                  }
                />
                <Route path="statistics" element={<Statistics />} />
                <Route
                  path="users"
                  element={
                    <ProtectedAdmin>
                      <Users />
                    </ProtectedAdmin>
                  }
                />
                <Route
                  path=":id"
                  element={
                    <ProtectedTherapist>
                      <Patient />
                    </ProtectedTherapist>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  </QueryClientProvider>
);
