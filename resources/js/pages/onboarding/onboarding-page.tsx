import * as React from "react";
import { login, register } from '@/routes';
import { router, usePage } from "@inertiajs/react";
import Background from "@/components/onboarding/background";
import Content from "@/components/onboarding/content";
import Indicators from "@/components/onboarding/indicators";
import NextButton from "@/components/onboarding/next-button";
import SkipButton from "@/components/onboarding/skip-button";
import { onboardingData } from "@/constants/onboarding-data";
import { useRoute } from 'ziggy-js';

export default function OnboardingPage() {
  const route = useRoute();
  const { auth } = usePage<{ auth?: { user: { id: string; name: string } } }>().props;
  const [index, setIndex] = React.useState(0);
  const total = onboardingData.length;
  const isLast = index === total - 1;

  // Redirect authenticated users to home
  React.useEffect(() => {
    if (auth?.user) {
      router.visit(route('home'));
    }
  }, [auth?.user, route]);

  const current = onboardingData[index];

  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));
  const goSkip = () => setIndex(total - 1);
  const goJump = (i: number) => setIndex(Math.max(0, Math.min(i, total - 1)));

  return (
    <Background image={current.image} imageAlt={current.imageAlt}>
      {/* Logo  */}
      <figure className="flex items-center justify-center py-4">
        <img
          src="/images/icon/logo-rescat.svg"
          alt="ResCat"
          className="h-full w-auto scale-[0.9] object-contain"
        />
      </figure>

      {/* middle content */}
      <div className="flex flex-col w-full md:mb-10 mb-6">
        <div className={`${isLast ? "pb-0" : "pb-24"}`}>
          <div className="mb-4">
            <Indicators total={total} current={index} onJump={goJump} />
          </div>
          <Content title={current.title} description={current.description} />

          {isLast && (
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={() => {
                  // Mark that user has seen onboarding and going to login
                  localStorage.setItem('everlogin', 'true');
                  router.visit(login());
                }}
                className="w-full rounded-full bg-white text-sky-700 font-semibold py-3 active:scale-[0.99] transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  // Mark that user has seen onboarding and going to register
                  localStorage.setItem('everlogin', 'true');
                  router.visit(register());
                }}
                className="w-full rounded-full bg-white/20 border-2 border-white text-white font-semibold py-3 active:scale-[0.99] transition"
              >
                Sign Up
              </button>
              <a href="/" className="text-white font-normal text-xs underline underline-offset-4 text-center w-fit self-center mt-1">
                Back and continue as Guest
              </a>
            </div>
          )}
        </div>
        <div className="mt-auto py-4">
          <div className="flex items-center justify-between gap-4">
            <SkipButton hidden={isLast} onSkip={goSkip} />
            <NextButton isLast={isLast} onNext={goNext} />
          </div>
        </div>
      </div>

    </Background>
  );
}
