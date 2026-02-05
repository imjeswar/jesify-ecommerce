import React from 'react';
import { InfoLayout } from './InfoLayout';
import { Shield, Lock, FileText } from 'lucide-react';

export const TermsOfUse: React.FC = () => {
  return (
    <InfoLayout title="Terms Of Use">
      <div className="flex items-start gap-4 mb-8">
        <FileText className="w-12 h-12 text-primary-500 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Agreement</h3>
          <p>
            By accessing or using Jesify, you agree to be bound by these Terms of Use.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-gray-900">1. Account Registration</h4>
        <p>You must provide accurate and complete information when creating an account.</p>
        
        <h4 className="font-bold text-gray-900">2. User Conduct</h4>
        <p>You agree not to misuse the platform or engage in any illegal activities.</p>
        
        <h4 className="font-bold text-gray-900">3. Product Descriptions</h4>
        <p>We attempt to be as accurate as possible, but do not warrant that product descriptions are error-free.</p>
        
        <p className="text-sm text-gray-500 mt-8">Last updated: February 2026</p>
      </div>
    </InfoLayout>
  );
};

export const Security: React.FC = () => {
  return (
    <InfoLayout title="Security">
      <div className="flex items-start gap-4 mb-8">
        <Shield className="w-12 h-12 text-primary-500 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your Security is Our Priority</h3>
          <p>
            We use industry-standard security measures to protect your personal information.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-gray-900">SSL Encryption</h4>
          <p>All data transmitted between your browser and our servers is encrypted using Secure Socket Layer (SSL) technology.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Payment Security</h4>
          <p>We do not store your full card details. Payments are processed by PCI-DSS compliant payment gateways.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Account Protection</h4>
          <p>We recommend using a strong password and enabling two-factor authentication if available.</p>
        </div>
      </div>
    </InfoLayout>
  );
};

export const Privacy: React.FC = () => {
  return (
    <InfoLayout title="Privacy Policy">
      <div className="flex items-start gap-4 mb-8">
        <Lock className="w-12 h-12 text-primary-500 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">We Respect Your Privacy</h3>
          <p>
            This policy explains how we collect, use, and share your information.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-gray-900">Information We Collect</h4>
        <p>We collect information you provide (name, address, email) and usage data (browsing history).</p>
        
        <h4 className="font-bold text-gray-900">How We Use Information</h4>
        <p>To process orders, improve our services, and send relevant updates.</p>
        
        <h4 className="font-bold text-gray-900">Data Sharing</h4>
        <p>We do not sell your personal data. We share it only with service providers (e.g., shipping companies) necessary to fulfill your order.</p>
        
        <h4 className="font-bold text-gray-900">Cookies</h4>
        <p>We use cookies to enhance your experience and analyze site traffic.</p>
      </div>
    </InfoLayout>
  );
};
