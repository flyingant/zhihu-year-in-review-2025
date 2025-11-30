"use client";

import { useEffect } from "react";
import { initErrorHandling } from "@/lib/error-handler";

/**
 * Client component to initialize global error handlers
 * This must be a client component because it uses browser APIs
 */
export default function ErrorHandlingInit() {
  useEffect(() => {
    initErrorHandling();
  }, []);

  return null;
}

