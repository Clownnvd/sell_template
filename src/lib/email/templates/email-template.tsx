import * as React from 'react';

interface WelcomeEmailProps {
  firstName: string;
}

export function WelcomeEmail({ firstName }: WelcomeEmailProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  );
}