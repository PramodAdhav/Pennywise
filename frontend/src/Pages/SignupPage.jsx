import AuthForm from "../components/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#d1cfc0] flex flex-col items-center justify-center px-4">
      {/* Title */}
      <h1 className="instrument-serif-regular-italic text-7xl font-bold text-black mb-10">
        Pennywise
      </h1>

      {/* Auth Form */}
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
