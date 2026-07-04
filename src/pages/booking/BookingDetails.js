import {
  Button,
  Card,
  Container,
  Grid,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Image,
  Divider,
} from "@mantine/core";
import dayjs from "dayjs";

import { useHotel } from "../hotels/provider";
import { useRoom } from "../rooms/provider";
import { useBooking } from "./provider";
import { formatCurrency } from "../../utils/constants";

export default function BookingDetails() {
  const {
    selectedHotel,
    checkIn,
    checkOut,
    adults,
    nights,
    getRoomPricing,
    hotelLoading,
  } = useHotel();

  const {
    guestDetails,
    handleGuestDetailsChange,
    goToPayment,
    showPolicies,
    setShowPolicies,
    errors,
  } = useBooking();

  const { selectedRoom } = useRoom();

  if (hotelLoading) return <Loader />;

  if (!selectedHotel || !selectedRoom) {
    return (
      <Stack align="center" py={80}>
        <Title order={2}>Booking not found</Title>
        <Text c="dimmed">Please select a room before continuing.</Text>
      </Stack>
    );
  }

  const pricing = getRoomPricing(selectedRoom.pricePerNight);

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        {/* BOOKING OVERVIEW */}
        <Card withBorder radius="md" p="xl">
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group align="flex-start" wrap="nowrap">
                <Image
                  src={selectedHotel.image}
                  w={280}
                  h={190}
                  radius="md"
                  fit="cover"
                />

                <Stack gap={8} style={{ flex: 1 }}>
                  <Title order={2}>{selectedHotel.name}</Title>

                  <Text c="dimmed">{selectedHotel.address}</Text>

                  <Group gap="md" mt="xs">
                    <Text
                      size="sm"
                      c="dimmed"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      💚 Couple Friendly
                    </Text>

                    <Text
                      size="sm"
                      c="dimmed"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      📶 Free WiFi
                    </Text>

                    <Text
                      size="sm"
                      c="dimmed"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      🍷 Alcohol Allowed
                    </Text>
                  </Group>
                </Stack>
              </Group>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card radius="md" p="lg" bg="#fafafa">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text c="dimmed">Room subtotal</Text>
                    <Text fw={500}>{formatCurrency(pricing.subtotal)}</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text c="dimmed">Taxes & fees</Text>
                    <Text fw={500}>{formatCurrency(pricing.taxes)}</Text>
                  </Group>

                  <Divider my="xs" />

                  <Group justify="space-between">
                    <Text fw={700}>Total</Text>

                    <Text fw={700} size="xl" c="blue">
                      {formatCurrency(pricing.total)}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          <Divider my="xl" />

          <Grid>
            <Grid.Col span={3}>
              <Text size="sm" c="dimmed">
                Check-in
              </Text>
              <Text fw={600}>{dayjs(checkIn).format("DD MMM YYYY")}</Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text size="sm" c="dimmed">
                Check-out
              </Text>
              <Text fw={600}>{dayjs(checkOut).format("DD MMM YYYY")}</Text>
            </Grid.Col>

            <Grid.Col span={2}>
              <Text size="sm" c="dimmed">
                Guests
              </Text>
              <Text fw={600}>{adults}</Text>
            </Grid.Col>

            <Grid.Col span={2}>
              <Text size="sm" c="dimmed">
                Nights
              </Text>
              <Text fw={600}>{nights}</Text>
            </Grid.Col>

            <Grid.Col span={2}>
              <Text size="sm" c="dimmed">
                Room
              </Text>
              <Text fw={600}>{selectedRoom.type}</Text>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder radius="md" p="xl">
          <Stack gap="md">
            <Title order={3}>Important Information</Title>

            <Text size="sm">💚 Unmarried couples are welcome</Text>
            <Text size="sm">🪪 Valid government ID required at check-in</Text>
            <Text size="sm">🚭 Smoking not allowed inside rooms</Text>

            {showPolicies && (
              <>
                <Text size="sm">🍷 Alcohol consumption allowed</Text>
                <Text size="sm">🐾 Pets are not allowed</Text>
                <Text size="sm">🕑 Check-in from 2:00 PM</Text>
                <Text size="sm">🕚 Check-out before 11:00 AM</Text>
              </>
            )}

            <Text
              size="sm"
              c="blue"
              fw={500}
              style={{ cursor: "pointer", width: "fit-content" }}
              onClick={() => setShowPolicies(!showPolicies)}
            >
              {showPolicies ? "View Less" : "View More"}
            </Text>
          </Stack>
        </Card>

        {/* GUEST DETAILS */}
        <Card withBorder radius="md" p="xl">
          <Stack gap="md">
            <Title order={2}>Guest Details</Title>

            <TextInput
              label="Full Name"
              placeholder="Enter full name"
              value={guestDetails.fullName}
              onChange={handleGuestDetailsChange("fullName")}
              error={errors.fullName}
            />

            <TextInput
              label="Email"
              placeholder="Enter email"
              value={guestDetails.email}
              onChange={handleGuestDetailsChange("email")}
              error={errors.email}
            />

            <TextInput
              label="Phone Number"
              placeholder="Enter phone number"
              value={guestDetails.phone}
              onChange={handleGuestDetailsChange("phone")}
              error={errors.phone}
            />

            <Textarea
              label="Special Requests (Optional)"
              placeholder="Early check-in, late checkout, high floor..."
              minRows={4}
              value={guestDetails.specialRequest}
              onChange={handleGuestDetailsChange("specialRequest")}
            />

            <Button mt="sm" size="md" onClick={goToPayment}>
              Proceed to Payment
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
