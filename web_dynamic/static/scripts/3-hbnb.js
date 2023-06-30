document.ready(function () {
  const amenities = {};
  $('li input[type=checkbox]').change(function () {
    if (this.checked) {
      amenities[this.dataset.name] = this.dataset.id;
    } else {
      delete amenities[this.dataset.name];
    }
    $('.amenities h4').text(Object.keys(amenities).sort().join(', '));
  });
});

const checkApiStatus = function () {
  $.getJSON(`http://${host}:5001/api/v1/status`, (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
};

const fetchPlaces = function (amenitiesFilter = {}) {
  $.ajax({
    url: `http://${host}:5001/api/v1/places_search`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ amenities: Object.keys(amenitiesFilter) }),
    success: (data) => {
      data.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      $('section.places').empty();
      for (const place of data) {
        const article = `
        <article>
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guests</div>
            <div class="number_rooms">${place.number_rooms} Bedrooms</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>`;
        $('section.places').append(article);
      }
    }
  }
  );
};

$(() => {
  checkApiStatus();
  fetchPlaces(checkedAmenities);
  $('button').on('click', () => {
    fetchPlaces(checkedAmenities);
  });
});
