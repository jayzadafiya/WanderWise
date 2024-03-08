/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// import Stripe from 'stripe';

// const stripe = Stripe(
//   'pk_test_51OpTdCSAo3xRMIJ7R3K5J7bdEnqpn2AnSEmjbJorOJHaJmLt9LMxLtZXzdaTgb6jTpYBNM7OY9hdrjgUeA3YqMrX00avA8pbpG'
// );

export const bookTour = async tourId => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + chanre credit card
    const redirectUrl = session.data.session.url;
    window.location.replace(redirectUrl);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
