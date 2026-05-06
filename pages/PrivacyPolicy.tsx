import React from "react";
import LegalPage from "./LegalPage";

const PrivacyPolicy: React.FC = () => (
  <LegalPage title="Privacy Policy">
    <p className="text-sm text-gray-500">
      <strong>Effective Date:</strong> 1 May 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> 6 May 2026
    </p>

    <p>
      This Privacy Policy describes how <strong>AVELIX PRIVATE LIMITED</strong> (&ldquo;Avelix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, stores, and discloses your personal information when you visit avelix.io or engage with our services.
    </p>
    <p>
      This policy is published in accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Digital Personal Data Protection Act, 2023.
    </p>

    <h2>1. Information we collect</h2>
    <p>We may collect:</p>
    <ul>
      <li><strong>Identifiers:</strong> name, email address, phone number, company name, designation</li>
      <li><strong>Communications:</strong> messages you send via contact forms or email</li>
      <li><strong>Usage data:</strong> IP address, browser type, pages visited, time spent (via cookies and analytics)</li>
      <li><strong>Business data:</strong> GSTIN, PAN, address (only if you engage us for paid services)</li>
    </ul>
    <p>We do not knowingly collect personal data from children under 18.</p>

    <h2>2. Why we collect it (purposes)</h2>
    <ul>
      <li>To respond to enquiries and engagement requests</li>
      <li>To provide and improve our consulting and advisory services</li>
      <li>To send invoices and tax documents (where you&rsquo;ve engaged us)</li>
      <li>To send service-related communications</li>
      <li>To comply with applicable laws (Companies Act, IT Act, GST, FEMA)</li>
      <li>To analyse website traffic and improve user experience</li>
    </ul>

    <h2>3. Legal basis (DPDP Act 2023)</h2>
    <p>We process your personal data on the basis of:</p>
    <ul>
      <li>Your <strong>consent</strong> (e.g., when you submit a contact form)</li>
      <li>The need to perform a <strong>contract</strong> (e.g., when you engage Avelix)</li>
      <li>Compliance with a <strong>legal obligation</strong> (e.g., GST records)</li>
      <li>Our <strong>legitimate interests</strong> (e.g., website analytics)</li>
    </ul>

    <h2>4. How we share information</h2>
    <p>We do not sell or rent your personal data. We may share it with:</p>
    <ul>
      <li><strong>Service providers</strong> (e.g., email hosting, cloud storage) under confidentiality obligations</li>
      <li><strong>Legal authorities</strong> when required by law (court order, tax authority, etc.)</li>
      <li><strong>Banks and payment processors</strong> to process payments</li>
    </ul>
    <p>We never share your data with marketing companies or unaffiliated third parties.</p>

    <h2>5. International transfers</h2>
    <p>Your data may be processed outside India if we use cloud-hosted services. We ensure equivalent protection through contractual safeguards.</p>

    <h2>6. Retention</h2>
    <ul>
      <li>Contact-form data: 3 years from last interaction</li>
      <li>Engagement / contract data: 8 years from last interaction (per Companies Act and Income Tax Act)</li>
      <li>Cookies and analytics: per cookie type (see <a href="/cookies">Cookie Policy</a>)</li>
    </ul>

    <h2>7. Your rights</h2>
    <p>Under the DPDP Act 2023, you have the right to:</p>
    <ul>
      <li><strong>Access</strong> the personal data we hold about you</li>
      <li><strong>Correct or update</strong> inaccurate data</li>
      <li><strong>Erase</strong> your personal data (subject to legal retention requirements)</li>
      <li><strong>Withdraw consent</strong> at any time</li>
      <li><strong>Nominate</strong> another person to exercise these rights on your behalf</li>
      <li><strong>Lodge a grievance</strong> with our Grievance Officer (see <a href="/grievance">Grievance Redressal</a> page)</li>
    </ul>
    <p>To exercise any of these rights, email <a href="mailto:hello@avelix.io">hello@avelix.io</a> with the subject &ldquo;Data Rights Request&rdquo; and we will respond within 30 days.</p>

    <h2>8. Security</h2>
    <p>We use reasonable administrative, technical and physical safeguards (HTTPS, access controls, encrypted storage) to protect your data. No method is 100% secure; we cannot guarantee absolute security.</p>

    <h2>9. Cookies</h2>
    <p>See our <a href="/cookies">Cookie Policy</a> for details.</p>

    <h2>10. Changes to this policy</h2>
    <p>We may update this policy from time to time. The effective date at the top will reflect the latest revision. Material changes will be notified via the website.</p>

    <h2>11. Contact</h2>
    <p>For privacy questions, contact our Grievance Officer (see <a href="/grievance">Grievance Redressal</a>) or email <a href="mailto:hello@avelix.io">hello@avelix.io</a>.</p>
  </LegalPage>
);

export default PrivacyPolicy;
