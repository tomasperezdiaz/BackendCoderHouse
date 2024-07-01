class UserDTO {
  constructor(user) {
    this.name = user.name;
    this.lastName = user.lastName;
    this.rol = user.rol;
    this.email = user.email;
    this.age = user.age ? user.age : "-";
    this.cart = user.cart;
    this.role = user.role;
  }
}

export default UserDTO;
