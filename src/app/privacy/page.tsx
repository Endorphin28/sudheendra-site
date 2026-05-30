import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy & Telemedicine Consent | Dr. Sudheendra Huddar",
  description: "Privacy policy and telemedicine consent notice for online consultations at doctorhuddar.com.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-ink mb-2">Privacy Policy</h1>
        <p className="text-sm text-ink-muted mb-12">Last updated: June 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-ink-soft leading-relaxed">

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">1. Information We Collect</h2>
            <p>When you book an appointment through doctorhuddar.com, we collect your name, email address, mobile number, and payment confirmation. We do not store credit/debit card details — payments are processed securely through Razorpay.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To confirm and manage your appointment</li>
              <li>To send your Google Meet consultation link</li>
              <li>To communicate appointment reminders or changes</li>
              <li>To maintain clinical records as required by applicable law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">3. Data Sharing</h2>
            <p>We do not sell, rent, or share your personal information with third parties except:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Razorpay (payment processing)</li>
              <li>Google (calendar and Meet for consultation delivery)</li>
              <li>Resend (transactional email delivery)</li>
            </ul>
            <p className="mt-2">All third parties are bound by their own privacy policies and applicable data protection laws.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">4. Telemedicine Consent Notice</h2>
            <p>By booking an online consultation, you acknowledge and agree to the following:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Nature of telemedicine:</strong> Online consultations are conducted via video (Google Meet) and are subject to technical limitations including connectivity issues.</li>
              <li><strong>Clinical limitations:</strong> Telemedicine does not replace an in-person examination. In emergencies or situations requiring physical assessment, you will be referred to an appropriate facility.</li>
              <li><strong>Confidentiality:</strong> All consultations are strictly confidential. You agree not to record the session without prior written consent.</li>
              <li><strong>Prescriptions:</strong> Prescriptions may be issued based on clinical judgment. Controlled substances may not be prescribed via telemedicine as per applicable guidelines.</li>
              <li><strong>Patient responsibility:</strong> You confirm that the information provided is accurate and that you are consulting from a private, secure location.</li>
              <li><strong>Jurisdiction:</strong> These consultations are governed by the laws of Karnataka, India and applicable national telemedicine guidelines (MCI Telemedicine Practice Guidelines 2020).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">5. Data Retention</h2>
            <p>Booking records are retained for a minimum of 3 years as required under applicable Indian medical record guidelines. You may request deletion of non-clinical data by contacting us.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">6. Contact</h2>
            <p>For any privacy-related queries, contact:</p>
            <p className="mt-2">
              <strong>Dr. Sudheendra Huddar</strong><br />
              Sukhibhava Healthcare, Deshpande Nagar, Hubballi – 580029<br />
              <a href="mailto:consultdrhuddar@gmail.com" className="text-accent hover:underline">consultdrhuddar@gmail.com</a><br />
              <a href="tel:+918073398651" className="text-accent hover:underline">80733 98651</a>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
