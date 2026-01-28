import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type VerifyEmailTemplateProps = {
  name?: string;
  url: string;
};

export function VerifyEmailTemplate(props: VerifyEmailTemplateProps) {
  const name = props.name?.trim() ? props.name : "there";
  const url = typeof props.url === "string" ? props.url.trim() : "";

  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>

      <Body style={{ fontFamily: "ui-sans-serif, system-ui" }}>
        <Container style={{ padding: "24px" }}>
          <Heading>Verify your email</Heading>

          <Text>Hi {name},</Text>

          {url ? (
            <>
              <Text>
                Thanks for signing up! Please confirm your email address by
                clicking the button below.
              </Text>

              <Section style={{ margin: "20px 0" }}>
                <Button
                  href={url}
                  style={{
                    background: "#111",
                    color: "#fff",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    textDecoration: "none",
                  }}
                >
                  Verify email
                </Button>
              </Section>

              <Text style={{ fontSize: 12, color: "#666" }}>
                Or copy and paste this link into your browser:
                <br />
                {url}
              </Text>
            </>
          ) : (
            <Text style={{ color: "#b91c1c" }}>
              We couldn’t generate a verification link. Please try signing in
              again to request a new one.
            </Text>
          )}

          <Text style={{ color: "#666", fontSize: "12px", marginTop: "24px" }}>
            If you didn&apos;t create an account, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
