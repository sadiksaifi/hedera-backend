import { Resend } from "resend";
// import sgMail from "@sendgrid/mail";

const resend = new Resend(process.env.RESEND_API_KEY);
export const sendMail = async (email: string, body: string) => {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: [email],
    subject: "Verify your account",
    html: body,
  });

  if (error) throw new Error(error.message);

  return data;
};

// const SEND_GRID_FROM_NAME = process.env.SEND_GRID_FROM_NAME!;
// const SEND_GRID_FROM_EMAIL = process.env.SEND_GRID_FROM_EMAIL!;
// const SEND_GRID_API = process.env.SEND_GRID_API!;
//
// export const sendMail = async (email: string, body: string) => {
//   const msg: sgMail.MailDataRequired = {
//     from: { name: SEND_GRID_FROM_NAME, email: SEND_GRID_FROM_EMAIL },
//     to: [email],
//     subject: "Verify you Account",
//     html: body,
//   };
//   sgMail.setApiKey(SEND_GRID_API!);
//
//   const res = await sgMail.send(msg);
//   console.log(res);
//
//   return data;
// };
