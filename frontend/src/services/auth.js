const authService = {
    async login(userData) {
      try {
        const response = await api.post('/login', userData);
        const { token, _id, name, email, role } = response.data;
        
        if (token) {
          localStorage.clear(); // Clear previous session
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({
            id: _id,
            name,
            email,
            role
          }));
        }
        return response.data;
      } catch (error) {
        console.error('Login error:', error.response?.data);
        throw error.response?.data?.message || 'Login failed';
      }
    },
  
    isTokenValid() {
      const token = localStorage.getItem('token');
      if (!token) return false;
  
      try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
      } catch (error) {
        console.error('Token validation error:', error);
        return false;
      }
    }
  };

  export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
      try {
        const response = await authService.login(userData);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );