// Simple in-memory user storage (for demonstration purposes)
// In production, use a proper database like MongoDB, PostgreSQL, etc.

class User {
  constructor() {
    this.users = [];
  }

  async create(userData) {
    const user = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findById(id) {
    return this.users.find(user => user.id === id);
  }
}

module.exports = new User();
