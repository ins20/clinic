import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Tooltip,
} from "@mantine/core";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

function ToggleTheme() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <Tooltip label="Сменить тему">
      <ActionIcon
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        aria-label="Toggle color scheme"
      >
        {colorScheme === "light" ? <MoonIcon /> : <SunIcon />}
      </ActionIcon>
    </Tooltip>
  );
}
export default ToggleTheme;
