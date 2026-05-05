export function serializeUser(user) {
  return {
    id: String(user._id),
    email: user.email,
    username: user.username,
    name: user.name,
    lastName: user.lastName,
    profilePhoto: user.profilePhoto,
    bio: user.bio,
    birthday: user.birthday,
    favoriteTeams: user.favoriteTeams || [],
    favoritePlayers: user.favoritePlayers || [],
  };
}
