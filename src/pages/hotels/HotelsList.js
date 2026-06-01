import { Container, Grid, Text, Stack, Title, Center } from "@mantine/core";
import { useHotel } from "./provider";
import HotelCard from "./components/HotelCard";
import HotelFilters from "./components/filters/HotelFilters";

const HotelsList = () => {
  const { hotels, goToHotelDetails, loaderRef, listLoading, filters, nights } = useHotel();

  return (
    <Container size="xl" py="xl">
      <Grid>
        {/* FILTERS */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <HotelFilters />
        </Grid.Col>

        {/* HOTELS */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          {!hotels?.length ? (
            <Stack align="center" py={100}>
              <Title order={2}>No Hotels Found</Title>

              <Text c="dimmed">No hotels matched your search or filters.</Text>

              <Text size="sm" c="dimmed">
                Try changing city, price, rating, or amenities.
              </Text>
            </Stack>
          ) : (
            <Grid>
              {hotels?.map((hotel) => (
                <Grid.Col key={hotel.id} span={12}>
                  <HotelCard hotel={hotel} goToHotelDetails={goToHotelDetails} filters={filters} nights={nights} />
                </Grid.Col>
              ))}
            </Grid>
          )}
          <Center mt="xl">
            <div
              ref={loaderRef}
              style={{
                height: 40,
              }}
            />
            {listLoading && (
              <Text ta="center" mt="lg">
                Loading more hotels...
              </Text>
            )}
          </Center>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default HotelsList;
