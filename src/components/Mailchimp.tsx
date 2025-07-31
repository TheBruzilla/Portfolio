"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
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
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  // Load reCAPTCHA script & initialize
  useEffect(() => {
    const recaptchaReady = () => {
      (window as any).grecaptcha.ready(() => {
        console.log("reCAPTCHA is ready!");
      });
    };

    if (!(window as any).grecaptcha) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=6LfDIpYrAAAAANH8N6nXoXOj_1IZNvtelhpH13Qp";
      script.async = true;
      script.defer = true;
      script.onload = recaptchaReady;
      document.body.appendChild(script);
    } else {
      recaptchaReady();
    }
  }, []);

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

    const grecaptcha = (window as any).grecaptcha;
    if (!grecaptcha) {
      setError("Captcha not loaded. Please refresh and try again.");
      setStatus("error");
      return;
    }

    const token = await grecaptcha.execute('6LfDIpYrAAAAANH8N6nXoXOj_1IZNvtelhpH13Qp', { action: 'submit' });

    if (!token) {
      setError("Captcha verification failed.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, phone, recaptchaToken: token })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhone("");
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
    <>
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
            opacity: mailchimp.effects.dots.opacity as opacity,
            size: mailchimp.effects.dots.size as SpacingToken
          }}
          grid={{
            ...mailchimp.effects.grid,
            opacity: mailchimp.effects.grid.opacity as opacity
          }}
          lines={{
            ...mailchimp.effects.lines,
            opacity: mailchimp.effects.lines.opacity as opacity,
            size: mailchimp.effects.lines.size as SpacingToken
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
          <Flex
            id="mc_embed_signup_scroll"
            fillWidth
            maxWidth={24}
            direction="column"
            gap="16"
          >
            <Flex fillWidth gap="8" mobileDirection="column">
              <Input
                id="FNAME"
                name="FNAME"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                id="LNAME"
                name="LNAME"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Flex>

            <Input
              id="EMAIL"
              name="EMAIL"
              type="email"
              placeholder="Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              errorMessage={error}
            />

            <Input
              id="PHONE"
              name="PHONE"
              type="tel"
              placeholder="Phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
          <Text onBackground="brand-strong" marginTop="s">
            Subscription successful. Please check your email.
          </Text>
        )}
        {status === "error" && (
          <Text onBackground="accent-strong" marginTop="s">
            {error}
          </Text>
        )}
      </Column>
    </>
  );
};
