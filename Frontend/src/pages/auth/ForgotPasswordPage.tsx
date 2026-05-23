import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import api from "../../services/api";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      setSubmitted(true);
      toast.success("Reset link sent if email exists");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600 mb-8">
            We've sent a password reset link to your email address.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">Back to login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" loading={loading} className="w-full mt-4">
          Send Reset Link
        </Button>
        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
