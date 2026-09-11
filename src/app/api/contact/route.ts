import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "../../../../data.json";
export async function POST(req: Request) {
    try {
        const { name, email, subject, message } = await req.json();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === "465",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${site.name}" <${process.env.SMTP_USER}>`,
            to: process.env.NOTIFICATION_RECIPIENT,
            replyTo: email,
            subject: `[Portfolio Contact] ${subject} — ${name}`,

            text: `
NEW PORTFOLIO INQUIRY

Name: ${name}
Email: ${email}
Topic: ${subject}

Message:
${message}
    `.trim(),

            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Portfolio Inquiry</title>
</head>

<body style="
    margin: 0;
    padding: 40px 20px;
    background: #e9ddff;
    font-family: Arial, Helvetica, sans-serif;
    color: #17131c;
">

    <div style="
        max-width: 640px;
        margin: 0 auto;
    ">

        <!-- Header -->
        <div style="
            background: #a66cff;
            border: 3px solid #000000;
            box-shadow: 7px 7px 0 #000000;
            padding: 24px;
            margin-bottom: 28px;
        ">
            <div style="
                display: inline-block;
                background: #ffe477;
                border: 2px solid #000000;
                padding: 6px 10px;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 14px;
            ">
                Portfolio / Contact
            </div>

            <h1 style="
                margin: 0;
                font-size: 32px;
                line-height: 1.05;
                font-weight: 900;
                letter-spacing: -1px;
            ">
                New Inquiry
            </h1>

            <p style="
                margin: 10px 0 0;
                font-size: 15px;
                font-weight: 600;
            ">
                Someone just dropped a message in your inbox.
            </p>
        </div>


        <!-- Main Card -->
        <div style="
            background: #f8f4ff;
            border: 3px solid #000000;
            box-shadow: 7px 7px 0 #000000;
            padding: 28px;
        ">

            <!-- Sender -->
            <div style="
                margin-bottom: 26px;
                padding-bottom: 22px;
                border-bottom: 3px solid #000000;
            ">

                <p style="
                    margin: 0 0 7px;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                ">
                    From
                </p>

                <p style="
                    margin: 0;
                    font-size: 24px;
                    line-height: 1.2;
                    font-weight: 900;
                ">
                    ${name}
                </p>

                <p style="
                    margin: 7px 0 0;
                    font-size: 15px;
                    font-weight: 600;
                ">
                    ${email}
                </p>
            </div>


            <!-- Subject -->
            <div style="
                background: #ffe477;
                border: 3px solid #000000;
                padding: 16px;
                margin-bottom: 26px;
                box-shadow: 4px 4px 0 #000000;
            ">

                <p style="
                    margin: 0 0 6px;
                    font-size: 10px;
                    font-weight: 900;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                ">
                    Topic
                </p>

                <p style="
                    margin: 0;
                    font-size: 18px;
                    line-height: 1.3;
                    font-weight: 900;
                ">
                    ${subject}
                </p>
            </div>


            <!-- Message -->
            <div>
                <p style="
                    margin: 0 0 12px;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                ">
                    Message
                </p>

                <div style="
                    background: #ffffff;
                    border: 3px solid #000000;
                    padding: 20px;
                    font-size: 16px;
                    line-height: 1.65;
                    font-weight: 500;
                    white-space: pre-wrap;
                ">
                    ${message}
                </div>
            </div>


            <!-- Reply Button -->
            <div style="
                margin-top: 28px;
            ">
                <a
                    href="mailto:${email}"
                    style="
                        display: inline-block;
                        background: #a66cff;
                        color: #000000;
                        border: 3px solid #000000;
                        box-shadow: 5px 5px 0 #000000;
                        padding: 13px 20px;
                        font-size: 14px;
                        font-weight: 900;
                        text-decoration: none;
                    "
                >
                    REPLY TO ${name.toUpperCase()} →
                </a>
            </div>

        </div>


        <!-- Footer -->
        <div style="
            margin-top: 24px;
            padding: 0 4px;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.5;
        ">
            <span style="
                display: inline-block;
                width: 10px;
                height: 10px;
                background: #a66cff;
                border: 2px solid #000000;
                vertical-align: middle;
                margin-right: 6px;
            "></span>

            Sent from your portfolio contact form.
        </div>

    </div>

</body>
</html>
    `.trim(),
        });


        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("SMTP Error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}