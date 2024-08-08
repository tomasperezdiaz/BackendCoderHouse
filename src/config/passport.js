import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPass } from "../utils/bcryptPassword.js";
import { UserRepository } from "../repositories/index.js";
import { createCart } from "../repositories/cartsRepository.js";

const localStrategy = local.Strategy;

export const initialPassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, userName, password, done) => {
        try {
          const { confirmPassword } = req.body;

          if (password !== confirmPassword) {
            return done(null, false);
          }
          const newCart = await createCart();
          const user = await UserRepository.getUserEmail(userName);

          if (user) {
            return done(null, false);
          }

          req.body.password = createHash(password);

          const newUser = await UserRepository.registerUser({ ...req.body, cart:newCart });

          if (newUser) return done(null, newUser);
          return done(null, false);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (userName, password, done) => {
        try {
          const user = await UserRepository.getUserEmail(userName);

          if (!user) {
            done(null, false, { message: "User not found" });
          }
          if (!isValidPass(password, user.password)) {
            return done(null, false,  { message: "Invalid password" });
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserRepository.getUserById(id);
    done(null, user);
  });
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv23li7Z4j3K7cLwgcsL",
        clientSecret: "190f02a2abebd85e2f434980431493dbc21b1945",
        callbackURL: "http://localhost:8080/login-github-callack",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let newCart = await createCart();
          const email = profile._json.email;
          const user = await UserRepository.getUserEmail(email);

          if (user) return done(null, user);

          const newUser = {
            name: profile._json.name,
            email,
            password: ".$",
            image: profile._json.avatar_url,
            github: true,
            cart: newCart,
          };

          const result = await UserRepository.registerUser({ ...newUser });

          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
