import jwtDecode from "jwt-decode";

const getPermissions = () => {
  const token = localStorage.getItem("access-token");
  
  if (token) {
    const permissions = jwtDecode(token)?.permissions;
    return permissions;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem("access-token");
  
  if (token) {
    const {role, sub} = jwtDecode(token);
    return {role, sub};
  }
};

export default getPermissions;
