import React, { ReactNode } from "react";

export const Mobile = ({ children }: { children: ReactNode }) => {
    return (
        <div className="block md:hidden">
            {children}
        </div>
    );
};

export const Desktop = ({ children }: { children: ReactNode }) => {
    return (
        <div className="hidden md:block">
            {children}
        </div>
    );
};
