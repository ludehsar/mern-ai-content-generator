import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/schema/auth.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useEffect } from "react";
import { registerUser } from "@/store/slices/authSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InputElement from "../elements/input-element";
import { Form } from "@/components/ui/form";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginStatus = useSelector<
    RootState,
    "idle" | "pending" | "complete" | "failed"
  >((state) => state.auth.status);
  const user = useSelector<RootState, unknown>((state) => state.auth.user);
  const loginError = useSelector<RootState, Error | null>(
    (state) => state.auth.error
  );

  useEffect(() => {
    if (loginStatus === "pending") {
      form.clearErrors("root");
    }
  }, [loginStatus, form]);

  useEffect(() => {
    if (loginStatus === "complete" && user) {
      navigate("/dashboard");
    } else if (loginStatus === "failed" && loginError) {
      const errorMessage =
        loginError.message || "An error occurred during login";
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  }, [loginStatus, user, loginError, navigate, form]);

  function onSubmit(values: z.infer<typeof signupSchema>) {
    dispatch(registerUser(values));
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Hello</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <InputElement name="name" label="Name" />
                  </div>
                  <div className="grid gap-2">
                    <InputElement name="username" label="Username" />
                  </div>
                  <div className="grid gap-2">
                    <InputElement
                      name="password"
                      label="Password"
                      type="password"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
