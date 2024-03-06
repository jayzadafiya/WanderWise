/* eslint-disable */
import { showAlert } from './alerts.js';

export const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Specify content type
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await res.json();
    console.log(data);

    if (data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};

export const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout');
    const data = await res.json();
    console.log(data);
    if ((data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
