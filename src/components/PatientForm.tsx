import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  InputLabel,
  Radio,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

const PatientForm = ({
  handleSubmit,
  initialValues,
}: {
  handleSubmit: any;
  initialValues?: any;
}) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialValues
      ? {
          ...initialValues,
          birthday: Date.parse(initialValues.birthday)
            ? new Date(initialValues.birthday)
            : new Date(),
        }
      : undefined,
  });
  return (
    <form
      onSubmit={form.onSubmit((val) => {
        handleSubmit(val);
      })}
    >
      <TextInput
        label="ФИО"
        placeholder="Введите фио"
        key={form.key("full_name")}
        {...form.getInputProps("full_name")}
      />
      <TextInput
        label="Место жительства"
        placeholder="Введите место жительства"
        key={form.key("living_place")}
        {...form.getInputProps("living_place")}
      />
      <TextInput
        label="Должность"
        placeholder="Введите должность"
        key={form.key("job_title")}
        {...form.getInputProps("job_title")}
      />
      <DateInput
        valueFormat="DD MM YYYY"
        key={form.key("birthday")}
        {...form.getInputProps("birthday")}
        label="Дата рождения"
        placeholder="Выберите / введите дату рождения"
        clearable
      />
      <Radio.Group
        key={form.key("gender")}
        {...form.getInputProps("gender")}
        name="gender"
        label="Пол"
      >
        <Group>
          <Radio value="М" label="м" />
          <Radio value="Ж" label="ж" />
        </Group>
      </Radio.Group>
      <Box>
        <InputLabel>Болезни</InputLabel>
        <Flex gap={"md"}>
          <Checkbox
            label="БП"
            checked={form.getValues().bp}
            onChange={(event) =>
              form.setFieldValue("bp", event.currentTarget.checked)
            }
          />
          <Checkbox
            label="Ишемия"
            checked={form.getValues().ischemia}
            onChange={(event) =>
              form.setFieldValue("ischemia", event.currentTarget.checked)
            }
          />
          <Checkbox
            label="ДЭП"
            checked={form.getValues().dep}
            onChange={(event) =>
              form.setFieldValue("dep", event.currentTarget.checked)
            }
          />
        </Flex>
      </Box>

      <Radio.Group
        name="inhabited_locality"
        label="Населенный пункт"
        key={form.key("inhabited_locality")}
        {...form.getInputProps("inhabited_locality")}
      >
        <Group>
          <Radio value="Город" label="Город" />
          <Radio value="Район" label="Район" />
        </Group>
      </Radio.Group>

      <Group justify="flex-start" mt="md">
        <Button type="submit">
          {initialValues ? "Сохранить" : "Добавить"}
        </Button>
      </Group>
    </form>
  );
};

export default PatientForm;
