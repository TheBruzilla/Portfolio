"use client";

import { useState } from "react";
import { mailchimp } from "@/resources";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Background,
  Column,
  opacity,
  SpacingToken
} from "@once-ui-system/core";

type NewsletterProps = {
  display: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
};

export const Mailchimp = ({ newsletter }: { newsletter: NewsletterProps }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setEmail("");  // clear input field
      } else {
        setError(data.error || "Subscription failed.");
        setStatus("error");
      }
    } catch (err) {
      setError("Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
    >
<Background
  top="0"
  position="absolute"
  mask={mailchimp.effects.mask}
  gradient={{
    ...mailchimp.effects.gradient,
    opacity: mailchimp.effects.gradient.opacity as opacity
  }}
  dots={{
    ...mailchimp.effects.dots,
    opacity: mailchimp.effects.dots.opacity as opacity,  // ✅ Already Fixed
    size: mailchimp.effects.dots.size as SpacingToken    // 👈 THIS IS MISSING, FIX HERE
  }}
  grid={{
    ...mailchimp.effects.grid,
    opacity: mailchimp.effects.grid.opacity as opacity
  }}
  lines={{
    ...mailchimp.effects.lines,
    opacity: mailchimp.effects.lines.opacity as opacity
  }}
/>
      <Heading style={{ position: "relative" }} marginBottom="s" variant="display-strong-xs">
        {newsletter.title}
      </Heading>
      <Text
        style={{ position: "relative", maxWidth: "var(--responsive-width-xs)" }}
        wrap="balance"
        marginBottom="l"
        onBackground="neutral-medium"
      >
        {newsletter.description}
      </Text>

      <form onSubmit={handleSubmit}>
        <Flex id="mc_embed_signup_scroll" fillWidth maxWidth={24} mobileDirection="column" gap="8">
          <Input
            id="mce-EMAIL"
            name="EMAIL"
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage={error}
          />
          <div className="clear">
            <Flex height="48" vertical="center">
              <Button type="submit" size="m" fillWidth>
                Subscribe
              </Button>
            </Flex>
          </div>
        </Flex>
      </form>

      {status === "success" && (
        <Text onBackground="positive" marginTop="s">
          Subscription successful. Please check your email.
        </Text>
      )}
      {status === "error" && (
        <Text onBackground="negative" marginTop="s">
          {error}
        </Text>
      )}
    </Column>
  );
};
