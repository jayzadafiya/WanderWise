/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings, updateTour } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const tour = document.getElementById('tour-form');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');

    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // updateSettings({ name, email }, 'data');
  });

if (tour) {
  tour.addEventListener('click', e => {
    e.preventDefault();

    const images = [];
    const files = document.getElementById('images').files;
    // files.forEach(image => images.push(image));

    for (let image of files) {
      images.push(image);
    }

    console.log(images);
    const { tourId } = e.target.dataset;

    const form = new FormData();
    form.append('imageCover', document.getElementById('imageCover').files[0]);
    form.append('images', images);
    // form.append('photo', document.getElementById('photo').files[0]);

    console.log(document.getElementById('imageCover').files);
    console.log(document.getElementById('images').files);
    for (const entry of form.entries()) {
      console.log(entry);
    }

    updateTour(form, 'data', tourId);
  });
}
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn) console.log(bookBtn);
bookBtn.addEventListener('click', e => {
  console.log('click');
  e.target.textContent = 'Processing...';
  const { tourId } = e.target.dataset;
  bookTour(tourId);
});
