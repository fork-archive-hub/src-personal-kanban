export function generateUserList(userCount) {
  if (!userCount || userCount === 0) return [];

  const retUsers = [];

  for (let i = 0; i < userCount; i++) {
    retUsers.push({
      id: i,
      username: i % 2 === 0 ? "User Name" + i : "用户名" + i,
      fullName: i % 2 === 0 ? "User Name" + i : "用户名" + i,
      avatar: "avatar",
      avatarUrl: '',
      memberType: 'normal',
    });
  }

  return retUsers;
}
