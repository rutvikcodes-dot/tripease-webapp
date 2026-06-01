import { useHotel } from "./provider";
import dayjs from "dayjs";
import { useRoom } from "../rooms/provider";
import { Card, Title, Text, Button, Loader, Badge, Group } from "@mantine/core";

const HotelDetails = () => {
  const { selectedHotel, hotelLoading, checkIn, checkOut } = useHotel();
  const { selectRoom } = useRoom();

  const nights = dayjs(checkOut).diff(dayjs(checkIn), "day");

  if (hotelLoading) return <Loader />;
  if (!selectedHotel) return <Text>Hotel not found</Text>;

  return (
    <div style={{ padding: "2rem" }}>
      <Title order={2}>{selectedHotel.name}</Title>
      <Text mb="lg">{selectedHotel.address}</Text>

      <Title order={3} mb="md">
        Available Rooms
      </Title>

      {selectedHotel.rooms?.map((room) => (
        <Card key={room.id} shadow="sm" padding="lg" mb="md" withBorder>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* LEFT SIDE */}
            <div>
              <Title order={4}>{room.type}</Title>

              {room.amenities?.length > 0 && (
                <Group gap="xs" mb="md">
                  {room.amenities.map((amenity, index) => (
                    <Badge key={index} variant="light" radius="sm" size="md">
                      {amenity}
                    </Badge>
                  ))}
                </Group>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                {room.images?.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      width: 350,
                      height: 300,
                      overflow: "hidden",
                      borderRadius: 8,
                    }}
                  >
                    <img
                      src={img}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      alt={img}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                minWidth: 340,
                width: 340,
                marginLeft: 24,
                padding: "28px",
                borderRadius: 12,
                background: "#fafafa",
                border: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text fw={700} size="lg" mb={18}>
                Room Details
              </Text>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                <Text size="md" fw={500}>
                  👥 Sleeps {room.maxGuests}
                </Text>

                <Text size="md" fw={500}>
                  🛏 {room.bedType}
                </Text>

                <Text size="md" fw={500}>
                  📐 {room.sizeSqft} sq ft
                </Text>

                <Text size="md" fw={500}>
                  🌅 {room.viewType}
                </Text>
              </div>

              <div style={{ marginBottom: 12 }}>
                {nights > 1 ? (
                  <>
                    <Text fw={700} size="xl" c="blue">
                      ₹{(room.pricePerNight * nights).toLocaleString()}
                    </Text>

                    <Text size="sm" c="dimmed">
                      ₹{room.pricePerNight.toLocaleString()} / night
                    </Text>

                    <Text size="sm" c="dimmed" mt={4}>
                      + ₹{Math.round(room.pricePerNight * 0.12).toLocaleString()} taxes & fees
                    </Text>
                  </>
                ) : (
                  <>
                    <Text fw={700} size="xl" c="blue">
                      ₹{room.pricePerNight.toLocaleString()}
                    </Text>

                    <Text size="sm" c="dimmed" mt={4}>
                      + ₹{Math.round(room.pricePerNight * 0.12).toLocaleString()} taxes & fees
                    </Text>
                  </>
                )}
              </div>

              <Button fullWidth size="md" radius="md" onClick={() => selectRoom(room)}>
                Select Room
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HotelDetails;
