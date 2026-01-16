import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { id: number };
}

// Membuat pesanan baru
export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { addressId, paymentMethod, shippingMethod, shippingCost } = req.body;

    if (!userId || !addressId || !paymentMethod || !shippingMethod)
      return res.status(400).json({ message: 'Data tidak lengkap (Alamat, Metode Bayar, Pengiriman)' });

    // Ambil semua item di keranjang
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0)
      return res.status(400).json({ message: 'Keranjang kosong' });

    // Cek stok dan hitung subtotal
    let subtotal = 0;
    for (const it of cartItems) {
      if (it.product.stock < it.quantity) {
        return res.status(400).json({
          message: `Stok tidak cukup untuk produk: ${it.product.name}`,
        });
      }
      subtotal += it.product.price * it.quantity;
    }

    const total = subtotal + Number(shippingCost || 0);

    // Buat order + item sekaligus
    const order = await prisma.order.create({
      data: {
        userId,
        addressId: Number(addressId),
        total,
        paymentMethod,
        shippingMethod,
        shippingCost: Number(shippingCost || 0),
        items: {
          create: cartItems.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            price: it.product.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    // Update stok produk
    await Promise.all(
      cartItems.map((it) =>
        prisma.product.update({
          where: { id: it.productId },
          data: { stock: it.product.stock - it.quantity },
        })
      )
    );

    // Kosongkan keranjang
    await prisma.cartItem.deleteMany({ where: { userId } });

    res.json({ message: 'Pesanan berhasil dibuat', order });
  } catch (error) {
    console.error('CreateOrder Error:', error);
    res
      .status(500)
      .json({ message: 'Terjadi kesalahan saat membuat pesanan', error });
  }
}

// Daftar semua pesanan user
export async function listOrders(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar pesanan', error });
  }
}

// Detail 1 pesanan
export async function getOrder(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    if (!order)
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail pesanan', error });
  }
}

// Update status pesanan
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status)
      return res.status(400).json({ message: 'Status harus diisi' });

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: 'Status pesanan diperbarui', updated });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status pesanan', error });
  }
}
