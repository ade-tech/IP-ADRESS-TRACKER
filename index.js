import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const searchBar = document.querySelector(".searchInput");
const INITIAL_URL = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_DrZsvyk4vrICfBD8LRswYDg56fIJk&ipAddress`;
const form = document.querySelector("form");
const state = {
  currentCoords: {},
};
const map = L.map("map");
const ipAddressText = document.querySelector(".ipAddressText");
const locationText = document.querySelector(".locationText");
const timeZoneText = document.querySelector(".timezoneText");
const ispText = document.querySelector(".ispText");
// Create custom icon
const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Add tile layer to map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let marker = L.marker([51.505, -0.09], { icon: customIcon }).addTo(map);

const apiCall = async function (url) {
  try {
    const fetchCall = await fetch(url);
    if (!fetchCall.ok) throw new Error("Error fetching data");
    const data = await fetchCall.json();
    state.currentCoords = data;
    if (!state.currentCoords) return;

    const { lat, lng } = state.currentCoords.location;
    const { region, city } = state.currentCoords.location;

    marker.setLatLng([lat, lng]);
    map.setView([lat, lng], 13);
    ipAddressText.innerHTML = state.currentCoords.ip;
    ispText.innerHTML = state.currentCoords.isp;
    timeZoneText.innerHTML = state.currentCoords.location.timezone;
    locationText.innerHTML = `${city},${region}`;
    searchBar.value = "";
    return data;
  } catch (error) {
    console.error("API call failed:", error);
  }
};

const resolveDomain = async (domain) => {
  const apiUrl = `https://dns.google/resolve?name=${domain}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract the IP address (A record for IPv4)
    const ipAddresses = data.Answer
      ? data.Answer.filter((answer) => answer.type === 1).map(
          (answer) => answer.data
        )
      : [];

    return ipAddresses[0];
  } catch (error) {
    console.error("Error resolving the domain:", error);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let searchBarValue = searchBar.value;
  const pattern =
    /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)\b|\b([0-9a-fA-F]{1,4}:){1,7}:([0-9a-fA-F]{1,4})?\b/g;

  if (!pattern.test(searchBarValue)) {
    searchBarValue = await resolveDomain(searchBarValue);
  }

  const API_URL = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_DrZsvyk4vrICfBD8LRswYDg56fIJk&ipAddress=${searchBarValue}`;

  apiCall(API_URL);
});

window.addEventListener("load", () => {
  apiCall(INITIAL_URL);
});
