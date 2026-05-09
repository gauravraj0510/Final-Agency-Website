import React from "react";
import LegalPage from "./LegalPage";

const Disclaimer: React.FC = () => (
  <LegalPage
    title="Disclaimer"
    description="Disclaimer regarding information published on avelix.io. Avelix does not provide professional advice through this Site."
    canonical="https://avelix.io/disclaimer"
  >
    <p>The information provided on <strong>avelix.io</strong> (the "Site") is for general informational purposes only.</p>

    <h2>No professional advice</h2>
    <p>Nothing on this Site constitutes professional advice, business advice, legal advice, tax advice, financial advice, or any other regulated advice. Avelix does not establish an advisor-client relationship through this Site.</p>
    <p>To obtain advisory or consulting services tailored to your situation, please engage <strong>AVELIX PRIVATE LIMITED</strong> through a signed Engagement Letter.</p>

    <h2>Accuracy</h2>
    <p>While we strive to keep information on the Site accurate and current, Avelix makes no representations or warranties about the completeness, accuracy, reliability, suitability, or availability of any information or content. Any reliance you place on such information is at your own risk.</p>

    <h2>Implementation</h2>
    <p>Avelix provides advisory and consultation services. Outcomes from acting on Avelix's recommendations depend on implementation by the client or third parties. Avelix is not liable for implementation results.</p>

    <h2>External links</h2>
    <p>The Site may contain links to third-party websites. These are provided for convenience only. Avelix does not endorse and is not responsible for the content or practices of these websites.</p>

    <h2>Limitation of liability</h2>
    <p>In no event shall Avelix, its directors, employees, or affiliates be liable for any loss or damage (including indirect or consequential loss) arising from your use of the Site or reliance on its content.</p>

    <h2>Governing law</h2>
    <p>This disclaimer is governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts at Thane, Maharashtra.</p>
  </LegalPage>
);

export default Disclaimer;
