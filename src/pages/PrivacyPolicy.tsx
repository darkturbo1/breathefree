import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-3xl mx-auto">
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              BreatheFree ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Email address</li>
                <li>Account credentials (securely encrypted)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Health & Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide our smoking cessation tracking features, we collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Quit date and smoking history</li>
                <li>Number of cigarettes per day (before quitting)</li>
                <li>Cost of cigarettes in your region</li>
                <li>Journal entries and mood tracking data</li>
                <li>App usage statistics</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Provide and maintain our services</li>
              <li>Track your progress and calculate health milestones</li>
              <li>Calculate money saved from not smoking</li>
              <li>Personalize your experience and provide motivational content</li>
              <li>Send you notifications (with your permission)</li>
              <li>Improve our app and develop new features</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using industry-standard encryption. We use secure cloud infrastructure to protect your information. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregated data for research purposes to help improve smoking cessation outcomes globally.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our app is not intended for children under 17 years of age. We do not knowingly collect personal information from children under 17.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-primary font-medium">
              hello@spinosimedia.ch
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
