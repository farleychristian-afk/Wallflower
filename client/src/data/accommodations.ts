export type Amenity = 'WiFi' | 'Pool' | 'Parking' | 'Gym' | 'Breakfast' | 'Spa' | 'PetFriendly';

export type Accommodation = {
  id: string;
  name: string;
  city: string;
  pricePerNight: number; // USD
  starRating: number; // 1-5 hotel stars
  customerRating: number; // 0-5 average review
  amenities: Amenity[];
  image?: string;
};

export const ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'a1',
    name: 'Grand Plaza Hotel',
    city: 'Paris',
    pricePerNight: 220,
    starRating: 5,
    customerRating: 4.7,
    amenities: ['WiFi', 'Pool', 'Parking', 'Gym', 'Breakfast', 'Spa'],
  },
  {
    id: 'a2',
    name: 'Riverside Inn',
    city: 'London',
    pricePerNight: 140,
    starRating: 3,
    customerRating: 4.1,
    amenities: ['WiFi', 'Breakfast', 'Parking'],
  },
  {
    id: 'a3',
    name: 'City Center Suites',
    city: 'New York',
    pricePerNight: 180,
    starRating: 4,
    customerRating: 4.3,
    amenities: ['WiFi', 'Gym', 'Breakfast', 'Parking'],
  },
  {
    id: 'a4',
    name: 'Coastal Retreat',
    city: 'Barcelona',
    pricePerNight: 110,
    starRating: 2,
    customerRating: 3.9,
    amenities: ['WiFi', 'Pool', 'Parking'],
  },
  {
    id: 'a5',
    name: 'Mountain View Lodge',
    city: 'Zurich',
    pricePerNight: 160,
    starRating: 4,
    customerRating: 4.5,
    amenities: ['WiFi', 'Parking', 'Breakfast', 'PetFriendly'],
  },
  {
    id: 'a6',
    name: 'Old Town Boutique',
    city: 'Prague',
    pricePerNight: 95,
    starRating: 3,
    customerRating: 4.0,
    amenities: ['WiFi', 'Breakfast'],
  },
  {
    id: 'a7',
    name: 'Seaside Spa Resort',
    city: 'Nice',
    pricePerNight: 250,
    starRating: 5,
    customerRating: 4.8,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Breakfast', 'Parking'],
  },
  {
    id: 'a8',
    name: 'Airport Express Hotel',
    city: 'Amsterdam',
    pricePerNight: 120,
    starRating: 3,
    customerRating: 3.8,
    amenities: ['WiFi', 'Parking', 'Breakfast'],
  },
  {
    id: 'a9',
    name: 'Business Hub Stay',
    city: 'Singapore',
    pricePerNight: 200,
    starRating: 4,
    customerRating: 4.6,
    amenities: ['WiFi', 'Gym', 'Parking', 'Breakfast'],
  },
  {
    id: 'a10',
    name: 'Historic Charm Hotel',
    city: 'Rome',
    pricePerNight: 130,
    starRating: 3,
    customerRating: 4.2,
    amenities: ['WiFi', 'Breakfast', 'PetFriendly'],
  },
  {
    id: 'a11',
    name: 'Urban Minimalist',
    city: 'Berlin',
    pricePerNight: 85,
    starRating: 2,
    customerRating: 3.6,
    amenities: ['WiFi'],
  },
  {
    id: 'a12',
    name: 'Harbor Lights Hotel',
    city: 'Sydney',
    pricePerNight: 210,
    starRating: 5,
    customerRating: 4.9,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Breakfast'],
  },
];
