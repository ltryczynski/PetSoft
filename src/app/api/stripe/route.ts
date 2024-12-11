import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";




export async function POST(request: Request) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || "";
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (e) {
        console.log('webhook verification failed')
        return Response.json(null, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            await prisma.user.update({
                where: {
                    email: event.data.object.customer_email || ''
                },
                data: {
                    hasAccess: true
                }
            })
            break;
        default:
            return Response.json(null, { status: 400 });
    }
}