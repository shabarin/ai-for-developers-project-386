import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { Layout } from './components/Layout';
import { HomePage } from './pages/public/HomePage';
import { BookPage } from './pages/public/BookPage';
import { BookingConfirmPage } from './pages/public/BookingConfirmPage';
import { AdminEventTypesPage } from './pages/admin/AdminEventTypesPage';
import { EventTypeFormPage } from './pages/admin/EventTypeFormPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:eventTypeId" element={<BookPage />} />
            <Route path="/booking/:id" element={<BookingConfirmPage />} />
            <Route path="/admin" element={<AdminEventTypesPage />} />
            <Route path="/admin/event-types/new" element={<EventTypeFormPage />} />
            <Route path="/admin/event-types/:id/edit" element={<EventTypeFormPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
