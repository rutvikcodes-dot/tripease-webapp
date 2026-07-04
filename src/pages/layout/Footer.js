import { Text } from '@mantine/core';
import { BRAND_NAME } from "../../utils/constants";

export default function Footer() {
  return (
    <Text ta="center" c="dimmed" size="sm" py="md">
      {BRAND_NAME}
    </Text>
  );
}
