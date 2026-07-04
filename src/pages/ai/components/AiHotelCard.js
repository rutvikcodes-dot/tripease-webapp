import { Badge, Button, Card, Group, Image, Stack, Text, Title } from "@mantine/core";
import { BedDouble, MapPin, Star } from "lucide-react";

const AiHotelCard = ({ card, compact = false }) => {
  return (
    <Card
      radius={20}
      p={0}
      onClick={card.onSelectHotel}
      style={{
        cursor: "pointer",
        overflow: "hidden",
        height: "100%",
        border: "1px solid rgba(255, 255, 255, 0.78)",
        background: "rgba(255, 255, 255, 0.92)",
        boxShadow: "0 18px 44px rgba(15, 23, 42, 0.1)",
      }}
    >
      <div style={{ position: "relative" }}>
        <Image src={card.image} height={compact ? 158 : 205} fit="cover" alt={card.name} />
        <Badge
          color="yellow"
          variant="filled"
          radius="xl"
          leftSection={<Star size={13} fill="#ffffff" color="#ffffff" />}
          style={{
            position: "absolute",
            right: 14,
            top: 14,
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.16)",
          }}
        >
          {card.rating}
        </Badge>
      </div>

      <Stack p={{ base: "md", md: 18 }} gap="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Title order={compact ? 4 : 3} lineClamp={1} style={{ color: "#111827", fontWeight: 900 }}>
              {card.name}
            </Title>
            <Group gap={5} mt={5} c="dimmed">
              <MapPin size={14} color="#f97316" />
              <Text size="sm" c="dimmed">
                {card.city}
              </Text>
            </Group>
          </div>
        </Group>

        <Group gap="xs">
          <Badge variant="light" color="orange" leftSection={<BedDouble size={14} />} radius="xl">
            {card.roomType}
          </Badge>
          {card.maxGuests && (
            <Badge variant="light" color="teal" radius="xl">
              {card.maxGuests} guests
            </Badge>
          )}
        </Group>

        <Group justify="space-between" align="end" mt="xs">
          <div>
            <Text fw={950} size={compact ? "lg" : "xl"} c="orange">
              {card.totalHotelCostLabel}
            </Text>
            <Text size="sm" c="dimmed">
              {card.pricePerNightLabel}
            </Text>
          </div>

          <Button
            size="sm"
            radius="xl"
            variant="gradient"
            gradient={{ from: "orange", to: "pink", deg: 120 }}
            onClick={card.onSelectRoom}
            style={{ boxShadow: "0 12px 22px rgba(219, 39, 119, 0.16)" }}
          >
            View room
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default AiHotelCard;
