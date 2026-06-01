import { Card, Image, Text, Group, Badge, Title, Button, Stack } from "@mantine/core";
import {
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Utensils,
  Plane,
  PawPrint,
  Mountain,
  Wine,
  Briefcase,
  Snowflake,
  BedDouble,
  Coffee,
  ShieldCheck,
  Star,
} from "lucide-react";

const HotelCard = ({ hotel, goToHotelDetails, nights }) => {
  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    return "Average";
  };

  const amenityIcons = {
    "Free Wifi": <Wifi size={14} />,
    "Swimming Pool": <Waves size={14} />,
    Parking: <Car size={14} />,
    "Breakfast Included": <Coffee size={14} />,
    Gym: <Dumbbell size={14} />,
    Spa: <ShieldCheck size={14} />,
    "Air Conditioning": <Snowflake size={14} />,
    Restaurant: <Utensils size={14} />,
    "Room Service": <BedDouble size={14} />,
    "Airport Shuttle": <Plane size={14} />,
    "Pet Friendly": <PawPrint size={14} />,
    "Beach Access": <Waves size={14} />,
    "Mountain View": <Mountain size={14} />,
    Bar: <Wine size={14} />,
    "Work Desk": <Briefcase size={14} />,
  };

  return (
    <Card
      shadow="sm"
      radius="lg"
      withBorder
      padding={0}
      mb="lg"
      onClick={() => goToHotelDetails(hotel.id)}
      style={{
        cursor: "pointer",
        overflow: "hidden",
        transition: "0.2s ease",
      }}
    >
      <Group align="stretch" gap={0} wrap="nowrap">
        {/* LEFT IMAGE */}
        <Image
          src={hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
          w={320}
          h={250}
          fit="cover"
          alt={hotel?.name}
        />

        {/* CENTER CONTENT */}
        <Stack justify="space-between" p="lg" flex={1} gap="xs">
          <div>
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={3}>{hotel?.name}</Title>

                <Text size="sm" c="dimmed" mt={4}>
                  📍 {hotel?.city?.name}
                </Text>
              </div>

              <Badge color="green" size="lg" radius="sm" variant="light">
                ⭐ {hotel?.rating}
              </Badge>
            </Group>

            <Text mt="md" size="sm" c="dimmed" lineClamp={2}>
              {hotel?.address}
            </Text>

            {/* AMENITIES */}
            <Group mt="lg" gap="sm">
              {hotel?.amenities?.map((amenity) => (
                <Badge key={amenity} variant="light" radius="md" leftSection={amenityIcons[amenity]}>
                  {amenity}
                </Badge>
              ))}
            </Group>
          </div>
        </Stack>

        {/* RIGHT SIDE */}
        <Stack justify="space-between" align="flex-end" p="lg" w={220} bg="#f8f9fa">
          <div style={{ textAlign: "right" }}>
            <Group justify="flex-end" gap={4}>
              <Star size={16} fill="#FAB005" color="#FAB005" />

              <Text fw={700}> {getRatingLabel(hotel?.rating)}</Text>
            </Group>

            <Text size="sm" c="dimmed">
              {hotel?.reviewsCount || 0} reviews
            </Text>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {nights > 1 ? (
              <>
                <Text fw={700} size="xl" c="blue">
                  ₹{(hotel.minPrice * nights).toLocaleString()}
                </Text>

                <Text size="sm" c="dimmed" fw={500}>
                  ₹{hotel.minPrice.toLocaleString()} / night
                </Text>
              </>
            ) : (
              <Text fw={700} size="xl" c="blue">
                ₹{hotel.minPrice.toLocaleString()}
              </Text>
            )}
          </div>

          <Button radius="md" size="md" fullWidth>
            View Details
          </Button>
        </Stack>
      </Group>
    </Card>
  );
};

export default HotelCard;
