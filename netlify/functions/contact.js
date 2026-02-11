const { createClient } = require("@supabase/supabase-js");
const { Resend } = require("resend");

// ── Initialise clients from env vars ──
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

const OWNER_EMAIL = "arvinthsrinivas@gmail.com";

// ── CORS headers ──
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
};

exports.handler = async (event) => {
    // Handle preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        // ── Parse & validate ──
        const { name, email, message } = JSON.parse(event.body);

        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "All fields are required" }),
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid email address" }),
            };
        }

        // ── Save to Supabase ──
        const { error: dbError } = await supabase.from("messages").insert({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
        });

        if (dbError) {
            console.error("Supabase error:", dbError);
            // Continue even if DB save fails — email is more important
        }

        // ── Notify Arvinth ──
        await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: OWNER_EMAIL,
            subject: `💬 New message from ${name}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0f172a; color: #e2e8f0; border-radius: 16px;">
          <h2 style="color: #60a5fa; margin-bottom: 24px;">New Portfolio Message</h2>
          <div style="background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
            <p style="margin: 0 0 8px;"><strong style="color: #94a3b8;">From:</strong> ${name}</p>
            <p style="margin: 0 0 8px;"><strong style="color: #94a3b8;">Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
          </div>
          <div style="background: #1e293b; padding: 20px; border-radius: 12px;">
            <p style="margin: 0 0 8px;"><strong style="color: #94a3b8;">Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #64748b; font-size: 0.8rem; margin-top: 20px; text-align: center;">Sent from your portfolio website</p>
        </div>
      `,
        });

        // ── Auto-reply to sender ──
        await resend.emails.send({
            from: "Arvinth Srinivasasekar <onboarding@resend.dev>",
            to: email,
            subject: "Thanks for reaching out! 👋",
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0f172a; color: #e2e8f0; border-radius: 16px;">
          <h2 style="color: #60a5fa; margin-bottom: 16px;">Hi ${name}! 👋</h2>
          <p style="line-height: 1.7; margin-bottom: 16px;">Thank you so much for reaching out through my portfolio. I've received your message and will get back to you <strong>within 24 hours</strong>.</p>
          <p style="line-height: 1.7; margin-bottom: 16px;">In the meantime, feel free to connect with me:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://www.linkedin.com/in/arvinthsrinivas" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Connect on LinkedIn</a>
          </div>
          <p style="line-height: 1.7;">Looking forward to our conversation!</p>
          <p style="line-height: 1.7; margin-top: 24px;">Best regards,<br><strong>Arvinth Srinivasasekar</strong><br><span style="color: #94a3b8;">MS Data Science · King's College London</span></p>
        </div>
      `,
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: "Message sent!" }),
        };
    } catch (err) {
        console.error("Function error:", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Something went wrong. Please try again." }),
        };
    }
};
