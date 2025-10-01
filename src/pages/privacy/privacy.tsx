import MarkdownRenderer from "@/utils/markdown-renderer";

const privacy = `# Privacy Policy for Britto Humanity

**Effective Date:** 26 September 2025

Britto Humanity respects your privacy and is committed to protecting the personal information of our users (“you,” “your”). This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application **Britto Humanity**.

---

## 1. Information We Collect
We may collect the following types of information when you use the app:

- **Personal Information (optional):** Name, email, phone number, or account details when you register.  
- **Usage Data:** Exam participation, scores, AI queries, and in-app interactions.  
- **Device Information:** Device type, operating system, and general log data (for performance and analytics).  
- **AI Ask System Data:** Questions you ask the AI may be processed to provide accurate answers.  

---

## 2. How We Use Information
We use the collected information to:

- Provide live exams, results, and personalized study guidance.  
- Improve app performance, features, and content.  
- Offer AI-based study support and recommendations.  
- Ensure a safe and effective user experience.  

---

## 3. Data Sharing & Disclosure
We do **not sell or rent** your personal data. However, we may share limited data:

- With **service providers** (e.g., hosting, analytics, AI providers) to operate the app.  
- If required by **law or government authorities**.  

---

## 4. Data Security
We use industry-standard security practices to protect your information.  
However, no method of data transmission or storage is 100% secure, and we cannot guarantee absolute security.  

---

## 5. Children’s Privacy
Britto Humanity is intended for students **16 years and above**.  
If you are under 16, please use the app under parental guidance.  
We do not knowingly collect data from children under 13.  

---

## 6. Your Rights
You may:

- Access or update your personal information.  
- Request deletion of your account and associated data.  
- Contact us for any privacy-related concerns.  

---

## 7. Changes to This Policy
We may update this Privacy Policy from time to time.  
Changes will be notified within the app or updated on this page.  

---

## 8. Contact Us
If you have any questions or concerns, please contact us:

- 📧 Email: britto.edu.office@gmail.com  
- 📍 Location: Bangladesh
`
const Privacy = () => {
    return (
        <div>
            <MarkdownRenderer content={privacy}/>
        </div>
    );
};

export default Privacy;