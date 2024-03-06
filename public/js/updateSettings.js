/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (updateData, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/update-my-password'
        : '/api/v1/users/update-me';

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json' // Specify content type
      },
      body: JSON.stringify(updateData)
    });

    const data = await res.json();

    if (data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
