interface CityData {
  country: string
  subcountry?: string
  name: string
}

// Normally I will keep this in .env for security purpose
const COUNTRIES_CACHE_KEY = 'countries-cache'
const COUNTRY_URL =
  'https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json'

interface CountryInfo {
  country: string
  states: string[]
}

export const countryApi = {
  async fetchCountries(): Promise<CountryInfo[]> {
    const cached = localStorage.getItem(COUNTRIES_CACHE_KEY)
    if (cached) return JSON.parse(cached)

    try {
      const response = await fetch(COUNTRY_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: CityData[] = await response.json()

      // Process data to group states by country with proper typing
      const processedData = data.reduce(
        (
          acc: Record<string, { country: string; states: Set<string> }>,
          city: CityData,
        ) => {
          if (!acc[city.country]) {
            acc[city.country] = { country: city.country, states: new Set() }
          }
          if (city.subcountry) {
            acc[city.country].states.add(city.subcountry)
          }
          return acc
        },
        {},
      )

      // Convert sets to arrays and sort
      const finalData: CountryInfo[] = Object.values(processedData)
        .map((country) => ({
          country: country.country,
          states: Array.from(country.states).sort(),
        }))
        .sort((a, b) => a.country.localeCompare(b.country))

      localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(finalData))

      return finalData
    } catch (error) {
      console.error('Failed to fetch countries data:', error)
      const cached = localStorage.getItem(COUNTRIES_CACHE_KEY)
      if (cached) return JSON.parse(cached)

      throw error
    }
  },
}
