import { Badge, Button, Container, Grid, Group, NumberInput, Paper, Select, Stack, Text, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { CalendarDays, MapPin, Search, ShieldCheck, Star, Users } from "lucide-react";
import { useHotel } from "../hotels/provider";

const Landing = () => {
  const { cities, location, setLocation, checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults, handleSearch } =
    useHotel();

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
          "linear-gradient(90deg, rgba(10, 23, 42, 0.82), rgba(10, 23, 42, 0.34)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container size="xl" w="100%" py={{ base: "xl", md: 48 }}>
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg" maw={620}>
              <Group gap="xs">
                <Badge leftSection={<Star size={13} />} variant="white" color="dark">
                  Curated stays
                </Badge>
                <Badge leftSection={<ShieldCheck size={13} />} variant="white" color="dark">
                  Flexible planning
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
                Travel beyond the booking.
              </Title>

              <Text c="gray.2" size="xl" maw={520}>
                Compare hotels, dates, and prices in one smooth search.
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              shadow="xl"
              radius="lg"
              p={{ base: "md", md: "xl" }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.97)",
                border: "1px solid rgba(255, 255, 255, 0.55)",
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
                  <Badge variant="light">Best matches</Badge>
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
                      minDate={checkIn ? dayjs(checkIn).add(1, "day").toDate() : new Date()}
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

                <Button size="lg" radius="md" leftSection={<Search size={18} />} onClick={handleSearch} fullWidth>
                  Search hotels
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default Landing;
