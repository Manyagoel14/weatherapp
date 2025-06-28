window.addEventListener("DOMContentLoaded", () => {
  const dateElement = document.getElementById("dateDisplay");
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  dateElement.textContent = today.toLocaleDateString("en-IN", options);
  let city = localStorage.getItem("city") || "Noida";
  fetchData(city);
  fetchWeekData(city);

  document.getElementById("search").addEventListener("click", (e) => {
    e.preventDefault();
    city = document.getElementById("searchBox").value.trim();
    if (city) {
      fetchData(city);
      fetchWeekData(city);
    }
    localStorage.setItem("city", city);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
    e.preventDefault();
    city = document.getElementById("searchBox").value.trim();
    if (city) {
      fetchData(city);
      fetchWeekData(city);
    }
    localStorage.setItem("city", city);
}
  });

  document.getElementById("profile-tab").addEventListener("click", (e) => {
    e.preventDefault();
    city = document.getElementById("searchBox").value.trim();
    if (city) fetchWeekData(city);
  });

  document.getElementById("location").addEventListener("click", (e) => {
    e.preventDefault();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          )
            .then((response) => response.json())
            .then((data) => {
              let city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county;
              fetchData(city);
              fetchWeekData(city);
              localStorage.setItem("city", city);
            })
            .catch((error) => console.error("Reverse geocoding error:", error));
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });
});

async function fetchData(city) {
  const apiKey = "787b73993e55458eb8d130405252806";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log(data);

    feels_like.innerHTML = `${data.current.feelslike_c}&deg;C`;
    humidity.innerHTML = data.current.humidity + "%";
    precipitation.innerHTML = data.current.precip_mm + " mm";
    temp.innerHTML = `${data.current.temp_c}&deg;C`;
    temp_max.innerHTML = `${data.forecast.forecastday[0].day.maxtemp_c}&deg;C`;
    temp_min.innerHTML = `${data.forecast.forecastday[0].day.mintemp_c}&deg;C`;
    cityName.innerHTML = data.location.name;
    country.innerHTML = data.location.country;

    sunrise.innerHTML = data.forecast.forecastday[0].astro.sunrise;
    sunset.innerHTML = data.forecast.forecastday[0].astro.sunset;
    speed.innerHTML = data.current.wind_kph + " km/hr";

    const weatherCond = data.current.condition.text;
    const iconCode = data.current.condition.icon;

    weather.innerHTML = `
        <div class="d-flex flex-column align-items-center">
          <img src=${iconCode} alt="weather icon" class="icon">
          <h5 id="weatherCond" class="mt-2 mb-0">${weatherCond}</h5>
        </div>
      `;
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

async function fetchWeekData(city) {
  const apiKey = "787b73993e55458eb8d130405252806";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=8`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log(data);
    const forecastContainer = document.getElementById("week");
    forecastContainer.innerHTML = "";

    data.forecast.forecastday.forEach((day, index) => {
      const isToday = index === 0 ? "first" : "rest";

      const forecastHTML = `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch mb-3">
  <div class="weekfeatures rounded shadow-sm w-100 ${isToday}">
    <div class="row align-items-center">
      <div class="col-8">
                <h6>${new Date(day.date).toLocaleDateString("en-GB")}</h6>
                <h6 class="text-light-emphasis mb-1">${
                    day.day.condition.text
                    }</h6>
            </div>
            <div class="col-4 text-end">
                <img src="https:${
                  day.day.condition.icon
                }" alt="icon" width="50">
            </div>
        </div>
        <div class=" deets row row-cols-2">
            <div class="col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9B79F8" class="bi bi-moisture"
                    viewBox="0 0 16 16">
                    <path
                        d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267" />
                </svg>
                ${day.day.avghumidity}%
            </div>
            <div class="col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9B79F8" class="bi bi-thermometer"
                    viewBox="0 0 16 16">
                    <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                    <path
                        d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z" />
                </svg>${day.day.avgtemp_c}&deg
            </div>
            <div class="col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9B79F8" class="bi bi-arrow-down"
                    viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
                </svg>
                ${day.day.mintemp_c}&deg;
            </div>
            <div class="col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9B79F8" class="bi bi-arrow-up"
                    viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5" />
                </svg>
                ${day.day.maxtemp_c}&deg;
            </div>
        </div>
    </div>
</div>`;
      forecastContainer.innerHTML += forecastHTML;
    });
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
