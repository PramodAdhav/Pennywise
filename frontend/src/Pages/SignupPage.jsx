import Slideshow from "../components/Slideshow";
import AuthForm from "../components/AuthForm";
export default function SignupPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="bg-[#d1cfc0] text-white flex items-center justify-center">
        <Slideshow />
      </div>
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <AuthForm />
      </div>
    </div>
  );
}
