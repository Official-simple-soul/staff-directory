import { countryApi } from '@/api/countries.api'
import { useQuery } from '@tanstack/react-query'

interface CountryData {
  country: string
  states: string[]
}

export const useCountries = () => {
  const { data, isLoading, isError, error } = useQuery<CountryData[]>({
    queryKey: ['countries'],
    queryFn: countryApi.fetchCountries,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  // Helper function to get states for a specific country
  const getStatesForCountry = (countryName: string): string[] => {
    if (!data) return []
    const country = data.find((c) => c.country === countryName)
    return country?.states || []
  }

  return {
    countries: data || [],
    isLoading,
    isError,
    error,
    getStatesForCountry,
  }
}
