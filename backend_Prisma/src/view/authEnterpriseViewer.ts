import { usersEnterprise } from "@prisma/client";

export default function authEnterpriseViewer(usersEnterprise: usersEnterprise, token?: string) {
  const userView = {
    usersEnterprise: {
      email: usersEnterprise.email,
      token: token,
      username: usersEnterprise.username,
      image: usersEnterprise.image,
    },
  };
  if (token) {
    userView.usersEnterprise.token = token;
  }
  return userView;
}