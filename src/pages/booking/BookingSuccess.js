import {
  Button,
  Container,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookingSuccess() {
  return (
    <Container size="sm" py={80}>
      <Paper withBorder radius="md" p="xl">
        <Stack align="center" gap="md" ta="center">
          <ThemeIcon color="green" size={72} radius="xl">
            <Check size={42} />
          </ThemeIcon>

          <Title order={1} c="green">
            Booking Success
          </Title>

          <Text c="dimmed" size="lg">
            Your booking has been confirmed. Please check your email for the
            booking details.
          </Text>

          <Button component={Link} to="/hotels" color="green" mt="sm">
            Explore more hotels
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
