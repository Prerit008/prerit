"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { IconRefresh } from "@tabler/icons-react";

export interface CaptchaRef {
    validate: () => boolean;
    reset: () => void;
}

interface Props {
    onVerify: (isValid: boolean) => void;
}

export const NeobrutalistCaptcha = forwardRef<CaptchaRef, Props>(
    ({ onVerify }, ref) => {
        const [num1, setNum1] = useState(0);
        const [num2, setNum2] = useState(0);
        const [userAnswer, setUserAnswer] = useState("");
        const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

        const generateProblem = () => {
            const n1 = Math.floor(Math.random() * 9) + 1;
            const n2 = Math.floor(Math.random() * 9) + 1;
            setNum1(n1);
            setNum2(n2);
            setUserAnswer("");
            setStatus("idle");
            onVerify(false);
        };

        useEffect(() => {
            generateProblem();
        }, []);

        useImperativeHandle(ref, () => ({
            validate: () => {
                const isValid = parseInt(userAnswer.trim(), 10) === num1 + num2;
                if (isValid) {
                    setStatus("success");
                    onVerify(true);
                    return true;
                } else {
                    setStatus("error");
                    onVerify(false);
                    return false;
                }
            },
            reset: generateProblem,
        }));

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setUserAnswer(val);
            setStatus("idle");

            // Auto-validate as the user types
            if (parseInt(val.trim(), 10) === num1 + num2) {
                setStatus("success");
                onVerify(true);
            } else {
                onVerify(false);
            }
        };

        return (
            <div className="flex flex-col gap-2 my-2">
                <label className="text-sm font-bold tracking-wider uppercase">
                    Human Verification / 002
                </label>

                <div className="flex items-center gap-3">
                    {/* Neobrutalist Expression Badge */}
                    <div className="flex items-center gap-2 border-2 border-black bg-[#FFE600] px-3 py-2 font-mono font-black text-black shadow-[3px_3px_0px_0px_#000] text-lg select-none">
                        <span>{num1}</span>
                        <span>+</span>
                        <span>{num2}</span>
                        <span>=</span>
                    </div>

                    {/* Input Field */}
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={handleChange}
                        placeholder="?"
                        required
                        className={`w-20 border-2 border-black p-2 font-mono text-lg font-bold text-center focus:outline-none transition-all ${status === "error"
                                ? "bg-red-200 border-red-600 text-red-900 shadow-[3px_3px_0px_0px_#DC2626]"
                                : status === "success"
                                    ? "bg-green-200 border-green-600 text-green-900 shadow-[3px_3px_0px_0px_#16A34A]"
                                    : "bg-white text-black shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px]"
                            }`}
                    />

                    {/* Refresh Button */}
                    <button
                        type="button"
                        onClick={generateProblem}
                        title="Get new challenge"
                        className="border-2 border-black bg-white p-2.5 text-black shadow-[3px_3px_0px_0px_#000] hover:bg-black hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000] transition-all"
                    >
                        <IconRefresh size={20} />
                    </button>
                </div>

                {status === "error" && (
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide mt-1">
                        Incorrect answer. Try again.
                    </p>
                )}
            </div>
        );
    }
);

NeobrutalistCaptcha.displayName = "NeobrutalistCaptcha";