"use client";
import * as React from "react";
import type { FormItemContextValue } from ".";

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);
