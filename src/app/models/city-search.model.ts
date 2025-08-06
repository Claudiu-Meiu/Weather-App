export interface City {
  id: string;
  country: string;
  city: string;
  lat: string;
  long: string;
}

export interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
