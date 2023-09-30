import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import { Auth } from "aws-amplify";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  password: string;
}

export default function Login() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [signInError, setSignInError] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await Auth.signIn(data.username, data.password);
      router.push(`/`);
    } catch (error: any) {
      console.error(error);
      setSignInError(error.message);
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          direction="column"
          alignContent="center"
          justifyContent="center"
        >
          {" "}
          <Grid item>
            <TextField
              style={{ marginTop: 16 }}
              variant="outlined"
              id="username"
              label="Username"
              type="text"
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : null}
              {...register("username")}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              id="password"
              label="Password"
              type="password"
              error={errors.password ? true : false}
              helperText={errors.password ? errors.password.message : null}
              {...register("password")}
            />
          </Grid>
          <Grid style={{ marginTop: 16 }}>
            <Button variant="contained" type="submit">
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {signInError}
        </Alert>
      </Snackbar>
    </>
  );
}
