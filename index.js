"use strict";

const { crc16ccitt } = require("./crc16"); // Đảm bảo file crc16.js nằm cùng thư mục
const { BanksObject } = require("./banks");

// const rawQR = "00020101021138540010A00000072701240006970422011009119673630208QRIBFTTA53037045802VN63046ad9";
// const rawQR = "00020101021138570010A00000072701270006970405011322082054793800208QRIBFTTA53037045802VN630497A6";
// const rawQR = "00020101021138540010A00000072701240006970407011014137171110208QRIBFTTA5204601153037045802VN5903TCB6005Hanoi6304bb7d";
// const rawQR = "00020101021138530010A0000007270123000697041601092576788590208QRIBFTTA53037045802VN6304AE9F";

const FieldID = {
    VERSION: "00",
    INIT_METHOD: "01",
    VIETQR: "38",
    CURRENCY: "53",
    AMOUNT: "54",
    NATION: "58",
    MERCHANT_NAME: "59",
    CITY: "60",
    CRC: "63",
};

const ProviderFieldID = {
    GUID: "00",
    DATA: "01",
    SERVICE: "02",
};

const VietQRConsumerFieldID = {
    BANK_BIN: "00",
    BANK_NUMBER: "01",
};

const QRProviderGUID = {
    VIETQR: "A000000727",
};

// ==== Parse Logic ====
function sliceContent(content) {
    const id = content.slice(0, 2);
    const length = Number(content.slice(2, 4));
    const value = content.slice(4, 4 + length);
    const nextValue = content.slice(4 + length);
    return { id, length, value, nextValue };
}

function genCRCCode(content) {
    const crcCode = crc16ccitt(content).toString(16).toUpperCase();
    return `0000${crcCode}`.slice(-4);
}

function verifyCRC(content) {
    const checkContent = content.slice(0, -4);
    const crcCode = content.slice(-4).toUpperCase();
    const genCrcCode = genCRCCode(checkContent);
    return crcCode === genCrcCode;
}
function resolveBankInfo(bin) {
    const tryBins = [bin, bin.slice(0, 6), bin.slice(0, 5), bin.slice(0, 4)];
    for (const b of tryBins) {
        const bank = Object.values(BanksObject).find(bank => bank.bin === b);
        if (bank) {
            return {
                name: bank.shortName || bank.name,
                code: bank.code,
                swiftCode: bank.swiftCode || null,
                vietQRStatus: bank.vietQRStatus,
            };
        }
    }
    return {
        name: "Không xác định",
        code: "UNKNOWN",
        swiftCode: null,
        vietQRStatus: -1,
    };
}


function parseVietQRConsumer(content, consumer) {
    let { id, value, nextValue } = sliceContent(content);
    if (id === VietQRConsumerFieldID.BANK_BIN) consumer.bankBin = value;
    if (id === VietQRConsumerFieldID.BANK_NUMBER) consumer.bankNumber = value;
    if (nextValue.length >= 4) parseVietQRConsumer(nextValue, consumer);
}

function parseProviderInfo(content, provider, consumer) {
    let { id, value, nextValue } = sliceContent(content);
    if (id === ProviderFieldID.GUID) provider.guid = value;
    if (id === ProviderFieldID.DATA && provider.guid === QRProviderGUID.VIETQR) {
        provider.name = "VIETQR";
        parseVietQRConsumer(value, consumer);
    }
    if (id === ProviderFieldID.SERVICE) provider.service = value;
    if (nextValue.length >= 4) parseProviderInfo(nextValue, provider, consumer);
}

function parseRootContent(content, result) {
    let { id, value, nextValue } = sliceContent(content);

    switch (id) {
        case FieldID.NATION:
            result.nation = value;
            break;
        case FieldID.MERCHANT_NAME:
            result.merchantName = value;
            break;
        case FieldID.CURRENCY:
            result.currency = value;
            break;
        case FieldID.AMOUNT:
            result.amount = value;
            break;
        case FieldID.VIETQR:
            parseProviderInfo(value, result.provider, result.consumer);
            break;
        case FieldID.CRC:
            result.crc = value;
            break;
    }

    if (nextValue.length >= 4) parseRootContent(nextValue, result);
}

function decodeQR(content) {
    if (!verifyCRC(content)) {
        console.log("Mã QR không hợp lệ (CRC sai)");
        return;
    }
    const result = {
        consumer: { bankBin: "", bankNumber: "" },
        provider: { guid: "", service: "", name: "" },
        merchantName: "",
        nation: "",
        currency: "",
        amount: "",
    };

    parseRootContent(content, result);

    const bankInfo = resolveBankInfo(result.consumer.bankBin);

    console.log("✅ Mã QR hợp lệ");
    console.log("🔢 BIN:", result.consumer.bankBin);
    console.log("🌐 Quốc gia:", result.nation);
    console.log("🏦 Ngân hàng:", bankInfo.name);
    console.log("🔤 Bank code:", bankInfo.code);
    console.log("🔢 Số tài khoản:", result.consumer.bankNumber);
    console.log("👤 Tên người nhận:", result.merchantName);
    console.log("💰 Số tiền:", result.amount ? result.amount + " VND" : "Không có");
}

decodeQR(rawQR);
