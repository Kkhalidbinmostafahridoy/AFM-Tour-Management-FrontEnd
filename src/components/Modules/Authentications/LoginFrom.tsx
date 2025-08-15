/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
import { useLoginMutation } from "@/redux/features/Auth/auth.api";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Add defaultValues to avoid uncontrolled inputs
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login] = useLoginMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Form submitted", data);

    try {
      const result = await login(data as any).unwrap();
      console.log("Login result", result);

      // Redirect after successful login
      toast.success("Login successful!");
      // navigate("/"); // Change to your actual dashboard route
    } catch (error: any) {
      console.log("Login error", error);

      // Handle unverified account
      if (error?.data?.message?.includes("not verified")) {
        toast.error("Your account is not verified, please verify first.");
        navigate("/verify", {
          state: location?.state || { email: data.email }, //email not verify and send again otp in this mail use  location?.state || { email: data.email
        });
        return;
      }

      // Invalid credentials
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to login
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
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
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
      <div className="relative text-center text-sm after:absolute after:top-1/2 after:z-0 after:flex">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          {/* http://localhost:5000/api/v1/auth/google */}
          or continue with
        </span>
      </div>

      {/* for google authentication */}
      <Button
        onClick={() =>
          window.open(
            `${
              import.meta.env.VITE_API_BASE_URL ||
              "http://localhost:5000/api/v1"
            }/auth/google`,
            "_self"
          )
        }
        type="button"
        variant="outline"
      >
        Login with Google
      </Button>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
}
