import {
  Badge,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import {
  CalendarDays,
  MapPin,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useHotel } from "../hotels/provider";
import { BRAND_NAME } from "../../utils/constants";

const LANDING_HIGHLIGHTS = [
  {
    icon: <Route size={18} />,
    title: "Smooth planning",
    description: "Compare stays, dates, and guest needs in one place.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Secure booking",
    description: "Book with confidence and keep your trip details ready.",
  },
  {
    icon: <Sparkles size={18} />,
    title: "Curated picks",
    description: "Find stays that feel right for your next escape.",
  },
];

const Landing = () => {
  const {
    cities,
    location,
    setLocation,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    adults,
    setAdults,
    handleSearch,
  } = useHotel();

  const cityOptions = cities.map((city) => ({
    value: city.name,
    label: city.name,
  }));

  if (location && !cityOptions.some((city) => city.value === location)) {
    cityOptions.unshift({ value: location, label: location });
  }

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        backgroundImage:
          "linear-gradient(115deg, rgba(6, 20, 38, 0.86), rgba(14, 116, 144, 0.56), rgba(244, 114, 182, 0.34)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <style>
        {`
          @keyframes tripEaseShine {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .trip-ease-highlight {
            transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
          }

          .trip-ease-highlight svg {
            transition: transform 180ms ease;
          }

          .trip-ease-highlight:hover {
            transform: translateY(-8px);
            background-color: rgba(255, 255, 255, 0.22);
            border-color: rgba(103, 232, 249, 0.72);
            box-shadow: 0 18px 42px rgba(34, 211, 238, 0.2);
          }

          .trip-ease-highlight:hover svg {
            transform: rotate(-8deg) scale(1.12);
          }
        `}
      </style>

      <Container size="xl" w="100%" py={{ base: "xl", md: 48 }}>
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg" maw={620}>
              <Group gap="xs">
                <Badge
                  leftSection={<Star size={13} />}
                  variant="white"
                  color="dark"
                >
                  Curated stays
                </Badge>
                <Badge leftSection={<ShieldCheck size={13} />} color="teal">
                  Flexible planning
                </Badge>
                <Badge leftSection={<Sparkles size={13} />} color="pink">
                  Fresh escapes
                </Badge>
              </Group>

              <Title
                order={1}
                c="white"
                style={{
                  fontSize: "clamp(42px, 6vw, 78px)",
                  lineHeight: 1,
                  letterSpacing: 0,
                }}
              >
                Travel beyond your{" "}
                <span
                  style={{
                    color: "#67e8f9",
                    textShadow: "0 0 24px rgba(34, 211, 238, 0.55)",
                  }}
                >
                  booking.
                </span>
              </Title>

              <Text c="gray.1" size="xl" maw={520}>
                Find beautiful stays, compare dates, and start your next trip
                with a cleaner booking experience.
              </Text>

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                {LANDING_HIGHLIGHTS.map((item) => (
                  <Paper
                    key={item.title}
                    className="trip-ease-highlight"
                    radius="md"
                    p="md"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      border: "1px solid rgba(255, 255, 255, 0.24)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Stack gap={6}>
                      <ThemeIcon
                        variant="white"
                        color="dark"
                        radius="md"
                        size="md"
                      >
                        {item.icon}
                      </ThemeIcon>
                      <Text c="white" fw={800} size="sm">
                        {item.title}
                      </Text>
                      <Text c="gray.2" size="xs">
                        {item.description}
                      </Text>
                    </Stack>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              shadow="xl"
              radius="lg"
              p={{ base: "md", md: "xl" }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                border: "1px solid rgba(255, 255, 255, 0.72)",
                boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text fw={800} size="xl">
                      Find a hotel
                    </Text>
                    <Text c="dimmed" size="sm">
                      Choose your destination and travel dates.
                    </Text>
                  </div>
                  <Badge
                    variant="gradient"
                    gradient={{ from: "teal", to: "pink", deg: 90 }}
                  >
                    Best matches
                  </Badge>
                </Group>

                <Select
                  label="Where are you going?"
                  leftSection={<MapPin size={17} />}
                  placeholder="Select city"
                  data={cityOptions}
                  value={location}
                  onChange={(value) => setLocation(value || location)}
                  searchable
                  clearable={false}
                  size="md"
                  radius="md"
                />

                <Grid gutter="sm">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <DatePickerInput
                      label="Check-in"
                      leftSection={<CalendarDays size={17} />}
                      value={checkIn}
                      onChange={setCheckIn}
                      minDate={new Date()}
                      size="md"
                      radius="md"
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <DatePickerInput
                      label="Check-out"
                      leftSection={<CalendarDays size={17} />}
                      value={checkOut}
                      onChange={setCheckOut}
                      minDate={
                        checkIn
                          ? dayjs(checkIn).add(1, "day").toDate()
                          : new Date()
                      }
                      size="md"
                      radius="md"
                    />
                  </Grid.Col>
                </Grid>

                <NumberInput
                  label="Adults"
                  leftSection={<Users size={17} />}
                  min={1}
                  value={adults}
                  onChange={setAdults}
                  size="md"
                  radius="md"
                />

                <Button
                  size="lg"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "cyan", to: "violet", deg: 90 }}
                  leftSection={<Search size={18} />}
                  onClick={handleSearch}
                  fullWidth
                  style={{
                    backgroundSize: "220% 220%",
                    animation: "tripEaseShine 5s ease infinite",
                  }}
                >
                  Search hotels
                </Button>

                <Divider />

                <Group justify="space-between" gap="sm">
                  <Text size="sm" c="dimmed">
                    Built for simple, quick hotel discovery.
                  </Text>
                  <Badge color="cyan" variant="light">
                    {BRAND_NAME}
                  </Badge>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default Landing;
