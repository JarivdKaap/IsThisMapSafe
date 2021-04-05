import axios from '@/axios';

export default {
  async getMapStatusesPage(page) {
    return await axios.get(`/api/mapstatus?page=${page}`).then((response) => {
      return response.data;
    });
  },
  async getMapStatusesPageSearch(page, search) {
    return await axios.get(`/api/mapstatus?page=${page}&search=${search}`).then((response) => {
      return response.data;
    });
  },
};
