'use client';
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

// default marker fix for React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function FlyToLocation({ lat, lon }) {
    const map = useMap();

    React.useEffect(() => {
        if (lat && lon) {
        map.flyTo([lat, lon], 15, { animate: true });
        }
    }, [lat, lon, map]);

    return null;
}

function ClickHandler({ onSelect }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        const address = data.display_name || "Unknown location";
        onSelect(address, { lat, lon: lng });
      } catch (err) {
        console.error("Reverse geocode error:", err);
      }
    },
  });
  return null;
}

export default function AddressPicker({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchTimeout = React.useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
    }
    if (value.length < 3) { // Dont search short strings
      setResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
        setLoading(true);
        try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
            )}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setResults(data);
        } catch (err) {
        console.error("Error fetching results:", err);
        } finally {
        setLoading(false);
        }
    }, 500);
  };

  const handleSelect = (placeOrAddress, coords) => {
    let lat, lon, address;
    if (placeOrAddress.lat) {
      lat = parseFloat(placeOrAddress.lat);
      lon = parseFloat(placeOrAddress.lon);
      address = placeOrAddress.display_name;
    } else {
      address = placeOrAddress;
      lat = coords.lat;
      lon = coords.lon;
    }

    setSelected({ lat, lon, address });
    setQuery(address);
    setResults([]);
  };


  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className='border-accent-ui text-text-dark w-full bg-accent-dark'>+ Add address</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-secondary border-accent-dark border-2">
          <DialogHeader>
            <DialogTitle className='font-bold text-text-dark'>Select address</DialogTitle>
          </DialogHeader>
            <div className='flex flex-col gap-2 '>
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="Search for an address..."
                        className='bg-secondary py-1 w-full rounded-md border border-accent-ui text-text-dark px-2' 
                    />
                    {loading && (
                    <div style={{ fontSize: 12, marginTop: 4 }}>Searching...</div>
                    )}

                    {results.length > 0 && (
                    <ul
                        className="
                            absolute w-full text-text-dark bg-accent-light/80 border rounded-md
                            max-h-40 overflow-y-auto z-50 mt-1 shadow-sm
                        "
                    >
                        {results.map((place) => (
                        <li
                            key={place.place_id}
                            onClick={() => handleSelect(place)}
                            className="
                                px-3 py-2 cursor-pointer border-b border-gray-200
                                hover:bg-accent-dark/80 transition-colors
                            "
                        >
                            {place.display_name}
                        </li>
                        ))}
                    </ul>
                    )}
                </div>

                <div className="h-[360px] w-full z-10">
                    <MapContainer
                    center={selected ? [selected.lat, selected.lon] : [0, 0]}
                    zoom={selected ? 15 : 2}
                    className="rounded w-full h-full "
                    >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    />

                    {selected && (
                        <>
                        <Marker position={[selected.lat, selected.lon]}>
                            <Popup>{selected.address}</Popup>
                        </Marker>
                        <FlyToLocation lat={selected.lat} lon={selected.lon} />
                        </>
                    )}
                    <ClickHandler onSelect={handleSelect} />
                    </MapContainer>
                </div>
                </div>
          <DialogFooter>
            <div className="mr-8">
            </div>
            <div className="flex flex-row gap-2 mt-auto">
              <DialogClose asChild>
                  <Button variant="outline" className='shadow-sm bg-accent-light border-primary-dark border text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" 
                    className='shadow-sm hover:bg-accent-dark transition-colors duration-200 ease-in-out'
                      disabled={(!selected || selected.address==="Unknown location")}
                      onClick={()=>{
                        onSelect(selected.address);
                      }}
                  >Save changes
                  </Button>
                </DialogClose>
            </div>
            
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
