import { useState, useEffect } from 'react';

interface Reservation {
  id: string;
  customerName: string;
  time: string;
  guests: number;
  table: string;
  status: string;
  phone: string;
  specialRequests?: string;
  createdAt: string;
}

export const useTodayReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReservations([
        {
          id: '1',
          customerName: 'John Kamau',
          time: '19:30',
          guests: 4,
          table: 'T12',
          status: 'confirmed',
          phone: '+254712345678',
          specialRequests: 'Window seat preferred',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          customerName: 'Sarah Mwangi',
          time: '20:00',
          guests: 2,
          table: 'T05',
          status: 'pending',
          phone: '+254723456789',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          customerName: 'David Ochieng',
          time: '18:45',
          guests: 6,
          table: 'T08',
          status: 'seated',
          phone: '+254734567890',
          specialRequests: 'Birthday celebration',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          customerName: 'Grace Wanjiku',
          time: '21:15',
          guests: 2,
          table: 'T03',
          status: 'confirmed',
          phone: '+254745678901',
          createdAt: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const updateReservationStatus = (id: string, status: string) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id ? { ...reservation, status } : reservation
      )
    );
  };

  return { reservations, loading, updateReservationStatus };
};