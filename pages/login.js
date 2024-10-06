import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  IconX,
  IconAlertCircle,
  IconTrees,
  IconBrandGoogle,
  IconBrandTwitter,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useUserContext } from "@/services/userContext";
import Banner from "@/components/Banner";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { useUserStore } from "@/store/user";
import Head from "next/head";

export default function Login() {
  const [signInWithGoogle, googleUser] = useSignInWithGoogle(auth);
  const { userStore, setUser } = useUserStore();

  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const {
    error,
    user,
    handlePasswordlessRedirect,
    loginWithGoogle,
    passwordLessLogin,
    emailSent,
  } = useUserContext();

  const redirectUser = () => {
    const redirectLink = window.localStorage.getItem("redirectAfterLogin");
    window.localStorage.removeItem("redirectAfterLogin");
    if (redirectLink) {
      router.push(redirectLink);
    } else {
      router.push("/profile");
    }
  };

  useEffect(() => {
    user || googleUser ? redirectUser() : null;

    if (window.location.href.includes("apiKey"))
      handlePasswordlessRedirect(window.location.href);
  }, [user]);

  const onSubmit = (data) => {
    console.log(data);
    if (data.email) passwordLessLogin(data.email);
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <IconTrees size={80} />
          </div>
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-base-content">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Show error if there is any */}
            {error && (
              <div className="alert alert-error">
                <div>
                  <IconAlertTriangle size={20} className="mr-2" />
                  <div>
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">{" " + error}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                      <IconX />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {emailSent ? (
              <div className="alert alert-success">
                <div>
                  <IconCircleCheck size={30} className="mr-2" />
                  <div>
                    <h3 className="font-bold">Email sent successfully!</h3>
                    <span className="text-xs">
                      Login link sent to the above email address. Close this tab
                      once you click that link.
                    </span>
                    <p className="text-xs">
                      (Check your <b>Promotions</b> or <b>Spam folder</b>)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert">
                <div>
                  <IconAlertCircle size={30} className="mr-2" />
                  <div>
                    <h3 className="font-bold">No need to create an account!</h3>
                    <span className="text-sm">
                      We have already taken care of that for you. A login link
                      would be sent to this email.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-control">
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                className="input input-bordered"
                autoComplete="email"
                type="email"
                required
                {...register("email")}
              />
            </div>

            {/* Password */}
            {/* <div className="form-control">
            <label className="label">
              <span
                className="label-text"
                htmlFor="password"
                // className="block text-sm font-medium leading-6 text-base-content"
              >
                Password
              </span>
              <span className="label-text-alt">
                <a
                  href="#"
                  className="font-semibold text-primary hover:text-secondary"
                >
                  Forgot password?
                </a>
              </span>
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              className="input input-bordered"
            />
          </div> */}

            <div className="form-control">
              <button type="submit" className="btn btn-primary">
                Sign in
              </button>
            </div>

            <div className="divider">Or continue with</div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  signInWithGoogle()
                    .then((res) => {
                      console.log("Success");
                      console.log(res);

                      setUser(res);
                      router.push("/profile");
                    })
                    .catch((err) => console.error(err));
                }}
                className="flex flex-row items-center justify-center gap-2 btn btn-white w-full"
              >
                <IconBrandGoogle /> Google
              </button>
            </div>
          </form>

          <p className="mt-10 text-sm text-center text-gray-500">
            Not a member?
            <a
              href="#"
              className="ml-2 font-semibold leading-6 text-primary hover:text-secondary"
            >
              Join and Donate us Now
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
