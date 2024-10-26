"use client";
import { RefObject, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

export default function DemoLoginToaster() {
  useEffect(() => {
    toast(<LoginToaster />, { duration: 60000 });
  }, []);
  return <Toaster position="top-right" expand={false} />;
}

function LoginToaster() {
  const selectParagraph = (ref: RefObject<HTMLSpanElement>) => {
    if (!ref.current) return;
    const range = document.createRange();
    range.selectNode(ref.current);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  };

  const emailRef = useRef<HTMLSpanElement>(null);
  const passwordRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="">
      <p className="text-base font-medium mb-2 capitalize">Demo login details</p>
      <p className="text-md text-gray-950/80 mb-1" onClick={() => selectParagraph(emailRef)}>
        <span className="w-16 mr-2 inline-block font-medium">Login:</span>
        <span ref={emailRef}>example@gmail.com</span>
      </p>
      <p className="text-md text-gray-950/80" onClick={() => selectParagraph(passwordRef)}>
        <span className="w-16 inline-block mr-2 font-medium">Password:</span>
        <span ref={passwordRef}>example</span>
      </p>
    </div>
  );
}
