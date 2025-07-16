const API_BASE_URL = 'http://localhost:5000/api';

class DesignService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Create a new design
  async createDesign(designData) {
    try {
      const response = await fetch(`${this.baseURL}/designs`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(designData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save design');
      }

      return { success: true, design: data.design };
    } catch (error) {
      console.error('Create design error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's designs
  async getUserDesigns(page = 1, limit = 10, category = null, search = null) {
    try {
      let url = `${this.baseURL}/designs?page=${page}&limit=${limit}`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load designs');
      }

      return { success: true, ...data };
    } catch (error) {
      console.error('Get user designs error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get a specific design by ID
  async getDesign(designId) {
    try {
      const response = await fetch(`${this.baseURL}/designs/${designId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load design');
      }

      return { success: true, design: data.design };
    } catch (error) {
      console.error('Get design error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update an existing design
  async updateDesign(designId, designData) {
    try {
      const response = await fetch(`${this.baseURL}/designs/${designId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(designData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update design');
      }

      return { success: true, design: data.design };
    } catch (error) {
      console.error('Update design error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a design
  async deleteDesign(designId) {
    try {
      const response = await fetch(`${this.baseURL}/designs/${designId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete design');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete design error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get public designs
  async getPublicDesigns(page = 1, limit = 10, category = null, search = null) {
    try {
      let url = `${this.baseURL}/designs/public?page=${page}&limit=${limit}`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load public designs');
      }

      return { success: true, ...data };
    } catch (error) {
      console.error('Get public designs error:', error);
      return { success: false, error: error.message };
    }
  }

  // Increment download count
  async incrementDownload(designId) {
    try {
      const response = await fetch(`${this.baseURL}/designs/${designId}/download`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update download count');
      }

      return { success: true };
    } catch (error) {
      console.error('Increment download error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate or update a share link and settings
  async generateOrUpdateShareLink(designId, generalAccess, sharePeople) {
    try {
      const response = await fetch(`${this.baseURL}/designs/${designId}/share`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ generalAccess, sharePeople })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate share link');
      }
      return { success: true, ...data };
    } catch (error) {
      console.error('Generate share link error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update sharing settings (people, roles, general access)
  async updateShareSettings(designId, generalAccess, sharePeople) {
    try {
      const response = await fetch(`${this.baseURL}/designs/${designId}/share`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ generalAccess, sharePeople })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update sharing settings');
      }
      return { success: true, ...data };
    } catch (error) {
      console.error('Update share settings error:', error);
      return { success: false, error: error.message };
    }
  }

  // Fetch a design by share token (for public access)
  async getDesignByShareToken(token, email = null) {
    try {
      let url = `${this.baseURL}/designs/share/${token}`;
      if (email) url += `?email=${encodeURIComponent(email)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch shared design');
      }
      return { success: true, ...data };
    } catch (error) {
      console.error('Get design by share token error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new DesignService(); 