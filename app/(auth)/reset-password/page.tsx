import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    return (
        <form data-testid="form-reset-password" className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
            <h1 className="text-2xl font-medium">Reset password</h1>
            <p className="text-sm text-foreground/60">
                Please enter your new password below.
            </p>
            <Label htmlFor="password">New password</Label>
            <Input
                id="password"
                type="password"
                name="password"
                placeholder="New password"
                required
            />
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                required
            />
            <SubmitButton formAction={resetPasswordAction}>
                Reset password
            </SubmitButton>
            <FormMessage data-testid="form-message" message={searchParams} />
        </form>
    );
}