import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, total, customer, items } = body;

    // Ambil Server Key dari environment variable
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json({ error: "Server Key Midtrans belum dikonfigurasi di .env.local" }, { status: 500 });
    }

    // Lakukan enkripsi token dasar (Base64) untuk otentikasi Midtrans
    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    // Format item belanjaan agar muncul secara detail di struk Midtrans
    const itemDetails = items.map((item: any) => ({
      id: item.id.toString(),
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    }));

    // Kirim request transaksi ke server Sandbox Midtrans
    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: total,
        },
        item_details: itemDetails,
        customer_details: {
          first_name: customer.name,
          phone: customer.phone,
          billing_address: {
            first_name: customer.name,
            phone: customer.phone,
            address: customer.address,
          },
          shipping_address: {
            first_name: customer.name,
            phone: customer.phone,
            address: customer.address,
          }
        },
        credit_card: {
          secure: true,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal berkomunikasi dengan Midtrans");
    }

    // Mengembalikan token Snap ke frontend
    return NextResponse.json({ token: data.token });
  } catch (error: any) {
    console.error("Midtrans API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}