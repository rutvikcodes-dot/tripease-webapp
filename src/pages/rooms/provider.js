import { createContext, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useHotel } from "../hotels/provider";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { selectedHotel } = useHotel();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const currentRoomId =
    pathname.startsWith("/room/") || pathname.startsWith("/booking/") || pathname.startsWith("/checkout/")
      ? pathname.split("/")[3]
      : null;

  const roomFromHotel = useMemo(() => {
    if (!currentRoomId) return null;

    return selectedHotel?.rooms?.find((room) => String(room.id) === String(currentRoomId)) || null;
  }, [currentRoomId, selectedHotel]);

  const resolvedSelectedRoom =
    currentRoomId && String(selectedRoom?.id) !== String(currentRoomId) ? roomFromHotel : selectedRoom || roomFromHotel;

  const selectRoom = (room) => {
    const params = new URLSearchParams(searchParams);
    const hotelId = room.hotelId || selectedHotel?.id;

    if (!hotelId) return;

    setSelectedRoom(room);
    navigate({
      pathname: `/room/${hotelId}/${room.id}`,
      search: params.toString() ? `?${params.toString()}` : "",
    });
  };

  return (
    <RoomContext.Provider
      value={{
        selectedRoom: resolvedSelectedRoom,
        selectRoom,
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
        guests,
        setGuests,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
