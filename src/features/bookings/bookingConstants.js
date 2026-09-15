export const BOOKING_TYPES = { MOVIE: 'movie', HOTEL: 'hotel', FLIGHT: 'flight', RESTAURANT: 'restaurant', OTHER: 'other' }
export const BOOKING_TYPE_LABELS = { movie: 'Movie', hotel: 'Hotel', flight: 'Flight', restaurant: 'Restaurant', other: 'Other' }
export const BOOKING_TYPE_OPTIONS = Object.entries(BOOKING_TYPE_LABELS).map(([value, label]) => ({ value, label }))
export const BOOKING_SHARE_MODES = { FULL: 'full', EQUAL: 'equal' }