import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/Auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import z from "zod";

const FormSchema = z.object({
  pin: z.string().length(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email || ""; //face this problem also use this way to get email from location state
  const [confermed, setConfirmed] = useState(false);

  const [sendOtp] = useSendOtpMutation();

  const [verifyOtp] = useVerifyOtpMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleConfirmed = async () => {
    const toastId = toast.loading("Sending OTP...");
    try {
      const res = await sendOtp({ email: email }).unwrap();

      if (res.success) {
        toast.success("OTP sent successfully!", { id: toastId });
        setConfirmed(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
      return;
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const toastId = toast.loading("verify OTP...");
    const userInfo = {
      email: email,
      otp: data.pin,
    };
    console.log("OTP submitted:", data);
    toast.success("Verification code submitted!");

    try {
      const res = await verifyOtp(userInfo).unwrap();
      if (res.success) {
        toast.success("OTP verified successfully!", { id: toastId });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
      return;
    }
  };

  // Redirect if no email
  // if (!email) {
  //   navigate("/");
  //   return null;
  // }

  return (
    <div className="grid place-content-center h-screen  ">
      <Toaster position="top-right" richColors />
      {confermed ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Verify your email address</CardTitle>
            <CardDescription>
              Please enter the 6-digit verification code sent to your <br />
              {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-64"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        <Button variant="link">Recent OTP</Button>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Verify
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Verify your email address</CardTitle>
            <CardDescription>
              we will send you OTP at <br />
              {email}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleConfirmed}
              className="w-[300px]"
              form="otp-form"
              type="submit"
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default Verify;
