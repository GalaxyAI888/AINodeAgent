"use client";
import * as React from "react";
import type { FormFieldContextValue } from ".";

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);
