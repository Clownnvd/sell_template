import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink } from "lucide-react";

const faqs = [
  {
    question: "How do I create a new project?",
    answer: "Navigate to the Projects page and click the 'New Project' button. Fill in the project details and click 'Create'.",
  },
  {
    question: "How do I invite team members?",
    answer: "Go to the Team page and click 'Invite Member'. Enter their email address and select their role.",
  },
  {
    question: "How do I upgrade my plan?",
    answer: "Visit the Billing page to view available plans and upgrade. You can also manage your subscription from there.",
  },
  {
    question: "How do I change my password?",
    answer: "Go to Settings > Account and click on 'Change Password'. You'll need to enter your current password to confirm.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription from the Billing page. Click 'Manage Subscription' to access the billing portal.",
  },
];

const resources = [
  {
    title: "Documentation",
    description: "Read our comprehensive guides and tutorials",
    icon: Book,
    href: "#",
  },
  {
    title: "Community",
    description: "Join our community and connect with other users",
    icon: MessageCircle,
    href: "#",
  },
  {
    title: "Contact Support",
    description: "Get help from our support team",
    icon: Mail,
    href: "mailto:support@example.com",
  },
];

export default function HelpPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="mt-2 text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      {/* Resources */}
      <div className="mb-12 grid gap-4 md:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title} className="group hover:border-primary/50 transition-colors">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <resource.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {resource.description}
                </p>
                <a
                  href={resource.href}
                  className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Learn more
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border pb-6 last:border-0 last:pb-0">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="mt-8 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <h2 className="text-xl font-bold">Still need help?</h2>
          <p className="mt-2 text-muted-foreground">
            Our support team is available to help you with any questions
          </p>
          <Button className="mt-4" asChild>
            <a href="mailto:support@example.com">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
