import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ToggleTheme from "../components/ToggleTheme";
import Logout from "../components/Logout";
import { Link, Outlet, useLocation } from "react-router-dom";
import { BarChartIcon, PersonIcon } from "@radix-ui/react-icons";
import ChangePassword from "../components/ChangePassword";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../types";
import { AxiosResponse } from "axios";

const Dashboard = () => {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const user = useQueryClient().getQueryData<AxiosResponse<User>>(["user"]);
  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <Group p="md" justify="space-between" align="center" h={"100%"}>
          <div>
            <Title order={3}>{user?.data.username}</Title>
            <Title order={6}>
              {user?.data.role === "therapist" ? "Врач" : "Исследователь"}
            </Title>
          </div>
          <Group>
            <ChangePassword />
            <ToggleTheme />
            <Logout />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {user?.data.role === "therapist" && (
          <NavLink
            component={Link}
            to=""
            label="Мои пациенты"
            leftSection={<PersonIcon />}
            active={location.pathname === "/dashboard"}
          />
        )}

        <NavLink
          component={Link}
          to="statistics"
          label="Статистика"
          leftSection={<BarChartIcon />}
          active={location.pathname === "/dashboard/statistics"}
        />
        {user?.data.is_superuser && (
          <NavLink
            component={Link}
            to="users"
            label="Пользователи"
            leftSection={<PersonIcon />}
            active={location.pathname === "/dashboard/users"}
          />
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;
