"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const username = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  //const origin = (await headers()).get("origin");
  //check if username is unique
  if (!username) {
    return encodedRedirect("error", "/sign-up", "Username is required");
  }

  const { data: existingUsername, error: usernameError } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUsername) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "That username is already taken, try another one."
    );
  }
  console.log(existingUsername);

  if (!username || username.length > 12) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Username must be 12 characters or less"
    );
  }

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }
  //check if email is unique
  const { data: existingEmail, error: emailError } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .single();

  if (existingEmail) {
    return encodedRedirect("error", "/sign-up", "Email already exists");
  }
  // create the user in the auth table
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (!data.user) {
    return encodedRedirect("error", "/sign-up", "Something went wrong");
  }

  // insert the credentials into te profiles table
  const { error: profilesError } = await supabase.from("profiles").insert({
    user_id: data.user.id,
    username,
    email,
  });
  if (profilesError) {
    console.log(profilesError.code + " " + profilesError.message);
    return encodedRedirect("error", "/sign-up", profilesError.message);
  }
  //if all is good, redirect to the index
  return redirect("/");
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
