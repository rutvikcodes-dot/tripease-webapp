import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getHotelById, getHotels } from "../../api/hotelApi";
import { getCities } from "../../api/cityApi";
import dayjs from "dayjs";
import {
  DEFAULT_LOCATION,
  DATE_FORMAT,
  buildHotelSearchParams,
  getFiltersFromSearchParams,
  getPositivePage,
  normalizeFilters,
} from "./components/filters/filterUtils";

const HotelContext = createContext();

const PAGE_SIZE = 10;

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const isHotelRoute = pathname.startsWith("/hotel-details/");
  const isRoomRoute = pathname.startsWith("/room/");
  const isBookingRoute = pathname.startsWith("/booking/");
  const isCheckoutRoute = pathname.startsWith("/checkout/");
  const [hotelLoading, setHotelLoading] = useState(isHotelRoute || isRoomRoute || isBookingRoute || isCheckoutRoute);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ amenities: [] });
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState(null);
  const loaderRef = useRef(null);
  const requestRef = useRef(0);

  const navigate = useNavigate();
  const searchParamsString = searchParams.toString();

  const filters = useMemo(() => {
    return getFiltersFromSearchParams(new URLSearchParams(searchParamsString));
  }, [searchParamsString]);

  const page = useMemo(() => {
    return getPositivePage(new URLSearchParams(searchParamsString).get("page"));
  }, [searchParamsString]);

  const updateHotelSearchParams = useCallback(
    ({ nextFilters = filters, nextPage = page, replace = true }) => {
      const nextParams = buildHotelSearchParams({
        filters: nextFilters,
        page: nextPage,
      });

      if (nextParams.toString() === searchParamsString) {
        return;
      }

      setSearchParams(nextParams, { replace });
    },
    [filters, page, searchParamsString, setSearchParams],
  );

  const setFilters = useCallback(
    (nextFilters) => {
      const resolvedFilters = typeof nextFilters === "function" ? nextFilters(filters) : nextFilters;

      updateHotelSearchParams({
        nextFilters: normalizeFilters(resolvedFilters),
        nextPage: 1,
        replace: true,
      });
    },
    [filters, updateHotelSearchParams],
  );

  const setPage = useCallback(
    (nextPage) => {
      const resolvedPage = typeof nextPage === "function" ? nextPage(page) : nextPage;

      updateHotelSearchParams({
        nextPage: getPositivePage(resolvedPage),
        replace: true,
      });
    },
    [page, updateHotelSearchParams],
  );

  const location = filters.search || DEFAULT_LOCATION;
  const checkIn = useMemo(() => dayjs(filters.checkIn).toDate(), [filters.checkIn]);
  const checkOut = useMemo(() => dayjs(filters.checkOut).toDate(), [filters.checkOut]);
  const adults = filters.adults;

  const setLocation = useCallback(
    (nextLocation) => {
      setFilters((prev) => ({
        ...prev,
        search: nextLocation || DEFAULT_LOCATION,
      }));
    },
    [setFilters],
  );

  const setCheckIn = useCallback(
    (nextCheckIn) => {
      if (!nextCheckIn) return;

      setFilters((prev) => {
        const nextCheckInDate = dayjs(nextCheckIn).format(DATE_FORMAT);
        const nextCheckOutDate = dayjs(prev.checkOut).isAfter(dayjs(nextCheckInDate))
          ? prev.checkOut
          : dayjs(nextCheckInDate).add(1, "day").format(DATE_FORMAT);

        return {
          ...prev,
          checkIn: nextCheckInDate,
          checkOut: nextCheckOutDate,
        };
      });
    },
    [setFilters],
  );

  const setCheckOut = useCallback(
    (nextCheckOut) => {
      if (!nextCheckOut) return;

      setFilters((prev) => ({
        ...prev,
        checkOut: dayjs(nextCheckOut).format(DATE_FORMAT),
      }));
    },
    [setFilters],
  );

  const setAdults = useCallback(
    (nextAdults) => {
      const resolvedAdults = Number(nextAdults);
      setFilters((prev) => ({
        ...prev,
        adults: Number.isFinite(resolvedAdults) && resolvedAdults > 0 ? resolvedAdults : prev.adults,
      }));
    },
    [setFilters],
  );

  const handleSearch = useCallback(() => {
    const nextFilters = normalizeFilters(filters);
    const nextSearch = buildHotelSearchParams({
      filters: nextFilters,
      page: 1,
    }).toString();

    navigate({
      pathname: "/hotels",
      search: nextSearch ? `?${nextSearch}` : "",
    });
  }, [filters, navigate]);

  const goToHotelDetails = useCallback(
    (hotelId) => {
      navigate({
        pathname: `/hotel-details/${hotelId}`,
        search: searchParamsString ? `?${searchParamsString}` : "",
      });
    },
    [navigate, searchParamsString],
  );

  const TAX_RATE = 0.12;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;

    const diff = dayjs(checkOut).diff(dayjs(checkIn), "day");

    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const getRoomPricing = useCallback(
    (pricePerNight) => {
      const subtotal = pricePerNight * nights;
      const taxes = Math.round(subtotal * TAX_RATE);
      const total = subtotal + taxes;
      return { subtotal, taxes, total };
    },
    [nights],
  );

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCities();

        setCities(response.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    const fetchRouteData = async () => {
      if (pathname === "/hotels") {
        try {
          setSelectedHotel(null);
          setHotelLoading(false);
          setListLoading(true);

          const payload = {
            ...filters,
            page,
            limit: PAGE_SIZE,
          };

          if (filters.amenities.length === 1) {
            payload.amenities = filters.amenities[0];
          }

          const response = await getHotels(payload);

          if (requestRef.current !== requestId) return;

          const newHotels = response.data?.data || [];
          const nextPagination = response.data?.pagination || null;

          setHotels((prev) => {
            if (page === 1) {
              return newHotels;
            }

            return [...prev, ...newHotels];
          });
          setPagination(nextPagination);
          setHasMore(Boolean(nextPagination?.page < nextPagination?.totalPages));
          setFilterOptions({
            amenities: response.data?.filters?.amenities || [],
          });
        } catch (error) {
          if (requestRef.current !== requestId) return;

          console.error(error);

          if (page === 1) {
            setHotels([]);
          }

          setHasMore(false);
        } finally {
          if (requestRef.current === requestId) {
            setListLoading(false);
          }
        }

        return;
      }

      if (pathname.startsWith("/hotel-details/")) {
        const hotelId = pathname.split("/")[2];

        if (!hotelId) return;

        try {
          setListLoading(false);
          setHotelLoading(true);

          const response = await getHotelById(hotelId);

          if (requestRef.current !== requestId) return;

          setSelectedHotel(response.data?.data || null);
        } catch (error) {
          if (requestRef.current !== requestId) return;

          console.error(error);
          setSelectedHotel(null);
        } finally {
          if (requestRef.current === requestId) {
            setHotelLoading(false);
          }
        }

        return;
      }

      if (isRoomRoute || isBookingRoute || isCheckoutRoute) {
        const hotelId = pathname.split("/")[2];

        if (!hotelId) {
          setHotelLoading(false);
          return;
        }

        try {
          setListLoading(false);
          setHotelLoading(true);

          const response = await getHotelById(hotelId);

          if (requestRef.current !== requestId) return;

          setSelectedHotel(response.data?.data || null);
        } catch (error) {
          if (requestRef.current !== requestId) return;

          console.error(error);
          setSelectedHotel(null);
        } finally {
          if (requestRef.current === requestId) {
            setHotelLoading(false);
          }
        }

        return;
      }

      setListLoading(false);
      setHotelLoading(false);
    };

    fetchRouteData();
  }, [pathname, filters, page, searchParamsString, isRoomRoute, isBookingRoute, isCheckoutRoute]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && hasMore && !listLoading && pathname === "/hotels") {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, listLoading, pathname, setPage]);

  const value = useMemo(
    () => ({
      hotels,
      selectedHotel,

      cities,

      listLoading,
      hotelLoading,
      loading: listLoading,

      filters,
      setFilters,

      filterOptions,

      location,
      setLocation,

      checkIn,
      setCheckIn,

      checkOut,
      setCheckOut,

      adults,
      setAdults,

      handleSearch,
      goToHotelDetails,

      page,
      setPage,
      pagination,
      setPagination,
      loaderRef,
      hasMore,
      nights,
      getRoomPricing,
    }),
    [
      hotels,
      selectedHotel,
      cities,
      listLoading,
      hotelLoading,
      filters,
      setFilters,
      filterOptions,
      location,
      setLocation,
      checkIn,
      setCheckIn,
      checkOut,
      setCheckOut,
      adults,
      setAdults,
      handleSearch,
      goToHotelDetails,
      page,
      setPage,
      pagination,
      hasMore,
      nights,
      getRoomPricing,
    ],
  );

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
};

export const useHotel = () => useContext(HotelContext);
