import { useEffect } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import {
  BedDouble,
  CalendarDays,
  CreditCard,
  Hotel,
  Luggage,
  MapPin,
  ReceiptText,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../auth/provider";
import { useBooking } from "./provider";
import { BRAND_NAME, formatCurrency } from "../../utils/constants";

const formatDate = (value) => {
  return value ? dayjs(value).format("DD MMM YYYY") : "Not available";
};

const getNights = (checkInDate, checkOutDate) => {
  const nights = dayjs(checkOutDate).diff(dayjs(checkInDate), "day");
  return nights > 0 ? nights : 1;
};

function DetailItem({ icon, label, value }) {
  return (
    <Group gap="sm" wrap="nowrap" align="flex-start">
      <ThemeIcon variant="light" color="teal" radius="md" size={36}>
        {icon}
      </ThemeIcon>
      <Box>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {label}
        </Text>
        <Text size="sm" fw={600}>
          {value}
        </Text>
      </Box>
    </Group>
  );
}

function BookingCard({ booking }) {
  const room = booking.room;
  const hotel = room?.hotel;
  const nights = getNights(booking.checkInDate, booking.checkOutDate);
  const statusColor =
    booking.status === "confirmed"
      ? "green"
      : booking.status === "cancelled"
        ? "red"
        : "yellow";

  return (
    <Card withBorder radius="md" p={0} style={{ overflow: "hidden" }}>
      <Grid gutter={0}>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Image
            src={hotel?.image}
            alt={hotel?.name || "Hotel"}
            h="100%"
            mah={{ base: 220, md: "100%" }}
            mih={{ md: 280 }}
            fit="cover"
            fallbackSrc="/favicon.png"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md" p={{ base: "md", sm: "xl" }}>
            <Group justify="space-between" align="flex-start" gap="md">
              <Box>
                <Group gap="xs" mb={4}>
                  <ThemeIcon variant="light" color="blue" size={32} radius="md">
                    <Hotel size={18} />
                  </ThemeIcon>
                  <Title order={3}>{hotel?.name || "Hotel booking"}</Title>
                </Group>

                <Group gap={6} c="dimmed" wrap="nowrap">
                  <MapPin size={15} />
                  <Text size="sm">{hotel?.address || "Address not available"}</Text>
                </Group>
              </Box>

              <Badge color={statusColor} variant="light" size="lg">
                {booking.status}
              </Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DetailItem
                icon={<CalendarDays size={18} />}
                label="Check-in"
                value={formatDate(booking.checkInDate)}
              />
              <DetailItem
                icon={<CalendarDays size={18} />}
                label="Check-out"
                value={formatDate(booking.checkOutDate)}
              />
              <DetailItem
                icon={<BedDouble size={18} />}
                label="Room"
                value={room?.type || "Room"}
              />
              <DetailItem
                icon={<Users size={18} />}
                label="Guests"
                value={`${booking.guests} guest${booking.guests > 1 ? "s" : ""}`}
              />
            </SimpleGrid>

            <Divider />

            <Group justify="space-between" align="flex-end" gap="lg">
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Booking ID #{booking.id}
                </Text>
                <Text fw={700} size="xl">
                  {formatCurrency(booking.totalPrice)}
                </Text>
                <Text size="sm" c="dimmed">
                  {nights} night{nights > 1 ? "s" : ""} stay, including taxes
                </Text>
              </Stack>

              <Stack gap={4} align="flex-end">
                <Group gap={6}>
                  <ReceiptText size={16} />
                  <Text size="sm" fw={600}>
                    {booking.guestName}
                  </Text>
                </Group>
                <Group gap={6}>
                  <CreditCard size={16} />
                  <Text size="sm" c="dimmed">
                    {booking.paymentId || "Payment not available"}
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const {
    sortedMyBookings,
    myBookingsLoading,
    myBookingsError,
    fetchMyBookings,
    resetMyBookings,
  } = useBooking();

  useEffect(() => {
    if (!user) {
      resetMyBookings();
      return;
    }

    fetchMyBookings();
  }, [fetchMyBookings, resetMyBookings, user]);

  if (authLoading) {
    return (
      <Stack align="center" justify="center" py={100}>
        <Loader />
      </Stack>
    );
  }

  if (!user) {
    return (
      <Container size="sm" py={90}>
        <Paper withBorder radius="md" p="xl">
          <Stack align="center" ta="center" gap="md">
            <ThemeIcon color="blue" variant="light" size={72} radius="xl">
              <Luggage size={36} />
            </ThemeIcon>
            <Title order={2}>Login to see your trips</Title>
            <Text c="dimmed">
              Your confirmed stays will appear here after you sign in.
            </Text>
            <Button component={Link} to="/" radius="md">
              Back to {BRAND_NAME}
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <Box>
            <Text c="teal" fw={700} size="sm" tt="uppercase">
              Your travel desk
            </Text>
            <Title order={1}>My Bookings</Title>
            <Text c="dimmed" mt={4}>
              Review upcoming stays, guest details, and payment references.
            </Text>
          </Box>

          <Button component={Link} to="/hotels" variant="light" radius="md">
            Book another stay
          </Button>
        </Group>

        {myBookingsLoading && (
          <Stack align="center" py={80}>
            <Loader />
          </Stack>
        )}

        {!myBookingsLoading && myBookingsError && (
          <Paper withBorder radius="md" p="xl">
            <Text c="red" fw={600}>
              {myBookingsError}
            </Text>
          </Paper>
        )}

        {!myBookingsLoading && !myBookingsError && sortedMyBookings.length === 0 && (
          <Paper withBorder radius="md" p="xl">
            <Stack align="center" ta="center" gap="md">
              <ThemeIcon color="teal" variant="light" size={72} radius="xl">
                <Luggage size={36} />
              </ThemeIcon>
              <Title order={2}>No bookings yet</Title>
              <Text c="dimmed">
                Once you confirm a stay, your itinerary will be saved here.
              </Text>
              <Button component={Link} to="/hotels" radius="md">
                Explore hotels
              </Button>
            </Stack>
          </Paper>
        )}

        {!myBookingsLoading && !myBookingsError && sortedMyBookings.length > 0 && (
          <Stack gap="lg">
            {sortedMyBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
