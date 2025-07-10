
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
          <DialogDescription>Last updated: {new Date().toLocaleDateString()}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using our CRM platform service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. Service Description</h3>
              <p className="text-gray-700 leading-relaxed">
                Our platform provides customer relationship management (CRM) services including contact management, sales pipeline tracking, lead management, task organization, and business analytics tools. We offer these services through a secure, cloud-based platform accessible via your chosen subdomain.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. User Registration and Account</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                To use our service, you must register by providing accurate information including:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Your first name and last name</li>
                <li>A valid email address</li>
                <li>A unique subdomain for your CRM instance</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. Acceptable Use Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree not to use the service for any unlawful purposes or in any way that could damage, disable, or impair the service. Prohibited activities include but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Attempting to gain unauthorized access to any part of the service</li>
                <li>Using the service to transmit harmful, offensive, or illegal content</li>
                <li>Interfering with or disrupting the service or servers</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Data Privacy and Security</h3>
              <p className="text-gray-700 leading-relaxed">
                We collect and process your personal information (first name, last name, email address, and subdomain) in accordance with our Privacy Policy. You retain ownership of your data, and we implement appropriate security measures to protect it. We will never sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">6. Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed">
                Our liability is limited to the amount paid for the service in the preceding twelve months. We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">7. Contact Information</h3>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@crmplatform.com" className="text-blue-600 hover:underline">support@crmplatform.com</a>.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
