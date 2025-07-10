
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          <DialogDescription>Last updated: {new Date().toLocaleDateString()}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Information We Collect</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect only the essential personal information required to provide our CRM service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>First Name:</strong> Used for personalization, communication, and account identification</li>
                <li><strong>Last Name:</strong> Used for complete user identification and professional communication</li>
                <li><strong>Email Address:</strong> Used for account verification, login authentication, service communications, and support</li>
                <li><strong>Subdomain:</strong> Your unique identifier for accessing your dedicated CRM instance</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We do not collect any additional personal information beyond these four essential data points.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. How We Use Your Information</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use your personal information exclusively for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Create and manage your CRM account</li>
                <li>Provide access to your dedicated subdomain</li>
                <li>Send account verification emails and security notifications</li>
                <li>Provide customer support when requested</li>
                <li>Send essential service-related communications</li>
                <li>Ensure platform security and prevent unauthorized access</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Data Storage and Security</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement comprehensive security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Industry-standard encryption for data transmission and storage</li>
                <li>Secure, encrypted databases with regular security audits</li>
                <li>Multi-factor authentication and access controls</li>
                <li>Regular security updates and vulnerability assessments</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. Your Privacy Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request a copy of your personal information we hold</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
                <li><strong>Portability:</strong> Request your data in a structured, machine-readable format</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise these rights, please contact us at <a href="mailto:privacy@crmplatform.com" className="text-blue-600 hover:underline">privacy@crmplatform.com</a>.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Contact Us</h3>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@crmplatform.com" className="text-blue-600 hover:underline">privacy@crmplatform.com</a>.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
