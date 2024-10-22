'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBookings } from './data-service';
import { supabase } from './supabase';

const { signIn, signOut, auth } = require('./auth');

export async function updateGuestAction(formData) {
  const session = await auth();
  if (!session) throw new Error('You are not logged in, please log in first');

  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error('Please provide a valid national ID');

  const { data, error } = await supabase
    .from('guests')
    .update({
      nationalID,
      nationality,
      countryFlag,
    })
    .eq('id', session?.user?.guestId);

  if (error) {
    console.log(error);
    throw new Error('Guest could not be updated');
  }

  revalidatePath('/account/profile');
}

export async function deleteReservationAction(bookingId) {
  const session = await auth();
  if (!session) throw new Error('You are not logged in, please log in first');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You are not allowed to delete that booking');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }

  revalidatePath('/account/reservations');
}

export async function updateReservationAction(formData) {
  const bookingId = +formData.get('bookingId');
  const session = await auth();
  if (!session) throw new Error('You are not logged in, please log in first');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You are not allowed to update that booking');

  const numGuests = parseInt(formData.get('numGuests'));
  const observations = formData.get('observations').slice(0, 1000);

  const { error } = await supabase
    .from('bookings')
    .update({ numGuests, observations })
    .eq('id', bookingId);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath('/account/reservations');

  redirect('/account/reservations');
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
