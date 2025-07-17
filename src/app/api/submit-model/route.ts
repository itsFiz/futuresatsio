import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      modelName,
      authorName,
      email,
      xHandle,
      description,
      thesis,
      startingPrice,
      cagrValues,
      methodology,
      expectedOutcome
    } = body;

    // Validate required fields
    if (!modelName || !authorName || !email || !description || !thesis || !methodology || !expectedOutcome) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send confirmation email to the submitter
    const confirmationEmail = await resend.emails.send({
      from: 'FutureSats <noreply@futuresats.com>',
      to: [email],
      subject: `Model Submission Confirmation: ${modelName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">FutureSats Model Submission Confirmation</h2>
          <p>Dear ${authorName},</p>
          <p>Thank you for submitting your Bitcoin price model "<strong>${modelName}</strong>" to FutureSats.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Submission Details:</h3>
            <p><strong>Model Name:</strong> ${modelName}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Starting Price:</strong> $${startingPrice.toLocaleString()}</p>
            ${xHandle ? `<p><strong>Twitter/X Handle:</strong> ${xHandle}</p>` : ''}
          </div>
          
          <p>Our team will review your submission within 7-10 business days. We'll notify you via email once the review is complete.</p>
          
          <p>If you have any questions, please don't hesitate to reach out to us.</p>
          
          <p>Best regards,<br>The FutureSats Team</p>
        </div>
      `,
    });

    // Send notification email to admin (you can customize this)
    // const adminEmail = await resend.emails.send({
    //   from: 'FutureSats <noreply@futuresats.io>',
    //   to: [process.env.ADMIN_EMAIL || 'hello@f12.gg'],
    //   subject: `New Model Submission: ${modelName}`,
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //       <h2 style="color: #f97316;">New Model Submission</h2>
          
    //       <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    //         <h3 style="margin-top: 0;">Model Details:</h3>
    //         <p><strong>Model Name:</strong> ${modelName}</p>
    //         <p><strong>Author:</strong> ${authorName}</p>
    //         <p><strong>Email:</strong> ${email}</p>
    //         <p><strong>Description:</strong> ${description}</p>
    //         <p><strong>Starting Price:</strong> $${startingPrice.toLocaleString()}</p>
    //         ${xHandle ? `<p><strong>Twitter/X Handle:</strong> ${xHandle}</p>` : ''}
    //       </div>
          
    //       <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    //         <h3 style="margin-top: 0;">Thesis:</h3>
    //         <p>${thesis}</p>
    //       </div>
          
    //       <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    //         <h3 style="margin-top: 0;">Methodology:</h3>
    //         <p>${methodology}</p>
    //       </div>
          
    //       <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    //         <h3 style="margin-top: 0;">Expected Outcome:</h3>
    //         <p>${expectedOutcome}</p>
    //       </div>
          
    //       <p><strong>CAGR Values (first 5 years):</strong></p>
    //       <ul>
    //         ${cagrValues.slice(0, 5).map((cagr: number, index: number) => 
    //           `<li>Year ${index + 1}: ${cagr}%</li>`
    //         ).join('')}
    //       </ul>
    //     </div>
    //   `,
    // });

    // Save to database
    const submission = await prisma.modelSubmission.create({
      data: {
        modelName,
        authorName,
        email,
        xHandle,
        description,
        thesis,
        startingPrice,
        cagrValues,
        methodology,
        expectedOutcome,
        confirmationEmailSent: true,
        confirmationEmailId: confirmationEmail.data?.id,
      },
    });

    console.log('Model submission saved to database:', submission.id);

    return NextResponse.json({
      success: true,
      message: 'Model submitted successfully',
      emailId: confirmationEmail.data?.id
    });

  } catch (error) {
    console.error('Error submitting model:', error);
    return NextResponse.json(
      { error: 'Failed to submit model. Please try again.' },
      { status: 500 }
    );
  }
} 