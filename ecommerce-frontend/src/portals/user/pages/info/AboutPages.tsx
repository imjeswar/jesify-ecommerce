import React from 'react';
import { InfoLayout } from './InfoLayout';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactUs: React.FC = () => {
  return (
    <InfoLayout title="Contact Us">
      <p className="mb-6">
        We'd love to hear from you! Whether you have a question about our products, need assistance with an order, or just want to share your feedback, our team is here to help.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm">support@jesify.com</p>
          <p className="text-sm">queries@jesify.com</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-sm">7904181537</p>
          <p className="text-sm">Mon-Sat, 9am - 6pm</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Corporate Office</h3>
          <p className="text-sm">Jesify Tech Village,</p>
          <p className="text-sm">Trichy 621216, India</p>
        </div>
      </div>
    </InfoLayout>
  );
};

export const AboutUs: React.FC = () => {
  return (
    <InfoLayout title="About Us">
      <div className="space-y-6">
        <p>
          Welcome to <span className="font-brand text-primary-600 font-bold">Jesify</span>, your number one source for all things unique. We're dedicated to giving you the very best of products, with a focus on dependability, customer service, and uniqueness.
        </p>
        <p>
          Founded in 2026Jesify has come a long way from its beginnings in a home office. When we first started out, our passion for helping other parents be more eco-friendly drove us to do intense research, and gave us the impetus to turn hard work and inspiration into to a booming online store.
        </p>
        <p>
          We now serve customers all over the world, and are thrilled to be a part of the quirky, eco-friendly, fair trade wing of the industry.
        </p>
        <p>
          We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
      </div>
    </InfoLayout>
  );
};

export const Careers: React.FC = () => {
  return (
    <InfoLayout title="Careers at Jesify">
      <p className="lead text-xl text-gray-500 mb-8">
        Join us in building the future of e-commerce. We are looking for passionate individuals who want to make a difference.
      </p>
      
      <div className="space-y-8">
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Why Work With Us?</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Innovative and fast-paced environment</li>
            <li>Opportunities for growth and learning</li>
            <li>Inclusive and diverse culture</li>
            <li>Competitive compensation and benefits</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Open Positions</h3>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
            <p className="text-gray-700">
              We currently don't have specific openings listed here, but we are always looking for talent! 
              Send your resume to <a href="mailto:careers@jesify.com" className="text-primary-600 hover:underline">careers@jesify.com</a>.
            </p>
          </div>
        </div>
      </div>
    </InfoLayout>
  );
};
