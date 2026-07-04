import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { createTripPlan } from "../../api/aiApi";
import { AI_CONSTANTS, DEFAULT_HOTEL_IMAGE, formatCurrency } from "../../utils/constants";
import { buildHotelSearchParams, DATE_FORMAT } from "../hotels/components/filters/filterUtils";

const AiSearchContext = createContext();

export const AiSearchProvider = ({ children }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [hotels, setHotels] = useState([]);
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [retrievalSummary, setRetrievalSummary] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  const hasSearched = Boolean(submittedMessage || summary || hotels.length);
  const isUnsupported = retrievalSummary?.source === AI_CONSTANTS.UNSUPPORTED_QUERY_SOURCE;
  const hasHotels = hotels.length > 0;
  const hasRecommendedHotels = recommendedHotels.length > 0;
  const hasFilters = Boolean(filtersApplied);
  const matchCount = retrievalSummary?.matchedHotels || hotels.length;
  const resultSubtitle = hasHotels
    ? `${hotels.length} hotels matched your request`
    : hasSearched
      ? AI_CONSTANTS.SEARCH_COPY.noResultCardsSubtitle
      : AI_CONSTANTS.SEARCH_COPY.resultsInitialSubtitle;
  const resultsState = loading
    ? AI_CONSTANTS.RESULTS_STATE.loading
    : hasSearched
      ? AI_CONSTANTS.RESULTS_STATE.empty
      : AI_CONSTANTS.RESULTS_STATE.initial;

  const resetResults = useCallback(() => {
    setSummary("");
    setHotels([]);
    setRecommendedHotels([]);
    setFiltersApplied(null);
    setEstimatedCost(null);
    setRetrievalSummary(null);
    setTips([]);
  }, []);

  const searchHotels = useCallback(
    async (nextMessage = message) => {
      const query = nextMessage.trim();

      if (!query) {
        notifications.show({
          color: "red",
          title: AI_CONSTANTS.NOTIFICATION_COPY.searchRequiredTitle,
          message: AI_CONSTANTS.NOTIFICATION_COPY.searchRequiredMessage,
        });
        return;
      }

      setLoading(true);
      setSubmittedMessage(query);
      setMessage("");
      resetResults();

      try {
        const response = await createTripPlan({ message: query });
        const data = response.data?.data || {};

        setSummary(data.summary || "");
        setHotels(data.hotels || data.recommendedHotels || []);
        setRecommendedHotels(data.recommendedHotels || []);
        setFiltersApplied(data.filtersApplied || null);
        setEstimatedCost(data.estimatedCost || null);
        setRetrievalSummary(data.retrievalSummary || null);
        setTips(data.tips || []);
      } catch (error) {
        console.error(error);
        notifications.show({
          color: "red",
          title: AI_CONSTANTS.NOTIFICATION_COPY.searchFailedTitle,
          message: AI_CONSTANTS.NOTIFICATION_COPY.searchFailedMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [message, resetResults],
  );

  const submitSearch = useCallback(
    (event) => {
      event.preventDefault();
      searchHotels();
    },
    [searchHotels],
  );

  const runExample = useCallback((prompt) => {
    setMessage(prompt);
  }, []);

  const getAiSearchParams = useCallback((hotel, filters) => {
    const nights = Number(filters?.nights || hotel.nights || 1);
    const safeNights = Number.isFinite(nights) && nights > 0 ? nights : 1;
    const checkIn = filters?.checkInDate || filters?.checkIn || dayjs().format(DATE_FORMAT);
    const checkOut =
      filters?.checkOutDate || filters?.checkOut || dayjs(checkIn).add(safeNights, "day").format(DATE_FORMAT);
    const adults = Number(filters?.travelers || 2);

    return buildHotelSearchParams({
      filters: {
        search: filters?.destination || hotel.city,
        checkIn,
        checkOut,
        adults: Number.isFinite(adults) && adults > 0 ? adults : 2,
        minRating: filters?.minRating || "",
        minPrice: filters?.minPricePerNight || 0,
        maxPrice: filters?.maxPricePerNight || 20000,
        amenities: filters?.hotelAmenities || [],
        sortBy: "",
      },
    });
  }, []);

  const getHotelCard = useCallback(
    (hotel, keyPrefix = "hotel") => {
      const searchParams = getAiSearchParams(hotel, filtersApplied);
      const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
      const goToHotel = () => {
        navigate({
          pathname: `/hotel-details/${hotel.id}`,
          search,
        });
      };

      return {
        key: `${keyPrefix}-${hotel.id}-${hotel.roomId || "hotel"}`,
        image: hotel.image || DEFAULT_HOTEL_IMAGE,
        name: hotel.name,
        city: hotel.city,
        rating: hotel.rating,
        roomType: hotel.roomType,
        maxGuests: hotel.maxGuests,
        totalHotelCostLabel: formatCurrency(hotel.totalHotelCost),
        pricePerNightLabel: `${formatCurrency(hotel.pricePerNight)} / night`,
        onSelectHotel: goToHotel,
        onSelectRoom: (event) => {
          event.stopPropagation();
          if (hotel.roomId) {
            navigate({
              pathname: `/room/${hotel.id}/${hotel.roomId}`,
              search,
            });
            return;
          }
          goToHotel();
        },
      };
    },
    [filtersApplied, getAiSearchParams, navigate],
  );

  const hotelCards = hotels.map((hotel) => getHotelCard(hotel));
  const recommendedHotelCards = recommendedHotels.map((hotel) => getHotelCard(hotel, "recommended"));

  const value = useMemo(
    () => ({
      searchCopy: AI_CONSTANTS.SEARCH_COPY,
      examplePrompts: AI_CONSTANTS.EXAMPLE_PROMPTS,
      message,
      setMessage,
      submittedMessage,
      summary,
      hotels,
      recommendedHotels,
      filtersApplied,
      estimatedCost,
      retrievalSummary,
      tips,
      loading,
      searchHotels,
      submitSearch,
      runExample,
      hasSearched,
      isUnsupported,
      hasHotels,
      hasRecommendedHotels,
      hasFilters,
      matchCount,
      resultSubtitle,
      resultsState,
      hotelCards,
      recommendedHotelCards,
    }),
    [
      message,
      submittedMessage,
      summary,
      hotels,
      recommendedHotels,
      filtersApplied,
      estimatedCost,
      retrievalSummary,
      tips,
      loading,
      searchHotels,
      submitSearch,
      runExample,
      hasSearched,
      isUnsupported,
      hasHotels,
      hasRecommendedHotels,
      hasFilters,
      matchCount,
      resultSubtitle,
      resultsState,
      hotelCards,
      recommendedHotelCards,
    ],
  );

  return <AiSearchContext.Provider value={value}>{children}</AiSearchContext.Provider>;
};

export const useAiSearch = () => useContext(AiSearchContext);
