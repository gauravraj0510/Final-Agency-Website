import React from "react";
import LegalPage from "./LegalPage";

const CookiePolicy: React.FC = () => (
  <LegalPage title="Cookie Policy">
    <p className="text-sm text-gray-500">
      <strong>Effective Date:</strong> 1 May 2026
    </p>

    <p>This Cookie Policy explains what cookies are and how <strong>AVELIX PRIVATE LIMITED</strong> uses them on avelix.io.</p>

    <h2>What are cookies?</h2>
    <p>Cookies are small text files placed on your device when you visit a website. They help websites remember you and your preferences.</p>

    <h2>Cookies we use</h2>
    <table>
      <thead>
        <tr><th>Type</th><th>Purpose</th><th>Duration</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Essential</strong></td><td>Required for the Site to function (e.g., session, security)</td><td>Session</td></tr>
        <tr><td><strong>Analytics</strong></td><td>Help us understand how visitors use the Site (e.g., Google Analytics)</td><td>Up to 24 months</td></tr>
        <tr><td><strong>Functional</strong></td><td>Remember your preferences (e.g., language)</td><td>Up to 12 months</td></tr>
      </tbody>
    </table>

    <p>We do NOT use advertising/tracking cookies for third-party marketing.</p>

    <h2>Your choices</h2>
    <p>You can:</p>
    <ul>
      <li>Accept or reject non-essential cookies via the consent banner shown on first visit</li>
      <li>Change your preferences at any time via the cookie-settings link in the footer</li>
      <li>Block or delete cookies via your browser settings</li>
    </ul>
    <p>Note: blocking essential cookies may break some site functionality.</p>

    <h2>Contact</h2>
    <p>For questions, email <a href="mailto:hello@avelix.io">hello@avelix.io</a>.</p>
  </LegalPage>
);

export default CookiePolicy;
