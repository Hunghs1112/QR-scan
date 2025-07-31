import { decodeQR } from "../screen/Encoding";

interface VietQRData {
    bin: string;
    nation: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    merchantName: string;
    amount?: string;
    result?: any
}

export async function parseAndSendVietQR(qrContent: string): Promise<VietQRData | null> {
    const parsed = decodeQR(qrContent);

    if (!parsed.valid) {
        console.warn("❌ Mã QR không hợp lệ:", parsed.message);
        return null;
    }

    console.log("✅ Mã QR hợp lệ");
    console.log("🔢 BIN:", parsed.bin);
    console.log("🌐 Quốc gia:", parsed.nation);
    console.log("🏦 Ngân hàng:", parsed.bankName);
    console.log("🔤 Bank code:", parsed.bankCode);
    console.log("🔢 Số tài khoản:", parsed.accountNumber);
    console.log("👤 Tên người nhận:", parsed.merchantName);
    console.log("💰 Số tiền:", parsed.amount ? parsed.amount + " VND" : "Không có");

    try {
        const response = await fetch("https://api.banklookup.net", {
            method: "POST",
            headers: {
                "x-api-key": "0d0cab53-ad4f-46e2-a0cf-a87dd3287e84key",
                "x-api-secret": "064703d0-293b-43ed-82e0-ec6c4f6e05a4secret",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bank: parsed.bankCode,
                account: parsed.accountNumber,
            }),
        });

        const result = await response.json();
        console.log("📡 API response:", result);

        return {
            bin: parsed.bin!,
            nation: parsed.nation!,
            bankName: parsed.bankName!,
            bankCode: parsed.bankCode!,
            accountNumber: parsed.accountNumber!,
            merchantName: parsed.merchantName!,
            amount: parsed.amount,
            result: result
        };
    } catch (error) {
        console.error("🚨 Gọi API thất bại:", error);
        return null;
    }
}
