/**
 * Fetch data from the API.
 *
 * @param {string} country - The country of the document to get.
 * @returns {Promise<object>} Promise resolved with all documents.
 */
async function fetchDataCountryAndAllMoviesAndTvShow (country) {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/netflix/country/${country}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    // Kontrollera om svaret är tomt
    if (Object.keys(data).length === 0) {
      throw new Error('Inga filmer eller tv-serier hittades för det valda landet.')
    }
    return data
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

/**
 * Get all unique countries from the API.
 *
 * @returns {Promise<string[]>} Promise resolved with all unique countries.
 */
async function fetchDataCountry () {
  try {
    const response = await fetch('http://localhost:8000/api/v1/netflix/country', {
      method: 'GET'
    })
    const data = await response.json()
    const selectElement = document.getElementById('country')

    // Clear existing options
    selectElement.textContent = ''

    // Create and append options
    data.forEach(country => {
      const option = document.createElement('option')
      option.text = country
      selectElement.add(option)
    })

    return uniqueCountries
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

fetchDataCountry()

/**
 * Fetch data from the API rating.
 *
 * @param {string} country - The country of the document to get.
 * @returns {Promise<object>} Promise resolved with all documents.
 */
async function fetchDataRating (country) {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/netflix/rating/${country}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

let myChartCountry

/**
 * Render chart with fetched data.
 *
 * @param {string} country - The country of the document to get.
 */
async function renderChartCountry (country) {
  const countryData = await fetchDataCountryAndAllMoviesAndTvShow(country)
  if (!countryData) return
  const canvas = document.getElementById('myChartCountry')
  const ctx = canvas.getContext('2d')
  const labels = countryData.map(item => item._id)
  // Extract counts of movies and TV shows for each country
  const movieCounts = countryData.map(item => {
    const movieType = item.mediaTypes.find(mediaType => mediaType.type === 'Movie')
    return movieType ? movieType.count : 0
  })
  const tvShowCounts = countryData.map(item => {
    const tvShowType = item.mediaTypes.find(mediaType => mediaType.type === 'TV Show')
    return tvShowType ? tvShowType.count : 0
  })

  const chartData = {
    labels: [labels],
    datasets: [{
      label: 'Number of Movies',
      data: movieCounts,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'black',
      borderWidth: 1
    },
    {
      label: 'Number of TV Shows',
      data: tvShowCounts,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'black',
      borderWidth: 1
    }
    ]
  }

  if (myChartCountry) {
    myChartCountry.destroy()
  }

  myChartCountry = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 1)',
            font: {
              size: 20
            }
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Number of Movies and TV Shows from ${country}, Netflix 2021`,
          font: {
            size: 20
          },
          color: 'rgba(255, 255, 255, 1)'
        },
        legend: {
          labels: {
            font: {
              size: 16
            },
            color: 'rgba(255, 255, 255, 1)'
          }
        }
      }
    }
  })
}

let myRatingChart

/**
 * Render chart with fetched data.
 *
 * @param {string} country - The rating of the document to get.
 */
async function renderRatingChart (country) {
  const ratingData = await fetchDataRating(country)
  if (!ratingData) return

  const canvas = document.getElementById('myChartRating')
  const ctx = canvas.getContext('2d')

  const labels = ratingData.map(item => `${item._id.rating} (${item._id.type})`)
  const data = ratingData.map(item => item.count)

  // Create chart data
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Rating Counts',
      size: 20,
      data: data,
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)', // Red
        'rgba(54, 162, 235, 0.5)', // Blue
        'rgba(255, 205, 86, 0.5)', // Yellow
        'rgba(75, 192, 192, 0.5)', // Green
        'rgba(153, 102, 255, 0.5)', // Purple
        'rgba(255, 159, 64, 0.5)' // Orange
      ],
      borderColor: 'rgba(255, 255, 255, 1)', // White color for line
      borderWidth: 1,
      pointRadius: 10,
      pointStyle: 'rectRot'
    }]
  }

  // Destroy existing chart if it exists
  if (myRatingChart) {
    myRatingChart.destroy()
  }

  myRatingChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 1)',
            font: {
              size: 12
            },
            angle: -45
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Rating for all Movies and TV Shows from ${country}, Netflix 2021`,
          font: {
            size: 20
          },
          color: 'rgba(255, 255, 255, 1)'
        },
        legend: {
          labels: {
            font: {
              size: 16
            },
            color: 'rgba(255, 255, 255, 1)'
          }
        }

      }
    }
  })
}

const selectElement = document.getElementById('country')
selectElement.addEventListener('change', async function (event) {
  event.preventDefault()
  const selectedOption = document.getElementById('country').value
  await renderChartCountry(selectedOption)
  await renderRatingChart(selectedOption)
})

document.addEventListener('DOMContentLoaded', function () {
  renderRatingChart()
  renderChartCountry()
})
