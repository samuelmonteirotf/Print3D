import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET não configurado")
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 500 })
  }

  try {
    // Verificar assinatura do webhook
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    // Processar evento
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object

        // Atualizar status do pagamento no banco
        await sql`
          UPDATE orders
          SET payment_status = 'paid', status = 'processing', updated_at = CURRENT_TIMESTAMP
          WHERE stripe_payment_intent_id = ${paymentIntent.id}
        `

        console.log(`Pagamento confirmado: ${paymentIntent.id}`)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object

        // Atualizar status do pagamento no banco
        await sql`
          UPDATE orders
          SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
          WHERE stripe_payment_intent_id = ${failedPayment.id}
        `

        console.log(`Pagamento falhou: ${failedPayment.id}`)
        break

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 400 })
  }
}
