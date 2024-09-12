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
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
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
    this.redirect('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // Redirect to home page
    this.redirect('/');
  }

  // Helper method to handle redirection
  redirect(url) {
    window.location.href = url;
  }
}

export default new AuthService();

