/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "@/redux/features/Auth/auth.api";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const form = useForm();
  const [login] = useLoginMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    try {
      const result = await login(data).unwrap();
      toast.success("login Successfully");
      console.log(result);
    } catch (error) {
      console.log(error);
      // Check if error has a status property (RTK Query error format)
      if (error.status === 401) {
        toast.error("Your account is not verified, please Verified first.");
        navigate("/verify", { state: data.email });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div>
          {/* ✅ Wrap in Form to provide context */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your registered email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mr-2 h-4 w-4"
          >
            <path
              d="M12 0C5.372 0 0 5.372 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.754-1.333-1.754-1.09-.745.082-.73.082-.73 1.204.084 1.838 1.235 1.838 1.235 1.07 1.834 2.807 1.304 3.492.996.108-.774.42-1.305.763-1.605-2.665-.304-5.467-1.335-5.467-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.3 1.23a11.5 11.5 0 013.003-.403c1.02.005 2.045.138 3.003.403 2.29-1.553 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.623-5.48 5.92.43.37.81 1.096.81 2.21 0 1.595-.015 2.877-.015 3.27 0 .32.217.694.825.576C20.565 21.795 24 17.3 24 12c0-6.628-5.373-12-12-12z"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?
        <Link to="/register" className="underline underline-offset-4 mx-0.5">
          sign up
        </Link>
      </div>
    </div>
  );
}
