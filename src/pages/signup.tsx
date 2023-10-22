// import Select from "react-select"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import { Auth } from "aws-amplify";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

export default function Signup() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpWithEmailAndPassword(data);
        setShowCode(true);
      }
    } catch (err: any) {
      console.error(err);
      setSignUpError(err.message);
      setOpen(true);
    }
  };

  const handleClose = (
    event?: Event | React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  async function signUpWithEmailAndPassword(
    data: IFormInput
  ): Promise<CognitoUser> {
    const { username, password, email } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Signed up a user:", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { username, password, code } = data;
    try {
      await Auth.confirmSignUp(username, code);
      const amplifyUser = await Auth.signIn(username, password);
      console.log("Successs, singed in a user", amplifyUser);
      if (amplifyUser) {
        router.push(`/`);
      } else {
        throw new Error("Something went wrong :'(");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  console.log("Hook value: ", user);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        direction="column"
        alignContent="center"
        justifyContent="center"
      >
        <Grid item>
          <TextField
            style={{ marginTop: 16 }}
            error={errors.username ? true : false}
            helperText={errors.username ? errors.username.message : null}
            id="username"
            label="Username"
            type="text"
            {...register("username", {
              required: { value: true, message: "Please enter a username." },
              minLength: {
                value: 3,
                message: "Please enter a username between 3-16 characters.",
              },
              maxLength: {
                value: 16,
                message: "Please enter a username between 3-16 characters.",
              },
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : null}
            id="email"
            label="Email"
            type="email"
            {...register("email", {
              required: { value: true, message: "Please enter a email." },
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : null}
            id="password"
            label="Password"
            type="password"
            {...register("password", {
              required: { value: true, message: "Please enter a Password." },
              minLength: {
                value: 8,
                message:
                  "Please enter a stronger Password longer than 8 characters.",
              },
            })}
          />
        </Grid>
        {showCode && (
          <Grid item>
            <TextField
              variant="outlined"
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : null}
              id="code"
              label="Varification Code"
              type="text"
              {...register("code", {
                required: { value: true, message: "Please enter a username." },
                minLength: {
                  value: 6,
                  message: "Incorrect varification code.",
                },
                maxLength: {
                  value: 6,
                  message: "Incorrect varification code.",
                },
              })}
            />
          </Grid>
        )}

        <Grid marginTop={3}>
          <Button variant="contained" type="submit">
            {showCode ? "Confirm Code" : "Sign Up"}
          </Button>
        </Grid>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {signUpError}
          </Alert>
        </Snackbar>
      </Grid>
    </form>
  );
}
