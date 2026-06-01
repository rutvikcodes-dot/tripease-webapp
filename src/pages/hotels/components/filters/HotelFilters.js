import {
  Paper,
  Stack,
  Title,
  Select,
  RangeSlider,
  Text,
  Checkbox,
  Divider,
} from "@mantine/core";

import { useHotel } from "../../provider";

const HotelFilters = () => {
  const {
    filters,
    setFilters,
    filterOptions,
    cities,
  } = useHotel();

  return (
    <Paper
      p="lg"
      radius="lg"
      withBorder
      shadow="xs"
    >
      <Stack gap="lg">

        <Title order={3}>
          Filters
        </Title>

        <Divider />

        {/* CITY */}
        <Select
          label="City"
          placeholder="Select city"
          data={cities.map((city) => ({
            value: city.name,
            label: city.name,
          }))}
          value={filters.search}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              search: value,
            }))
          }
        />

        {/* PRICE */}
        <div>
          <Text fw={500} mb="sm">
            Price Range
          </Text>

          <RangeSlider
            min={0}
            max={20000}
            step={500}
            value={[
              Number(filters.minPrice),
              Number(filters.maxPrice),
            ]}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                minPrice: value[0],
                maxPrice: value[1],
              }))
            }
          />

          <Text size="sm" mt="xs" c="dimmed">
            ₹{filters.minPrice} - ₹{filters.maxPrice}
          </Text>
        </div>

        <Select
          label="Sort By"
          placeholder="Select sorting"
          data={[
            {
              value: "priceLowToHigh",
              label: "Price: Low to High",
            },
            {
              value: "priceHighToLow",
              label: "Price: High to Low",
            },
            {
              value: "ratingHighToLow",
              label: "Rating: High to Low",
            },
          ]}
          value={filters.sortBy}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: value || "",
            }))
          }
        />

        {/* RATING */}
        <Select
          label="Minimum Rating"
          placeholder="Choose rating"
          data={[
            {
              value: "3",
              label: "3+ Stars",
            },
            {
              value: "4",
              label: "4+ Stars",
            },
            {
              value: "4.5",
              label: "4.5+ Stars",
            },
          ]}
          value={filters.minRating}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              minRating: value,
            }))
          }
        />

        {/* AMENITIES */}
        <div>
          <Text fw={500} mb="sm">
            Amenities
          </Text>

          <Stack gap={6}>
            {(filterOptions?.amenities || []).map(
              (amenity) => (
                <Checkbox
                  key={amenity}
                  label={amenity}
                  checked={filters.amenities.includes(
                    amenity
                  )}
                  onChange={(event) => {
                    if (
                      event.currentTarget.checked
                    ) {
                      setFilters((prev) => ({
                        ...prev,
                        amenities: [...prev.amenities, amenity],
                      }));
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        amenities:
                          prev.amenities.filter(
                            (item) =>
                              item !== amenity
                          ),
                      }));
                    }
                  }}
                />
              )
            )}
          </Stack>
        </div>

      </Stack>
    </Paper>
  );
};

export default HotelFilters;