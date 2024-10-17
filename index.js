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
    console.log(state);

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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const API_URL = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_DrZsvyk4vrICfBD8LRswYDg56fIJk&ipAddress=${searchBar.value}`;
  console.log(API_URL);
  apiCall(API_URL);
});

window.addEventListener("load", () => {
  apiCall(INITIAL_URL);
});
