import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PurchaseConfirmationProps {
  name?: string;
  amount?: number;
  purchaseId?: string;
}

export function PurchaseConfirmationTemplate({
  name = "there",
  amount = 99,
  purchaseId = "",
}: PurchaseConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for purchasing King Template!</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#f9fafb" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Heading style={{ fontSize: "24px", marginBottom: "16px" }}>
            Thank you for your purchase!
          </Heading>
          <Text style={{ fontSize: "16px", color: "#374151" }}>
            Hi {name}, your purchase of King Template is confirmed.
          </Text>
          <Section style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "16px" }}>
            <Text style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px" }}>
              <strong>Amount:</strong> ${amount}
            </Text>
            {purchaseId && (
              <Text style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
                <strong>Order ID:</strong> {purchaseId}
              </Text>
            )}
          </Section>
          <Text style={{ fontSize: "16px", color: "#374151", marginTop: "24px" }}>
            To get access to the repository, go to your dashboard and enter your GitHub username. We will send you a collaborator invitation.
          </Text>
          <Text style={{ fontSize: "14px", color: "#9ca3af", marginTop: "32px" }}>
            King Template
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
