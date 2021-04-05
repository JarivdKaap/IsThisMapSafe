import axios from 'axios';
import router from '@/router';

const axiosObj = axios.create({
  headers: { Authorization: 'bearer ' + localStorage.getItem('accessToken') },
});

axiosObj.interceptors.request.use(function (config) {
  config.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');

  return config;
});

axiosObj.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response.status !== 401) {
      return Promise.reject(err);
    }

    router.app.$notify({
      type: 'error',
      title: 'Error with authentication',
      text: 'Moving you to login screen',
    });

    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');
    router.app.$acl.change('public');
    if (router.app.$route.path !== '/login') router.app.$router.push('/login');
  },
);

export default axiosObj;
