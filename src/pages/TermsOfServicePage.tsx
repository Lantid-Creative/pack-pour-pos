import { Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-landing-muted text-sm mb-12">Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-10 text-landing-muted text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using Lantid's point-of-sale and inventory management platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">2. Description of Service</h2>
              <p>Lantid provides a cloud-based POS and inventory management platform designed for Nigerian wholesale and retail businesses. Features include point-of-sale processing, inventory tracking, staff management, customer management, crate tracking, credit sales management, and business analytics.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">3. Account Registration</h2>
              <p className="mb-3">To use the Service, you must:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Create an account with accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly notify us of any unauthorized use of your account</li>
                <li>Be at least 18 years of age or the legal age in your jurisdiction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">4. Subscription & Billing</h2>
              <p className="mb-3">Lantid offers a free trial period followed by paid subscription plans:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Free trial: 14-day full access to all features</li>
                <li>Subscription fees are billed according to your selected plan</li>
                <li>Payments are processed through Paystack</li>
                <li>You may cancel your subscription at any time; access continues until the end of the billing period</li>
                <li>We reserve the right to modify pricing with 30 days' notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">5. Acceptable Use</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to other accounts or systems</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Reverse-engineer, decompile, or attempt to extract the source code</li>
                <li>Resell or redistribute the Service without our written consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">6. Data Ownership</h2>
              <p>You retain ownership of all data you input into the Service, including sales records, inventory data, customer information, and staff details. We do not claim ownership of your business data. You grant us a limited license to use this data solely to provide and improve the Service.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">7. Service Availability</h2>
              <p>We strive to maintain high availability but do not guarantee uninterrupted access. We may temporarily suspend the Service for maintenance, updates, or circumstances beyond our control. We will make reasonable efforts to notify you of planned downtime.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by Nigerian law, Lantid shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of the Service.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">9. Termination</h2>
              <p>We may suspend or terminate your access to the Service if you violate these Terms. Upon termination, your right to use the Service ceases immediately. You may request export of your data within 30 days of termination.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">10. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be resolved in the courts of Nigeria.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">11. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use after changes constitutes acceptance of the new Terms.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">12. Contact</h2>
              <p>For questions about these Terms, contact us at <a href="mailto:hello@lantid.store" className="text-landing-purple hover:underline">hello@lantid.store</a>.</p>
            </section>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
