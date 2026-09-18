import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactInput = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(0).optional(),
});

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const submissions = new Map<string, number[]>();

function enforceSubmissionLimit(email: string) {
  const now = Date.now();
  const recent = (submissions.get(email) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    throw new Error("Too many contact attempts. Please try again later.");
  }

  recent.push(now);
  submissions.set(email, recent);

  if (submissions.size > 1000) {
    for (const [key, timestamps] of submissions) {
      if (timestamps.every((time) => now - time >= WINDOW_MS)) submissions.delete(key);
    }
  }
}

export const submitContact = createServerFn({ method: "POST" })
  .validator(contactInput)
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Invalid contact submission.");

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_TO_EMAIL;
    const sender = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !sender || !recipient) {
      throw new Error(
        "Contact email is not configured. Set RESEND_API_KEY, CONTACT_FROM_EMAIL, and CONTACT_TO_EMAIL.",
      );
    }

    enforceSubmissionLimit(data.email.toLowerCase());

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: data.email,
        subject: `Portfolio message from ${data.name}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Resend contact submission failed", response.status, details);
      throw new Error("Unable to send your message right now. Please try again later.");
    }

    return { sent: true };
  });
