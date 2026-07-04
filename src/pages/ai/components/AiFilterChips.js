import { Group, Badge } from "@mantine/core";
import { BadgeIndianRupee, MapPin, Sparkles, Star, Users, Moon } from "lucide-react";
import { formatCurrency } from "../../../utils/constants";

const AiFilterChips = ({ filters }) => {
  if (!filters) {
    return null;
  }

  const chips = [
    filters.destination && {
      key: "destination",
      label: filters.destination,
      icon: <MapPin size={14} />,
    },
    filters.nights && {
      key: "nights",
      label: `${filters.nights} night${filters.nights === 1 ? "" : "s"}`,
      icon: <Moon size={14} />,
    },
    filters.travelers && {
      key: "travelers",
      label: `${filters.travelers} guest${filters.travelers === 1 ? "" : "s"}`,
      icon: <Users size={14} />,
    },
    filters.minRating && {
      key: "rating",
      label: `${filters.minRating}+ rating`,
      icon: <Star size={14} />,
    },
    (filters.minPricePerNight || filters.maxPricePerNight) && {
      key: "price",
      label: [
        filters.minPricePerNight ? `from ${formatCurrency(filters.minPricePerNight)}` : null,
        filters.maxPricePerNight ? `up to ${formatCurrency(filters.maxPricePerNight)}` : null,
      ]
        .filter(Boolean)
        .join(" "),
      icon: <BadgeIndianRupee size={14} />,
    },
    filters.roomSelection && {
      key: "roomSelection",
      label: `${filters.roomSelection} room`,
      icon: <Sparkles size={14} />,
    },
  ].filter(Boolean);

  if (!chips.length) {
    return null;
  }

  return (
    <Group gap="xs">
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="white"
          color="orange"
          radius="xl"
          size="lg"
          leftSection={chip.icon}
          style={{
            border: "1px solid rgba(251, 146, 60, 0.2)",
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          {chip.label}
        </Badge>
      ))}
    </Group>
  );
};

export default AiFilterChips;
