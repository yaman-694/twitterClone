import userRoute from "./routers/test.route";
import loginRoute from "./routers/login.route";
import homeRoute from "./routers/home.route";
import registerRoute from "./routers/register.route";
import logoutRoute from "./routers/logout.route";
import postRoute from "./routers/post.route";
import postPageRoute from "./routers/postPage.route";
import profileRoute from "./routers/profile.route";

const apiV = "/api/v1/";
export const ROUTER = [
  {
    path: "/test",
    router: userRoute,
  },
  {
    path: "/",
    router: homeRoute,
  },
  {
    path: "/login",
    router: loginRoute
  },
  {
    path: "/register",
    router: registerRoute
  },
  {
    path: "/logout",
    router: logoutRoute
  },
  {
    path: `${apiV}posts`,
    router: postRoute,
  },
  {
    path: `${apiV}post`,
    router: postPageRoute,
  },
  {
    path: `${apiV}profile`,
    router: profileRoute,
  }
];
