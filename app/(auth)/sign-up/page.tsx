import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (  
    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 data-testid="sign-up-title" className="text-2xl font-medium">Sign up</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="username">Username</Label>
        <Input
          data-testid="username-field"
          id="username"
          type="text"
          name="username"
          placeholder="Your username"
          minLength={6}
          maxLength={12}
          required />
        <Label htmlFor="email">Email</Label>
        <Input 
          data-testid="email-field" 
          id="email" 
          type="email" 
          name="email" 
          placeholder="you@example.com" 
          required 
        />
        <Label htmlFor="password">Password</Label>
        <Input
          data-testid="password-field"
          id="password"
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
        />
        <SubmitButton 
          data-testid="sign-up-btn" 
          formAction={signUpAction} 
          pendingText="Signing up..."
        >
          Sign up
        </SubmitButton>
        {/* Only render FormMessage if there's actual content */}
        {(("success" in searchParams && searchParams.success) ||
          ("error" in searchParams && searchParams.error) ||
          ("message" in searchParams && searchParams.message)) && (
          <FormMessage message={searchParams} />
        )}
      </div>
      <p className="text-sm text text-foreground self-end">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline pl-2" href="/sign-in">
          Sign in
        </Link>
      </p>
    </form>
  );
}