import axios from '@/axios';

export default {
  async getMapStatuses(page) {
    return await axios.get(`/api/mapstatus?page=${page}`).then((response) => {
      return response.data;
    });
  },
};
