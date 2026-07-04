import { ActionIcon, Box, Burger, Button, Collapse, Divider, Group, NumberInput, Paper, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import { Bot, CalendarDays, LogOut, Luggage, MapPin, Search, UserRound, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/provider";
import { useHotel } from "../hotels/provider";
import AuthPopover from "../auth";
import { BRAND_NAME } from "../../utils/constants";

function SearchControls({ stacked = false, onSearch }) {
  const { cities, location, setLocation, checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults, handleSearch } =
    useHotel();

  const cityOptions = cities.map((city) => ({
    value: city.name,
    label: city.name,
  }));

  if (location && !cityOptions.some((city) => city.value === location)) {
    cityOptions.unshift({ value: location, label: location });
  }

  const searchHotels = () => {
    handleSearch();
    onSearch?.();
  };

  return (
    <Paper
      radius="md"
      px="sm"
      py={8}
      withBorder
      style={{
        flex: 1,
        maxWidth: stacked ? "100%" : 760,
        backgroundColor: "#ffffff",
      }}
    >
      <Group gap={8} align="end" wrap={stacked ? "wrap" : "nowrap"}>
        <Select
          label="Where"
          leftSection={<MapPin size={16} />}
          placeholder="City"
          data={cityOptions}
          value={location}
          onChange={(value) => setLocation(value || location)}
          searchable
          clearable={false}
          radius="md"
          w={stacked ? "100%" : 190}
          styles={{
            label: { fontSize: 12 },
            input: { fontWeight: 600 },
          }}
        />

        <DatePickerInput
          label="Check-in"
          leftSection={<CalendarDays size={16} />}
          value={checkIn}
          onChange={setCheckIn}
          minDate={new Date()}
          radius="md"
          w={stacked ? "calc(50% - 4px)" : 150}
        />

        <DatePickerInput
          label="Check-out"
          leftSection={<CalendarDays size={16} />}
          value={checkOut}
          onChange={setCheckOut}
          minDate={checkIn ? dayjs(checkIn).add(1, "day").toDate() : new Date()}
          radius="md"
          w={stacked ? "calc(50% - 4px)" : 150}
        />

        <NumberInput
          label="Guests"
          leftSection={<Users size={16} />}
          min={1}
          value={adults}
          onChange={setAdults}
          radius="md"
          w={stacked ? "calc(50% - 4px)" : 110}
        />

        <Button
          leftSection={<Search size={16} />}
          onClick={searchHotels}
          radius="md"
          w={stacked ? "calc(50% - 4px)" : 120}
        >
          Search
        </Button>
      </Group>
    </Paper>
  );
}

export default function Navbar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 860px)");
  const { pathname } = useLocation();
  const { user, logout, goToLanding } = useAuth();
  const showSearch = pathname !== "/" && pathname !== "/ai-search";

  return (
    <Box
      component="header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e9ecef",
      }}
    >
      <Group justify="space-between" px="md" py="sm" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <img
            src="/favicon.png"
            alt={BRAND_NAME}
            width={36}
            height={36}
            style={{ borderRadius: 8, cursor: "pointer" }}
            onClick={goToLanding}
          />
          <Text fw={800} size="lg" style={{ userSelect: "none", cursor: "pointer" }} onClick={goToLanding}>
            {BRAND_NAME}
          </Text>
        </Group>

        {showSearch && !isMobile && <SearchControls />}

        <Group gap="sm" wrap="nowrap">
          <Button component={Link} to="/ai-search" variant="light" leftSection={<Bot size={16} />} visibleFrom="sm">
            AI Search
          </Button>
          <ActionIcon component={Link} to="/ai-search" aria-label="AI search" variant="light" size="lg" hiddenFrom="sm">
            <Bot size={18} />
          </ActionIcon>

          {!user ? (
            <AuthPopover />
          ) : (
            <>
              <Button
                component={Link}
                to="/my-bookings"
                variant="light"
                leftSection={<Luggage size={16} />}
                visibleFrom="sm"
              >
                My bookings
              </Button>
              <ActionIcon
                component={Link}
                to="/my-bookings"
                aria-label="My bookings"
                variant="light"
                size="lg"
                hiddenFrom="sm"
              >
                <Luggage size={18} />
              </ActionIcon>
              <Group gap={6} visibleFrom="sm" wrap="nowrap">
                <UserRound size={16} />
                <Text size="sm" fw={600}>
                  {user.username}
                </Text>
              </Group>
              <Button color="red" variant="light" leftSection={<LogOut size={16} />} onClick={logout}>
                Logout
              </Button>
            </>
          )}

          {showSearch && isMobile && <Burger opened={opened} onClick={toggle} aria-label="Toggle search" size="sm" />}
        </Group>
      </Group>

      {showSearch && isMobile && (
        <Collapse in={opened}>
          <Divider />
          <Box p="md">
            <SearchControls stacked onSearch={close} />
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
