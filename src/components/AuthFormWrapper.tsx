import { title } from "process";
import React, { ReactNode } from "react";
interface AuthFormWrapperProps {
    title: string;
    children: ReactNode;
}
const AuthFromWrapper = ({ title, children } : AuthFormWrapperProps)=> {
    return (
        <div className="w-full max-w-md bg-white rounded-xl shadowlg p-8">
            <h2 className="text-3xl font-bold text-center mb-8 textprimary">
                {title}
            </h2>
            {children}
        </div>
    );
};
export default AuthFromWrapper