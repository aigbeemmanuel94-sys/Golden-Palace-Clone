import { useState } from "react";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Diamond } from "lucide-react";
import { useRegister, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useRegister();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg("");
    registerMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          setLocation("/");
        },
        onError: (error: any) => {
          setErrorMsg(error?.response?.data?.error || error?.message || "Registration failed. Please try again.");
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-card p-8 md:p-12 border border-border shadow-xl relative overflow-hidden">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/40 -translate-x-2 -translate-y-2"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/40 translate-x-2 -translate-y-2"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/40 -translate-x-2 translate-y-2"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/40 translate-x-2 translate-y-2"></div>

          <div className="text-center mb-10 relative z-10">
            <Link href="/" className="inline-block mb-8">
              <Diamond className="w-10 h-10 text-primary mx-auto mb-2" strokeWidth={1} />
              <h1 className="font-serif text-2xl font-bold tracking-tight text-primary">
                GOLD PALACE
              </h1>
              <p className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase mt-1">
                Est. 1921
              </p>
            </Link>
            
            <h2 className="font-serif text-3xl text-foreground mb-2">Create Account</h2>
            <p className="text-sm text-muted-foreground">Join the Gold Palace Insider</p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="mb-6 rounded-none border-destructive/50 bg-destructive/10 text-destructive">
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane" {...field} className="h-12 rounded-none border-border focus-visible:ring-primary bg-background" data-testid="input-firstname" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} className="h-12 rounded-none border-border focus-visible:ring-primary bg-background" data-testid="input-lastname" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} className="h-12 rounded-none border-border focus-visible:ring-primary bg-background" data-testid="input-email" />
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
                    <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-none border-border focus-visible:ring-primary bg-background" data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <p className="text-xs text-muted-foreground/70 italic text-center pt-2">
                We store your email securely. We'll never share it.
              </p>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs" 
                  disabled={registerMutation.isPending}
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground relative z-10">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-foreground transition-colors uppercase tracking-widest text-xs ml-1" data-testid="link-to-login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
