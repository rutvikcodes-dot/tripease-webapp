import {
  Button,
  Card,
  Container,
  Grid,
  Image,
  Stack,
  Text,
  Title,
  Group,
  Loader,
} from "@mantine/core";
import dayjs from "dayjs";
import { useHotel } from "../hotels/provider";
import { useRoom } from "../rooms/provider";
import { usePayment } from "./provider";
import { formatCurrency } from "../../utils/constants";

export default function CheckoutDetails() {
  const {
    selectedHotel,
    checkIn,
    checkOut,
    nights,
    getRoomPricing,
    hotelLoading,
  } = useHotel();

  const { selectedRoom } = useRoom();
  const { handlePayment, isBookingLoading } = usePayment();

  if (hotelLoading) return <Loader />;

  if (!selectedHotel || !selectedRoom) {
    return (
      <Stack align="center" py={80}>
        <Title order={2}>Checkout not found</Title>
        <Text c="dimmed">Please select a room before continuing.</Text>
      </Stack>
    );
  }

  const pricing = getRoomPricing(selectedRoom.pricePerNight);

  return (
    <Container size="xl" py="xl" pos="relative">
      {isBookingLoading && (
        <Stack
          align="center"
          justify="center"
          gap="sm"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            minHeight: "100%",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(2px)",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <Loader type="bars" />
          <Text fw={600}>Generating your booking...</Text>
          <Text size="sm" c="dimmed" ta="center">
            Please wait while we confirm your reservation.
          </Text>
        </Stack>
      )}
      <Grid gutter="xl">
        {/* LEFT */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={2}>Secure Checkout</Title>

              <Text c="dimmed">
                Complete your booking securely with UPI, Cards or Net Banking.
              </Text>

              <Card
                radius="md"
                p="md"
                style={{
                  background: "#f8f9fa",
                }}
              >
                <Text fw={600}>Accepted payment methods</Text>

                <Group gap="md" mt="sm">
                  <Text>💳 Cards</Text>
                  <Text>📱 UPI</Text>
                  <Text>🏦 Net Banking</Text>
                </Group>
              </Card>

              <Button
                size="lg"
                mt="md"
                fullWidth
                onClick={handlePayment}
                loading={isBookingLoading}
                disabled={isBookingLoading}
              >
                Pay {formatCurrency(pricing.total)}
              </Button>

              <Text size="xs" c="dimmed" ta="center">
                🔒 100% secure payments powered by Razorpay
              </Text>
            </Stack>
          </Card>
        </Grid.Col>

        {/* RIGHT */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" p="lg">
            <Stack gap="sm">
              <Image
                src={selectedHotel.image}
                radius="md"
                h={180}
                fit="cover"
              />

              <Title order={4}>{selectedHotel.name}</Title>

              <Text c="dimmed">{selectedRoom.type}</Text>

              <Group justify="space-between" mt="sm">
                <Text size="sm">Check-in</Text>
                <Text size="sm">{dayjs(checkIn).format("DD MMM YYYY")}</Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm">Check-out</Text>
                <Text size="sm">{dayjs(checkOut).format("DD MMM YYYY")}</Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm">Nights</Text>
                <Text size="sm">{nights}</Text>
              </Group>

              <Group justify="space-between" mt="md">
                <Text c="dimmed">Subtotal</Text>
                <Text>{formatCurrency(pricing.subtotal)}</Text>
              </Group>

              <Group justify="space-between">
                <Text c="dimmed">Taxes & fees</Text>
                <Text>{formatCurrency(pricing.taxes)}</Text>
              </Group>

              <Group
                justify="space-between"
                pt="md"
                style={{
                  borderTop: "1px solid #eee",
                }}
              >
                <Text fw={700}>Total</Text>

                <Text fw={700} c="blue">
                  {formatCurrency(pricing.total)}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
