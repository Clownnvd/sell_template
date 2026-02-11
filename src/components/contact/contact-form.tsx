"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations/contact";
import { Send } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: (formData.get("subject") as string) || undefined,
      message: formData.get("message") as string,
    };

    const result = contactFormSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormInput, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to send message");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
        <p className="font-medium text-emerald-700 dark:text-emerald-400">
          Message sent successfully!
        </p>
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-500">
          We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-foreground">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="contact-name"
          name="name"
          placeholder="Your name"
          className="mt-1.5"
          error={errors.name}
          required
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground">
          Email <span className="text-destructive">*</span>
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="mt-1.5"
          error={errors.email}
          required
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground">
          Subject
        </label>
        <Input
          id="contact-subject"
          name="subject"
          placeholder="What is this about?"
          className="mt-1.5"
          error={errors.subject}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-foreground">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="How can we help you?"
          className="mt-1.5 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 dark:bg-input/30 md:text-sm"
          required
        />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" variant="premium" size="lg" disabled={status === "submitting"}>
        <Send className="size-4" />
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
