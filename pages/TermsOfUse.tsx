import React from "react";
import LegalPage from "./LegalPage";

const TermsOfUse: React.FC = () => (
  <LegalPage
    title="Terms of Use"
    description="Terms governing your access to and use of avelix.io. Operated by Avelix Private Limited under the laws of India."
    canonical="https://avelix.io/terms"
  >
    <p className="text-sm text-gray-500">
      <strong>Effective Date:</strong> 1 May 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> 6 May 2026
    </p>

    <p>
      These Terms of Use ("Terms") govern your access to and use of <strong>avelix.io</strong> ("Site") operated by <strong>AVELIX PRIVATE LIMITED</strong> ("Avelix", "we", "us"). By using the Site you agree to these Terms.
    </p>

    <h2>1. Use of the Site</h2>
    <p>You may use the Site for lawful, personal or business purposes. You must not:</p>
    <ul>
      <li>Use the Site to violate any law</li>
      <li>Attempt to gain unauthorised access</li>
      <li>Disrupt or interfere with the Site</li>
      <li>Use automated tools (scrapers, bots) without our written consent</li>
      <li>Reverse engineer or copy substantial portions of the Site</li>
      <li>Misrepresent your identity</li>
    </ul>

    <h2>2. Intellectual Property</h2>
    <p>All content on the Site (text, graphics, logos, images, software) is the property of Avelix or its licensors and protected under Indian and international copyright and trademark law. You may not reproduce, distribute, or create derivative works without our written consent.</p>

    <h2>3. Engagement Terms</h2>
    <p>Engaging Avelix for advisory or consulting services creates a separate contractual relationship governed by an Engagement Letter signed between you and Avelix. These Terms govern only your use of the Site, not any engagement.</p>

    <h2>4. No Professional Advice</h2>
    <p>The content on this Site is for general information only. It does not constitute professional advice, business advice, legal advice, financial advice, or any other regulated advice. You should engage Avelix directly (via a signed Engagement Letter) for tailored consultation.</p>

    <h2>5. Disclaimer of Warranties</h2>
    <p>The Site is provided "as is" and "as available" without warranties of any kind. Avelix does not warrant that the Site will be uninterrupted, error-free, or free from viruses.</p>

    <h2>6. Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, Avelix's total liability arising from your use of the Site shall not exceed &#8377;10,000 or the amount you have paid to Avelix in the preceding 12 months, whichever is greater. Avelix shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>

    <h2>7. Third-Party Links</h2>
    <p>The Site may contain links to third-party websites. Avelix does not control or endorse these and is not responsible for their content or practices.</p>

    <h2>8. Indemnification</h2>
    <p>You agree to indemnify and hold Avelix harmless from any claims arising out of your violation of these Terms or misuse of the Site.</p>

    <h2>9. Governing Law and Jurisdiction</h2>
    <p>These Terms are governed by the laws of India. Any dispute shall be subject to the <strong>exclusive jurisdiction of the courts at Thane, Maharashtra, India</strong>.</p>

    <h2>10. Modifications</h2>
    <p>We may modify these Terms at any time. Continued use of the Site after changes constitutes acceptance.</p>

    <h2>11. Contact</h2>
    <p>For questions about these Terms, email <a href="mailto:hello@avelix.io">hello@avelix.io</a>.</p>
  </LegalPage>
);

export default TermsOfUse;
