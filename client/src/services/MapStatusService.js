import axios from '@/axios';

export default {
  async getMapStatus(steamId) {
    return await axios.get(`/api/mapstatus/${steamId}`).then((response) => {
      return response.data;
    });
  },
  async getMapStatusesPage(page, validated = true) {
    return await axios.get(`/api/mapstatus?page=${page}&validated=${validated}`).then((response) => {
      return response.data;
    });
  },
  async getMapStatusesPageSearch(page, search) {
    return await axios.get(`/api/mapstatus?page=${page}&search=${search}`).then((response) => {
      return response.data;
    });
  },
  async createMapStatusRequest(steamId) {
    return await axios.post(`/api/mapstatus/${steamId}`).then((response) => {
      return response.data;
    });
  },
};
