export default function sanitizeUser(u) {
  return {
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    avatar: u.avatar,
    favorite: u.favorite,
  };
}
