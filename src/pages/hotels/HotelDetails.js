import { useHotel } from "./provider";
import { useRoom } from "../rooms/provider";
import { Card, Title, Text, Button, Loader, Badge, Group } from "@mantine/core";

const HotelDetails = () => {
  const {
    selectedHotel,
    hotelLoading,
    adults,
    nights,
    getRoomPricing,
  } = useHotel();
  const { selectRoom } = useRoom();

  if (hotelLoading) return <Loader />;
  if (!selectedHotel) return <Text>Hotel not found</Text>;

  return (
    <div style={{ padding: "2rem" }}>
      <Title order={2}>{selectedHotel.name}</Title>
      <Text mb="lg">{selectedHotel.address}</Text>

      <Title order={3} mb="md">
        Available Rooms
      </Title>

      {selectedHotel.rooms?.map((room) => {
        const isOverCapacity = adults > room.maxGuests;
        const pricing = getRoomPricing(room.pricePerNight);

        return (
          <Card key={room.id} shadow="sm" padding="lg" mb="md" withBorder>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
                    Sleeps {room.maxGuests}
                  </Text>

                  <Text size="md" fw={500} c={isOverCapacity ? "red" : undefined}>
                    Selected guests: {adults}
                  </Text>

                  <Text size="md" fw={500}>
                    Bed: {room.bedType}
                  </Text>

                  <Text size="md" fw={500}>
                    Size: {room.sizeSqft} sq ft
                  </Text>

                  <Text size="md" fw={500}>
                    View: {room.viewType}
                  </Text>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <Text fw={700} size="xl" c="blue">
                    Rs. {pricing.subtotal.toLocaleString()}
                  </Text>

                  <Text size="sm" c="dimmed">
                    Rs. {room.pricePerNight.toLocaleString()} / night
                    {nights > 1 ? ` x ${nights} nights` : ""}
                  </Text>

                  <Text size="sm" c="dimmed" mt={4}>
                    + Rs. {pricing.taxes.toLocaleString()} taxes & fees
                  </Text>
                </div>

                {isOverCapacity && (
                  <Text size="sm" c="red" mb="sm">
                    This room allows only {room.maxGuests} guest
                    {room.maxGuests > 1 ? "s" : ""}. Please choose another room.
                  </Text>
                )}

                <Button
                  fullWidth
                  size="md"
                  radius="md"
                  disabled={isOverCapacity}
                  onClick={() => selectRoom(room)}
                >
                  {isOverCapacity ? "Not suitable" : "Select Room"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default HotelDetails;
