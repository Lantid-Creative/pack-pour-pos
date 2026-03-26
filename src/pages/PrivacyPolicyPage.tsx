import { Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-landing-bg text-white">
        {/* Header */}
        <header className="border-b border-landing-border/40 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-landing-purple flex items-center justify-center shadow-md shadow-landing-purple/20">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Lantid</span>
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-landing-muted text-sm hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-landing-muted text-sm mb-12">Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-10 text-landing-muted text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">1. Introduction</h2>
              <p>Lantid ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our point-of-sale and inventory management platform.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Account information (name, email address, phone number)</li>
                <li>Store information (business name, address, contact details)</li>
                <li>Transaction data (sales records, inventory movements, payment information)</li>
                <li>Staff information (names, roles, permissions)</li>
                <li>Customer data (names, contact details, purchase history)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Generate analytics and business insights for your store</li>
                <li>Detect, investigate, and prevent fraudulent or unauthorized activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data, including encryption in transit and at rest, secure authentication, and role-based access controls. Your business data is isolated and only accessible to authorized users within your store.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">5. Data Retention</h2>
              <p>We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your data by contacting us at <a href="mailto:hello@lantid.store" className="text-landing-purple hover:underline">hello@lantid.store</a>.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">6. Third-Party Services</h2>
              <p>We may use third-party services for payment processing (Paystack), hosting, and analytics. These services have their own privacy policies governing how they use your information.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">7. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">9. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@lantid.store" className="text-landing-purple hover:underline">hello@lantid.store</a>.</p>
            </section>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
