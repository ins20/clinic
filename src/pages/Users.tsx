import UserForm from "../components/UserForm";
import { Flex, Paper } from "@mantine/core";
import UsersTable from "../components/UsersTable";


const Users = () => {
  return (
    <Flex gap={"md"}>
      <Paper shadow="xs" p="xl" w={"20%"}>
        <UserForm />
      </Paper>
      <Paper shadow="xs" p="xl">
        <UsersTable />
      </Paper>
    </Flex>
  );
};

export default Users;
