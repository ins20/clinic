import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import { AxiosResponse } from "axios";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  useQuery({
    queryKey: ["user"],
    queryFn: () =>
      api
        .get<User>("users/me")
        .then((res) => {
          navigate("/dashboard");
          return res;
        })
        .catch(() => {
          navigate("/");
        }),
  });
  return children;
};

export const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = useQueryClient().getQueryData<AxiosResponse<User>>(["user"]);
  if (user?.data.is_superuser) {
    return children;
  } else {
    navigate("patients");
  }
};

export const ProtectedTherapist = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const user = useQueryClient().getQueryData<AxiosResponse<User>>(["user"]);
  if (user?.data.role === "therapist") {
    return children;
  } else {
    navigate("statistics");
  }
};
export default Protected;
