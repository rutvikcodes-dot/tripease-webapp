import dayjs from "dayjs";
export const DEFAULT_LOCATION = "Mumbai";
export const DATE_FORMAT = "YYYY-MM-DD";

const getDefaultCheckIn = () => dayjs().format(DATE_FORMAT);
const getDefaultCheckOut = (checkIn = getDefaultCheckIn()) => dayjs(checkIn).add(1, "day").format(DATE_FORMAT);

const normalizeDate = (value, fallback) => {
  const date = dayjs(value);
  return date.isValid() ? date.format(DATE_FORMAT) : fallback;
};

export const DEFAULT_FILTERS = {
  search: DEFAULT_LOCATION,
  checkIn: getDefaultCheckIn(),
  checkOut: getDefaultCheckOut(),
  adults: 2,
  minRating: "",
  minPrice: 0,
  maxPrice: 20000,
  amenities: [],
  sortBy: "",
};

export const getPositivePage = (value) => {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? page : 1;
};

export const normalizeFilters = (filters = {}) => {
  const checkIn = normalizeDate(filters.checkIn, getDefaultCheckIn());
  const checkOut = normalizeDate(filters.checkOut, getDefaultCheckOut(checkIn));
  const resolvedCheckOut = dayjs(checkOut).isAfter(dayjs(checkIn)) ? checkOut : getDefaultCheckOut(checkIn);
  const adults = Number(filters.adults ?? DEFAULT_FILTERS.adults);

  return {
    search: filters.search || DEFAULT_LOCATION,
    checkIn,
    checkOut: resolvedCheckOut,
    adults: Number.isFinite(adults) && adults > 0 ? adults : DEFAULT_FILTERS.adults,
    minRating: filters.minRating || "",
    minPrice: Number(filters.minPrice ?? DEFAULT_FILTERS.minPrice),
    maxPrice: Number(filters.maxPrice ?? DEFAULT_FILTERS.maxPrice),
    amenities: Array.isArray(filters.amenities) ? filters.amenities.filter(Boolean) : [],
    sortBy: filters.sortBy || DEFAULT_FILTERS.sortBy,
  };
};

export const getFiltersFromSearchParams = (searchParams) =>
  normalizeFilters({
    search: searchParams.get("search"),
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
    adults: searchParams.get("adults"),
    minRating: searchParams.get("minRating"),
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    amenities: searchParams.getAll("amenities"),
    sortBy: searchParams.get("sortBy"),
  });

export const buildHotelSearchParams = ({ filters, page = 1 }) => {
  const normalizedFilters = normalizeFilters(filters);
  const params = new URLSearchParams();

  if (normalizedFilters.search) {
    params.set("search", normalizedFilters.search);
  }

  if (normalizedFilters.checkIn) {
    params.set("checkIn", normalizedFilters.checkIn);
  }

  if (normalizedFilters.checkOut) {
    params.set("checkOut", normalizedFilters.checkOut);
  }

  if (normalizedFilters.adults) {
    params.set("adults", String(normalizedFilters.adults));
  }

  if (normalizedFilters.minRating) {
    params.set("minRating", normalizedFilters.minRating);
  }

  if (normalizedFilters.minPrice !== DEFAULT_FILTERS.minPrice) {
    params.set("minPrice", String(normalizedFilters.minPrice));
  }

  if (normalizedFilters.maxPrice !== DEFAULT_FILTERS.maxPrice) {
    params.set("maxPrice", String(normalizedFilters.maxPrice));
  }

  if (normalizedFilters.sortBy) {
    params.set("sortBy", normalizedFilters.sortBy);
  }

  normalizedFilters.amenities.forEach((amenity) => {
    params.append("amenities", amenity);
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  return params;
};
