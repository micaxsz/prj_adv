export class AuthService {
  static baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;

  // Login — kirim email & password ke server auth, simpan token kalau berhasil
  static async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
      const data = await response.json();
      localStorage.setItem("token", data.refreshToken);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  // Logout — hapus token dari localStorage dan kabari server
  static async logout() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
      }
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  // Ambil daftar mata kuliah dari server (butuh token авторизации)
  static async getMatkul() {
    const token = localStorage.getItem("token");
    console.log("Fetching mata kuliah with token:", token);
    try {
      const response = await fetch(`${this.baseUrl}/getMakul`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch mata kuliah");
      }
      console.log("Fetched mata kuliah:", data);
      return data.data;
    } catch (error) {
      console.error("Error fetching mata kuliah:", error);
      throw error;
    }
  }
}
