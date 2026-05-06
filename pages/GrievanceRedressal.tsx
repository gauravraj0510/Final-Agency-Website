import React from "react";
import LegalPage from "./LegalPage";

const GrievanceRedressal: React.FC = () => (
  <LegalPage title="Grievance Redressal">
    <p>
      In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the Digital Personal Data Protection Act, 2023, <strong>AVELIX PRIVATE LIMITED</strong> has appointed the following Grievance Officer.
    </p>

    <h2>Grievance Officer</h2>
    <table>
      <tbody>
        <tr><td><strong>Name</strong></td><td>Gaurav Raj</td></tr>
        <tr><td><strong>Designation</strong></td><td>Director &amp; Authorised Signatory, Avelix Private Limited</td></tr>
        <tr><td><strong>Email</strong></td><td><a href="mailto:hello@avelix.io">hello@avelix.io</a></td></tr>
        <tr>
          <td><strong>Address</strong></td>
          <td>Asteria - A Wing, Flat No. 906, Tower No. 1, Courtyard, Thane West, Thane, Maharashtra 400610, India</td>
        </tr>
      </tbody>
    </table>

    <h2>How to file a grievance</h2>
    <p>Send an email to <a href="mailto:hello@avelix.io">hello@avelix.io</a> with the subject line &ldquo;Grievance&rdquo; and include:</p>
    <ol>
      <li>Your full name and contact details</li>
      <li>A clear description of the grievance</li>
      <li>Any supporting documents or screenshots</li>
      <li>The relief or action sought</li>
    </ol>
    <p>You may also send a physical letter to the address above.</p>

    <h2>Response timelines</h2>
    <ul>
      <li><strong>Acknowledgement:</strong> within 24 hours of receipt</li>
      <li><strong>Resolution:</strong> within 15 days of receipt</li>
    </ul>
    <p>If we are unable to resolve your grievance within 15 days, we will provide you with a status update and an expected resolution date.</p>

    <h2>Escalation</h2>
    <p>If you are not satisfied with the resolution provided by the Grievance Officer, you may escalate the matter to:</p>
    <ul>
      <li><strong>The Data Protection Board of India</strong> (under the DPDP Act, 2023) &mdash; once operational</li>
      <li><strong>The Ministry of Electronics &amp; Information Technology</strong> for IT Rules-related grievances</li>
      <li><strong>The Consumer Helpline</strong> at <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer">consumerhelpline.gov.in</a> or 1915 for consumer-related grievances</li>
    </ul>
  </LegalPage>
);

export default GrievanceRedressal;
