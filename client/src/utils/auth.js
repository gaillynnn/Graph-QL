import jwtDecode from 'jwt-decode'; // Use the correct import name for the decode function

class AuthService {
  // Get user data
  getProfile() {
    return jwtDecode(this.getToken());
  }

  // Check if user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      // Ensure the expiration field exists and is valid
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      // In case of an error (e.g., invalid token), assume it is expired or invalid
      return true;
    }
  }

  getToken() {
    // Retrieve the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // Save user token to localStorage
    localStorage.setItem('id_token', idToken);
    // Redirect to home page
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();