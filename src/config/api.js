 const Host = process.env.NEXT_PUBLIC_API_BASE_URL; 
const api = {
  auth: {
    login: `${Host}/auth`,

  },

  panel: {
   cars: `${Host}/cars`
  },
};

export default api;
