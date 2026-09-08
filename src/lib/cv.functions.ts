import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { CvData } from "./cv-types";

const Input = z.object({
  mode: z.enum(["form", "paste"]),
  raw: z.string().min(10).max(20000),
});

const cvSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "name",
    "title",
    "location",
    "email",
    "phone",
    "summary",
    "experience",
    "education",
    "skills",
  ],
  properties: {
    name: { type: "string" },
    title: { type: "string" },
    location: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    summary: { type: "string" },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "company", "period", "detail"],
        properties: {
          role: { type: "string" },
          company: { type: "string" },
          period: { type: "string" },
          detail: { type: "string" },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["degree", "school", "period"],
        properties: {
          degree: { type: "string" },
          school: { type: "string" },
          period: { type: "string" },
        },
      },
    },
    skills: { type: "array", items: { type: "string" } },
  },
} as const;

const SYSTEM = `You are a professional CV writer. Turn the user's raw details into a clean, ATS-friendly CV.
Rules:
- Never invent employers, degrees, dates or contact details that are not present. Leave a field as an empty string if unknown.
- Rewrite descriptions as concise, achievement-led sentences (max 200 characters each).
- Summary: 2 sentences max, third-person-free, no buzzword padding.
- Skills: 5 to 10 short items.
- Keep the person's own language and spelling of names.`;

function extractText(payload: unknown): string {
  const data = payload as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;
  for (const item of data.output ?? []) {
    for (const part of item.content ?? []) {
      if (typeof part.text === "string" && part.text.trim()) return part.text;
    }
  }
  throw new Error("The AI response was empty. Please try again.");
}

export const generateCv = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured yet.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-terra",
        input: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content:
              data.mode === "paste"
                ? `Here is my existing CV text. Extract and improve it:\n\n${data.raw}`
                : `Here are my details. Build my CV:\n\n${data.raw}`,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "cv",
            strict: true,
            schema: cvSchema,
          },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Too many requests right now — try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits have run out. Please top up to keep generating CVs.");
      if (res.status === 403) throw new Error("AI access is currently blocked for this workspace.");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const text = extractText(await res.json());
    return JSON.parse(text) as CvData;
  });
