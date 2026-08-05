const config = {
  baseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BASE_URL ||
    "https://backend-ph-tour-management-system.vercel.app/api/v1",
};

export default config;
