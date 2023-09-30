// import Select from "react-select"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import { useState } from "react";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

export default function Signup() {
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log("form submitted ");
    console.log(data);

    try {
      signUpWithEmailAndPassword(data);
    } catch (err: any) {
      console.error(err);
      setSignUpError(err.message);
      setOpen(true);
    }
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  console.log("Errors: ", errors);

  async function signUpWithEmailAndPassword(data: IFormInput) {
    const { username, password, email } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email, // optional
        },
        autoSignIn: {
          // optional - enables auto sign in after user is confirmed
          enabled: true,
        },
      });
      console.log(user);
    } catch (error) {
      console.log("error signing up:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        direction="column"
        alignContent="center"
        justifyContent="center"
        spacing={2}
        margin={3}
      >
        <Grid item>
          <TextField
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
        <Grid marginTop={3}>
          <Button variant="contained" type="submit">
            Sign Up
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
