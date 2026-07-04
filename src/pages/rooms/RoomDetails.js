import React from "react";
import { Button, Card, Group, Image, Loader, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useHotel } from "../hotels/provider";
import { useRoom } from "./provider";
import { useBooking } from "../booking/provider";
import { formatCurrency } from "../../utils/constants";

export default function RoomDetails() {
  const navigate = useNavigate();
  const { selectedRoom } = useRoom();
  const { nights, getRoomPricing, hotelLoading } = useHotel();
  const { goToBooking } = useBooking();

  if (hotelLoading) return <Loader />;

  if (!selectedRoom) {
    return (
      <Stack align="center" py={80}>
        <Title order={2}>Room not found</Title>
        <Text c="dimmed">Please select a room from a hotel first.</Text>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Stack>
    );
  }

  const pricing = getRoomPricing(selectedRoom.pricePerNight);

  return (
    <Stack p="xl" gap="lg">
      <Title order={2}>{selectedRoom.type}</Title>

      <Card shadow="sm" padding="lg" withBorder>
        <Group align="flex-start" justify="space-between" wrap="nowrap" gap="md">
          {/* LEFT SIDE */}
          <Stack gap="md" style={{ flex: 1 }}>
            <Group gap="md" wrap="nowrap">
              {selectedRoom.images?.map((img, index) => (
                <Image key={img || index} src={img} alt={selectedRoom.type} w={360} h={240} radius="md" fit="cover" />
              ))}
            </Group>

            <Group gap="xl">
              <Text fw={500}>👥 Sleeps {selectedRoom.maxGuests}</Text>

              <Text fw={500}>🛏 {selectedRoom.bedType}</Text>

              <Text fw={500}>📐 {selectedRoom.sizeSqft} sq ft</Text>

              <Text fw={500}>🌅 {selectedRoom.viewType}</Text>
            </Group>

            <Group gap={6}>
              {selectedRoom.amenities?.map((amenity, index) => (
                <Text key={index} size="sm" c="dimmed">
                  • {amenity}
                </Text>
              ))}
            </Group>
          </Stack>

          {/* RIGHT SIDE */}
          <Card withBorder radius="md" p="xl" w={300}>
            <Stack gap="xs">
              <Title order={2} c="blue">
                {formatCurrency(pricing.total)}
              </Title>

              <Text size="sm" c="dimmed" mb="lg">
                {formatCurrency(selectedRoom.pricePerNight)} / night
              </Text>

              <Stack
                gap="sm"
                mb="lg"
                pt="md"
                style={{
                  borderTop: "1px solid #eee",
                }}
              >
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Room subtotal ({nights} {nights === 1 ? "night" : "nights"})
                  </Text>

                  <Text size="sm" fw={500}>
                    {formatCurrency(pricing.subtotal)}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Taxes & fees
                  </Text>

                  <Text size="sm" fw={500}>
                    {formatCurrency(pricing.taxes)}
                  </Text>
                </Group>

                <Group
                  justify="space-between"
                  pt="sm"
                  mt={4}
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

              <Button fullWidth size="md" onClick={goToBooking}>
                Continue Booking
              </Button>
            </Stack>
          </Card>
        </Group>
      </Card>
    </Stack>
  );
}
